import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, productType, productName, amount } = body;

    if (!email || !name || !phone || !productName || !amount) {
      return NextResponse.json(
        { error: "Missing required fields (phone is required for M-Pesa)" },
        { status: 400 }
      );
    }

    const downloadToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        email,
        name,
        phone,
        productType: productType || "BOOK",
        productName,
        amount: parseFloat(amount),
        currency: "KES",
        paymentMethod: "MPESA",
        status: "PENDING",
        downloadToken: productType === "BOOK" ? downloadToken : null,
        tokenExpiresAt: productType === "BOOK" ? tokenExpiresAt : null,
      },
    });

    // IntaSend STK Push via REST API
    const isTestMode = process.env.INTASEND_TEST_MODE === "true";
    const baseUrl = isTestMode
      ? "https://sandbox.intasend.com"
      : "https://payment.intasend.com";

    const response = await fetch(`${baseUrl}/api/v1/payment/mpesa-stk-push/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTASEND_API_KEY}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        phone_number: phone,
        api_ref: order.id,
        narrative: productName,
        wallet_id: undefined,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "M-Pesa request failed", details: result },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: result.invoice?.invoice_id || result.id },
    });

    return NextResponse.json({
      orderId: order.id,
      message: "STK push sent. Check your phone to complete payment.",
      checkStatusUrl: `${siteUrl}/api/checkout/mpesa?orderId=${order.id}`,
    });
  } catch (error) {
    console.error("M-Pesa checkout error:", error);
    return NextResponse.json(
      { error: "Failed to initiate M-Pesa payment" },
      { status: 500 }
    );
  }
}

// GET endpoint to check M-Pesa payment status
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing orderId" },
      { status: 400 }
    );
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
