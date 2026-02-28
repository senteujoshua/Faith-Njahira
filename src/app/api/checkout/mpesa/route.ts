import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiateStkPush } from "@/lib/mpesa";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let orderId: string;
    let phone: string;
    let amount: number;
    let productName: string;

    if (body.orderId) {
      // EventCheckoutModal flow: order already created, just initiate STK push
      const { orderId: id, phone: ph, amount: amt } = body as {
        orderId: string;
        phone: string;
        amount: number;
      };

      if (!id || !ph || !amt) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const existing = await prisma.order.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      orderId = id;
      phone = ph;
      amount = parseFloat(String(amt));
      productName = existing.productName;

      // Save phone on order if not already set
      if (!existing.phone) {
        await prisma.order.update({ where: { id }, data: { phone } });
      }
    } else {
      // CheckoutModal flow: create order then initiate STK push
      const { email, name, phone: ph, productType, productName: pn, amount: amt } = body as {
        email: string;
        name: string;
        phone: string;
        productType?: string;
        productName: string;
        amount: number | string;
      };

      if (!email || !name || !ph || !pn || !amt) {
        return NextResponse.json(
          { error: "Missing required fields (phone is required for M-Pesa)" },
          { status: 400 }
        );
      }

      const downloadToken = crypto.randomUUID();
      const tokenExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
      const resolvedType = productType || "BOOK";

      const order = await prisma.order.create({
        data: {
          email,
          name,
          phone: ph,
          productType: resolvedType,
          productName: pn,
          amount: parseFloat(String(amt)),
          currency: "KES",
          paymentMethod: "MPESA",
          status: "PENDING",
          downloadToken: resolvedType === "BOOK" ? downloadToken : null,
          tokenExpiresAt: resolvedType === "BOOK" ? tokenExpiresAt : null,
        },
      });

      orderId = order.id;
      phone = ph;
      amount = parseFloat(String(amt));
      productName = pn;
    }

    // Initiate Daraja STK push
    const { checkoutRequestId } = await initiateStkPush({
      phone,
      amount,
      orderId,
      description: productName,
    });

    // Store CheckoutRequestID so the webhook can look up this order
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: checkoutRequestId },
    });

    return NextResponse.json({
      orderId,
      message: "STK push sent to your phone. Enter your M-Pesa PIN to complete payment.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("M-Pesa checkout error:", message);
    return NextResponse.json(
      { error: "Failed to initiate M-Pesa payment", details: message },
      { status: 500 }
    );
  }
}

// Polling endpoint used by CheckoutModal
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, id: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status, orderId: order.id });
}
