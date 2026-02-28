import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendDownloadEmail, sendCoachingConfirmationEmail, sendEventConfirmationEmail } from "@/lib/email";

type TierWithEvent = Prisma.TicketTierGetPayload<{
  include: {
    event: {
      include: { sessions: true };
    };
  };
}>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      invoice_id?: string;
      state?: string;
      api_ref?: string;
    };

    const { invoice_id, state, api_ref } = body;

    if (!api_ref) {
      return NextResponse.json(
        { error: "Missing api_ref (order ID)" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: api_ref },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (state === "COMPLETE" || state === "SUCCESSFUL") {
      if (order.status === "PAID") {
        return NextResponse.json({ received: true }); // idempotent
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentId: invoice_id ?? order.paymentId,
        },
      });

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
          // Prisma Accelerate extension breaks include type inference — cast explicitly
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
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    } else if (state === "FAILED") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("IntaSend webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
