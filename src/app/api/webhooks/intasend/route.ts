import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDownloadEmail, sendCoachingConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // IntaSend sends callback with invoice_id and state
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
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentId: invoice_id || order.paymentId,
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
            order.calendlyUrl ||
            process.env.NEXT_PUBLIC_CALENDLY_URL ||
            "https://calendly.com/faith-njahira";
          await sendCoachingConfirmationEmail(
            order.email,
            order.name,
            order.productName,
            calendlyUrl
          );
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
