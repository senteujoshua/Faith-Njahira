import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  sendDownloadEmail,
  sendCoachingConfirmationEmail,
  sendEventConfirmationEmail,
  sendInstallmentFailedEmail,
} from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// Stripe v20: subscription is nested under invoice.parent.subscription_details
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const raw =
    invoice.parent?.subscription_details?.subscription;
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "id" in raw) return (raw as Stripe.Subscription).id;
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.payment_succeeded":
        await handleInvoiceSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry — we log but don't crash
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// checkout.session.completed
// ---------------------------------------------------------------------------
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  // Idempotency: skip if already paid
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing || existing.status === "PAID") return;

  const paymentType = (session.metadata?.paymentType ?? "ONE_TIME") as "ONE_TIME" | "INSTALLMENT";

  const paymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : typeof session.subscription === "string"
      ? session.subscription
      : null;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentType,
      ...(paymentId ? { paymentId } : {}),
      ...(typeof session.subscription === "string"
        ? { stripeSubscriptionId: session.subscription }
        : {}),
    },
  });

  // If installment: create InstallmentSubscription record
  if (paymentType === "INSTALLMENT" && typeof session.subscription === "string") {
    const totalInstallments = parseInt(
      session.metadata?.installmentCount ?? "3"
    );

    const alreadyExists = await prisma.installmentSubscription.findUnique({
      where: { orderId: order.id },
    });

    if (!alreadyExists) {
      await prisma.installmentSubscription.create({
        data: {
          orderId: order.id,
          stripeSubscriptionId: session.subscription,
          totalInstallments,
          paidInstallments: 1,
          status: "ACTIVE",
        },
      });
    }
  }

  await sendConfirmationEmail(order);

  if (order.productType === "EVENT" && order.tierId) {
    await createEventRegistration(order, session);
  }
}

// ---------------------------------------------------------------------------
// invoice.payment_succeeded  (installment payments 2, 3, …)
// ---------------------------------------------------------------------------
async function handleInvoiceSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const sub = await prisma.installmentSubscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!sub) return;

  if (invoice.billing_reason === "subscription_create") return;

  const newPaidCount = sub.paidInstallments + 1;
  const isComplete = newPaidCount >= sub.totalInstallments;

  await prisma.installmentSubscription.update({
    where: { id: sub.id },
    data: {
      paidInstallments: newPaidCount,
      status: isComplete ? "COMPLETED" : "ACTIVE",
    },
  });

  if (isComplete) {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (err) {
      console.error("Failed to cancel completed subscription:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// invoice.payment_failed
// ---------------------------------------------------------------------------
async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  // Prisma Accelerate extension breaks include type inference — cast explicitly
  const sub = (await prisma.installmentSubscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { order: true },
  })) as (Prisma.InstallmentSubscriptionGetPayload<{
    include: { order: true };
  }>) | null;

  if (!sub) return;

  await prisma.installmentSubscription.update({
    where: { id: sub.id },
    data: { status: "FAILED" },
  });

  try {
    await sendInstallmentFailedEmail(
      sub.order.email,
      sub.order.name,
      sub.order.productName,
      sub.paidInstallments,
      sub.totalInstallments,
      sub.order.id
    );
  } catch (err) {
    console.error("Failed to send installment failure email:", err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function sendConfirmationEmail(order: {
  id: string;
  email: string;
  name: string;
  productType: string;
  productName: string;
  downloadToken: string | null;
  calendlyUrl: string | null;
  tierId: string | null;
}) {
  try {
    if (order.productType === "BOOK" && order.downloadToken) {
      await sendDownloadEmail(
        order.email,
        order.name,
        order.productName,
        order.downloadToken,
        order.id
      );
    } else if (order.productType === "COACHING") {
      const calendlyUrl =
        order.calendlyUrl || "https://calendly.com/faith-njahira";
      await sendCoachingConfirmationEmail(
        order.email,
        order.name,
        order.productName,
        calendlyUrl,
        order.id
      );
    }
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}

type TierWithEvent = Prisma.TicketTierGetPayload<{
  include: {
    event: {
      include: { sessions: true };
    };
  };
}>;

async function createEventRegistration(
  order: { id: string; email: string; name: string; tierId: string | null },
  session: Stripe.Checkout.Session
) {
  if (!order.tierId) return;

  // Prisma Accelerate extension breaks include type inference — cast explicitly
  const tier = (await prisma.ticketTier.findUnique({
    where: { id: order.tierId },
    include: {
      event: {
        include: { sessions: { orderBy: { sessionNumber: "asc" } } },
      },
    },
  })) as TierWithEvent | null;

  if (!tier) return;

  const existing = await prisma.eventRegistration.findUnique({
    where: { orderId: order.id },
  });
  if (existing) return;

  const seatCount = session.metadata?.seatCount
    ? parseInt(session.metadata.seatCount)
    : 1;

  await prisma.eventRegistration.create({
    data: {
      orderId: order.id,
      eventId: tier.eventId,
      tierId: order.tierId,
      seatCount,
    },
  });

  await sendEventConfirmationEmail({
    to: order.email,
    name: order.name,
    eventTitle: tier.event.title,
    tierName: tier.name,
    seatCount,
    orderRef: order.id,
    meetingLink: tier.event.meetingLink,
    meetingDetails: tier.event.meetingDetails,
    sessions: tier.event.sessions.map((s) => ({
      sessionNumber: s.sessionNumber,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      timezone: s.timezone,
    })),
    orderId: order.id,
  });
}
