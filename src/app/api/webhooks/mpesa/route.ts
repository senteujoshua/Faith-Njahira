import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
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

// Daraja STK Push callback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      Body: {
        stkCallback: {
          MerchantRequestID: string;
          CheckoutRequestID: string;
          ResultCode: number;
          ResultDesc: string;
          CallbackMetadata?: {
            Item: Array<{ Name: string; Value?: string | number }>;
          };
        };
      };
    };

    const { stkCallback } = body.Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    if (!CheckoutRequestID) {
      return NextResponse.json({ error: "Missing CheckoutRequestID" }, { status: 400 });
    }

    // Find order by the CheckoutRequestID stored during STK push initiation
    const order = await prisma.order.findFirst({
      where: { paymentId: CheckoutRequestID },
    });

    if (!order) {
      console.error(`Daraja webhook: no order found for CheckoutRequestID ${CheckoutRequestID}`);
      // Return 200 so Daraja doesn't retry
      return NextResponse.json({ received: true });
    }

    if (ResultCode === 0) {
      // Payment successful
      if (order.status === "PAID") {
        return NextResponse.json({ received: true }); // idempotent
      }

      // Extract M-Pesa receipt number from callback metadata
      const receipt = stkCallback.CallbackMetadata?.Item.find(
        (i) => i.Name === "MpesaReceiptNumber"
      )?.Value as string | undefined;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentId: receipt ?? CheckoutRequestID,
        },
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
            order.calendlyUrl || "https://calendly.com/faith-njahira";
          await sendCoachingConfirmationEmail(
            order.email,
            order.name,
            order.productName,
            calendlyUrl
          );
        } else if (order.productType === "EVENT" && order.tierId) {
          const tier = (await prisma.ticketTier.findUnique({
            where: { id: order.tierId },
            include: {
              event: {
                include: { sessions: { orderBy: { sessionNumber: "asc" } } },
              },
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
            });
          }
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } else {
      // Payment failed or cancelled (ResultCode 1032 = user cancelled)
      console.log(`Daraja STK callback failed: ${ResultDesc} (code ${ResultCode})`);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Daraja webhook error:", error);
    // Return 200 to prevent Daraja from retrying on our errors
    return NextResponse.json({ received: true });
  }
}
