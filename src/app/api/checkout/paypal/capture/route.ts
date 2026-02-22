import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { sendEventConfirmationEmail } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  return handleCapture(request);
}

export async function POST(request: NextRequest) {
  return handleCapture(request);
}

async function handleCapture(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const token = url.searchParams.get("token"); // PayPal order ID

    if (!orderId || !token) {
      return NextResponse.redirect(`${siteUrl}/events?error=missing_params`);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { tier: { include: { event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } } } } },
    });

    if (!order) {
      return NextResponse.redirect(`${siteUrl}/events?error=order_not_found`);
    }

    if (order.status === "PAID") {
      // Already processed (double-submit guard)
      return NextResponse.redirect(`${siteUrl}/events/success?ref=${orderId}`);
    }

    // Capture the PayPal payment
    const captureResult = await capturePayPalOrder(token);
    const captureId =
      captureResult?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentId: captureId || token,
      },
    });

    // Create registration
    if (order.tierId && order.tier?.eventId) {
      await prisma.eventRegistration.create({
        data: {
          orderId: order.id,
          eventId: order.tier.eventId,
          tierId: order.tierId,
          seatCount: 1, // PayPal flow defaults to 1; can be extended
        },
      });

      // Send confirmation email
      try {
        const event = order.tier.event;
        await sendEventConfirmationEmail({
          to: order.email,
          name: order.name,
          eventTitle: event.title,
          tierName: order.tier.name,
          seatCount: 1,
          orderRef: order.id,
          meetingLink: event.meetingLink,
          meetingDetails: event.meetingDetails,
          sessions: event.sessions.map((s) => ({
            sessionNumber: s.sessionNumber,
            title: s.title,
            startTime: s.startTime,
            endTime: s.endTime,
            timezone: s.timezone,
          })),
        });
      } catch (emailErr) {
        console.error("Failed to send event confirmation email:", emailErr);
      }
    }

    return NextResponse.redirect(`${siteUrl}/events/success?ref=${orderId}`);
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(`${siteUrl}/events?error=capture_failed`);
  }
}
