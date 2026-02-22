import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 });
    }

    const currency = order.currency === "GBP" ? "GBP" : "USD";

    const paypalOrder = await createPayPalOrder({
      amount: order.amount,
      currency,
      description: order.productName,
      orderId: order.id,
      returnUrl: `${siteUrl}/api/checkout/paypal/capture?orderId=${order.id}`,
      cancelUrl: `${siteUrl}/events`,
    });

    // Update order to reflect PayPal method
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentMethod: "PAYPAL" },
    });

    return NextResponse.json({ approvalUrl: paypalOrder.approvalUrl, paypalOrderId: paypalOrder.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
  }
}
