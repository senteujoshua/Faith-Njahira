import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayPalWebhook } from "@/lib/paypal";
import { sendEventConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

    // Convert headers to plain object
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => { headers[key] = value; });

    const isValid = await verifyPayPalWebhook({ headers, rawBody, webhookId });
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const captureId: string = event.resource?.id;
      const referenceId: string = event.resource?.supplementary_data?.related_ids?.order_id
        || event.resource?.purchase_units?.[0]?.reference_id;

      // Find our order by paymentId (captureId) or look up via reference
      let order = captureId
        ? await prisma.order.findFirst({ where: { paymentId: captureId } })
        : null;

      if (!order && referenceId) {
        order = await prisma.order.findUnique({ where: { id: referenceId } });
      }

      if (!order || order.status === "PAID") {
        return NextResponse.json({ received: true }); // idempotent
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paymentId: captureId || order.paymentId },
      });

      // Create registration if event order
      if (order.productType === "EVENT" && order.tierId) {
        const tier = await prisma.ticketTier.findUnique({
          where: { id: order.tierId },
          include: { event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } } },
        });

        const existingReg = await prisma.eventRegistration.findUnique({
          where: { orderId: order.id },
        });

        if (tier && !existingReg) {
          await prisma.eventRegistration.create({
            data: {
              orderId: order.id,
              eventId: tier.eventId,
              tierId: order.tierId,
              seatCount: 1,
            },
          });

          try {
            await sendEventConfirmationEmail({
              to: order.email,
              name: order.name,
              eventTitle: tier.event.title,
              tierName: tier.name,
              seatCount: 1,
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
          } catch (emailErr) {
            console.error("Failed to send event confirmation email:", emailErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
