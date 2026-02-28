import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthenticated } from "@/lib/admin-auth";
import { sendEventConfirmationEmail } from "@/lib/email";
import { refundPayPalCapture } from "@/lib/paypal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; regId: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { regId } = await params;
  const { action } = await request.json();

  const registration = (await prisma.eventRegistration.findUnique({
    where: { id: regId },
    include: {
      order: true,
      event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } },
      tier: true,
    },
  })) as Prisma.EventRegistrationGetPayload<{ include: { order: true; event: { include: { sessions: true } }; tier: true } }> | null;

  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (action === "resend-email") {
    await sendEventConfirmationEmail({
      to: registration.order.email,
      name: registration.order.name,
      eventTitle: registration.event.title,
      tierName: registration.tier.name,
      seatCount: registration.seatCount,
      orderRef: registration.order.id,
      meetingLink: registration.event.meetingLink,
      meetingDetails: registration.event.meetingDetails,
      sessions: registration.event.sessions.map((s) => ({
        sessionNumber: s.sessionNumber,
        title: s.title,
        startTime: s.startTime,
        endTime: s.endTime,
        timezone: s.timezone,
      })),
    });
    return NextResponse.json({ success: true, action: "resend-email" });
  }

  if (action === "refund") {
    const order = registration.order;

    if (order.status !== "PAID") {
      return NextResponse.json({ error: "Order is not in PAID status" }, { status: 400 });
    }

    if (order.paymentMethod === "STRIPE" && order.paymentId) {
      await stripe.refunds.create({ payment_intent: order.paymentId });
    } else if (order.paymentMethod === "PAYPAL" && order.paymentId) {
      await refundPayPalCapture(order.paymentId);
    } else {
      return NextResponse.json(
        { error: "No refundable payment found" },
        { status: 400 }
      );
    }

    // Mark order failed and decrement soldCount
    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } }),
      prisma.ticketTier.update({
        where: { id: registration.tierId },
        data: { soldCount: { decrement: registration.seatCount } },
      }),
    ]);

    return NextResponse.json({ success: true, action: "refund" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
