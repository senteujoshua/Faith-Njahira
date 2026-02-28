import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";
import { refundPayPalCapture } from "@/lib/paypal";
import { sendRefundEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { installmentSubscription: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "REFUNDED") {
    return NextResponse.json({ error: "Order already refunded" }, { status: 409 });
  }

  if (order.status !== "PAID") {
    return NextResponse.json(
      { error: "Only paid orders can be refunded" },
      { status: 400 }
    );
  }

  try {
    if (order.paymentMethod === "STRIPE") {
      if (order.paymentType === "INSTALLMENT" && order.stripeSubscriptionId) {
        // Cancel the subscription so no further charges occur
        try {
          await stripe.subscriptions.cancel(order.stripeSubscriptionId);
        } catch (err) {
          console.error("Failed to cancel subscription:", err);
        }

        // Refund the most recent invoice payment if a payment_intent exists
        if (order.paymentId) {
          await stripe.refunds.create({ payment_intent: order.paymentId });
        }
      } else if (order.paymentId) {
        // One-time payment refund
        await stripe.refunds.create({ payment_intent: order.paymentId });
      }
    } else if (order.paymentMethod === "PAYPAL" && order.paymentId) {
      await refundPayPalCapture(order.paymentId);
    } else if (order.paymentMethod === "MPESA") {
      // Daraja does not provide a programmatic reversal API for STK Push payments.
      // Process the reversal manually via the Safaricom Business portal.
      console.warn(
        `M-Pesa refund for order ${order.id} requires manual processing via the Safaricom Business portal.`
      );
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
        refundStatus: "REFUNDED",
      },
    });

    // If installment subscription exists, mark as canceled
    if (order.installmentSubscription) {
      await prisma.installmentSubscription.update({
        where: { id: order.installmentSubscription.id },
        data: { status: "CANCELED" },
      });
    }

    // Send refund confirmation email
    try {
      await sendRefundEmail(
        order.email,
        order.name,
        order.productName,
        order.amount,
        order.currency
      );
    } catch (emailErr) {
      console.error("Failed to send refund email:", emailErr);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Refund error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
