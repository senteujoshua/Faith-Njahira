import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      orderId?: string;
      email?: string;
      name?: string;
      productType?: string;
      productName?: string;
      amount?: number | string;
      currency?: string;
      paymentType?: "ONE_TIME" | "INSTALLMENT";
      installmentCount?: number;
      metadata?: Record<string, string>;
    };

    const {
      orderId,
      email,
      name,
      productType,
      productName,
      amount,
      currency,
      paymentType = "ONE_TIME",
      installmentCount = 3,
      metadata: reqMetadata,
    } = body;

    type OrderShape = {
      id: string;
      email: string;
      name: string;
      productType: string;
      productName: string;
      amount: number;
      currency: string;
    };

    let order: OrderShape;

    if (orderId) {
      // EVENT FLOW: reuse existing order from /api/checkout/event
      const existing = await prisma.order.findUnique({ where: { id: orderId } });
      if (!existing) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentMethod: "STRIPE",
          paymentType,
        },
      });
      order = existing;
    } else {
      // BOOK / OTHER FLOW: create a new order
      if (!email || !name || !productName || !amount) {
        return NextResponse.json(
          { error: "Missing required fields: email, name, productName, amount" },
          { status: 400 }
        );
      }

      const parsedAmount = parseFloat(String(amount));
      const downloadToken =
        (productType || "BOOK") === "BOOK" ? crypto.randomUUID() : null;
      const tokenExpiresAt = downloadToken
        ? new Date(Date.now() + 72 * 60 * 60 * 1000)
        : null;

      order = await prisma.order.create({
        data: {
          email,
          name,
          productType: productType ?? "BOOK",
          productName,
          amount: parsedAmount,
          currency: currency ?? "USD",
          paymentMethod: "STRIPE",
          paymentType,
          status: "PENDING",
          downloadToken,
          tokenExpiresAt,
        },
      });
    }

    const sessionMetadata: Record<string, string> = {
      orderId: order.id,
      paymentType,
      ...(reqMetadata ?? {}),
    };

    const successUrl =
      order.productType === "EVENT"
        ? `${siteUrl}/events/success?ref=${order.id}`
        : `${siteUrl}/shop/success?order=${order.id}`;

    const cancelUrl = `${siteUrl}/shop?cancelled=true`;

    let session: Stripe.Checkout.Session;

    if (paymentType === "INSTALLMENT") {
      // Subscription mode — Stripe handles recurring billing
      const amountPerInstallment = Math.round(
        (order.amount / installmentCount) * 100
      );

      // Create an ephemeral price for this subscription
      const price = await stripe.prices.create({
        currency: (order.currency || "USD").toLowerCase(),
        unit_amount: amountPerInstallment,
        recurring: { interval: "month" },
        product_data: {
          name: `${order.productName} (${installmentCount} monthly payments)`,
        },
      });

      session = await stripe.checkout.sessions.create({
        customer_email: order.email,
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          ...sessionMetadata,
          installmentCount: String(installmentCount),
        },
        subscription_data: {
          metadata: {
            orderId: order.id,
            totalInstallments: String(installmentCount),
          },
        },
      });
    } else {
      // One-time hosted checkout
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: order.email,
        line_items: [
          {
            price_data: {
              currency: (order.currency || "USD").toLowerCase(),
              product_data: { name: order.productName },
              unit_amount: Math.round(order.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: sessionMetadata,
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
