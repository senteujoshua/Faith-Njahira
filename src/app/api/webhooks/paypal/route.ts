import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPayPalWebhook } from "@/lib/paypal";
import {
  sendDownloadEmail,
  sendCoachingConfirmationEmail,
  sendEventConfirmationEmail,
} from "@/lib/email";

type TierWithEvent = Prisma.TicketTierGetPayload<{
  include: {
    event: {
      include: { sessions: true };
    };
  };
}>;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => { headers[key] = value; });

    const isValid = await verifyPayPalWebhook({ headers, rawBody, webhookId });
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as {
      event_type: string;
      resource?: {
        id?: string;
        supplementary_data?: {
          related_ids?: { order_id?: string };
        };
        purchase_units?: Array<{ reference_id?: string }>;
      };
    };

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const captureId: string | undefined = event.resource?.id;
      const referenceId: string | undefined =
        event.resource?.supplementary_data?.related_ids?.order_id ??
        event.resource?.purchase_units?.[0]?.reference_id;

      let order = captureId
        ? await prisma.order.findFirst({ where: { paymentId: captureId } })
        : null;

      if (!order && referenceId) {
        order = await prisma.order.findUnique({ where: { id: referenceId } });
      }

      if (!order || order.status === "PAID") {
        return NextResponse.json({ received: true });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paymentId: captureId ?? order.paymentId },
      });

      // Send confirmation emails per product type
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
        } else if (order.productType === "EVENT" && order.tierId) {
          const tier = (await prisma.ticketTier.findUnique({
            where: { id: order.tierId },
            include: {
              event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } },
            },
          })) as TierWithEvent | null;

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
              orderId: order.id,
            });
          }
        }
      } catch (emailErr) {
        console.error("Failed to send PayPal confirmation email:", emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
