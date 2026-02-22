import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendDownloadEmail, sendCoachingConfirmationEmail, sendEventConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

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
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      try {
        if (order.productType === "BOOK" && order.downloadToken) {
          await sendDownloadEmail(
            order.email,
            order.name,
            order.productName,
            order.downloadToken
          );
        } else if (order.productType === "COACHING") {
          const calendlyUrl =
            order.calendlyUrl ||
            process.env.NEXT_PUBLIC_CALENDLY_URL ||
            "https://calendly.com/faith-njahira";
          await sendCoachingConfirmationEmail(
            order.email,
            order.name,
            order.productName,
            calendlyUrl
          );
        } else if (order.productType === "EVENT" && order.tierId) {
          const tier = await prisma.ticketTier.findUnique({
            where: { id: order.tierId },
            include: {
              event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } },
            },
          });

          const existingReg = await prisma.eventRegistration.findUnique({
            where: { orderId: order.id },
          });

          if (tier && !existingReg) {
            // Retrieve seatCount from metadata if available
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
            });
          }
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
