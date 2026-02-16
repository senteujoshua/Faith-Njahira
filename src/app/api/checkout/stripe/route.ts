import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, productType, productName, amount, currency } = body;

    if (!email || !name || !productName || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const downloadToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    const order = await prisma.order.create({
      data: {
        email,
        name,
        productType: productType || "BOOK",
        productName,
        amount: parseFloat(amount),
        currency: currency || "USD",
        paymentMethod: "STRIPE",
        status: "PENDING",
        downloadToken: productType === "BOOK" ? downloadToken : null,
        tokenExpiresAt: productType === "BOOK" ? tokenExpiresAt : null,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: (currency || "USD").toLowerCase(),
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/shop/success?order=${order.id}`,
      cancel_url: `${siteUrl}/shop?cancelled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: session.id },
    });

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
