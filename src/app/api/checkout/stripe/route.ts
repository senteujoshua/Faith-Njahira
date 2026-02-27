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
    const {
      // Event flow: use existing order created by /api/checkout/event
      orderId,
      // Book/other flow: create new order (legacy)
      email,
      name,
      productType,
      productName,
      amount,
      currency,
      // Embedded checkout mode
      embedded,
      // Extra metadata (e.g. seatCount)
      metadata: reqMetadata,
    } = body;

    let order: {
      id: string;
      email: string;
      name: string;
      productType: string;
      productName: string;
      amount: number;
      currency: string;
    };

    if (orderId) {
      // EVENT FLOW: reuse the order already created by /api/checkout/event
      const existing = await prisma.order.findUnique({ where: { id: orderId } });
      if (!existing) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentMethod: "STRIPE" },
      });
      order = existing;
    } else {
      // BOOK / OTHER FLOW: create a new order (existing behaviour)
      if (!email || !name || !productName || !amount) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const downloadToken = crypto.randomUUID();
      const tokenExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

      order = await prisma.order.create({
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
    }

    const sessionMetadata: Record<string, string> = {
      orderId: order.id,
      ...(reqMetadata || {}),
    };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: (order.currency || "USD").toLowerCase(),
          product_data: { name: order.productName },
          unit_amount: Math.round(order.amount * 100),
        },
        quantity: 1,
      },
    ];

    let session: Stripe.Checkout.Session;

    if (embedded) {
      const returnUrl =
        order.productType === "EVENT"
          ? `${siteUrl}/events/success?ref=${order.id}`
          : `${siteUrl}/shop/success?order=${order.id}`;

      // Do NOT pass payment_method_types with ui_mode: "embedded" —
      // Stripe manages payment methods automatically in embedded mode.
      session = await stripe.checkout.sessions.create({
        customer_email: order.email,
        line_items: lineItems,
        mode: "payment",
        ui_mode: "embedded",
        return_url: returnUrl,
        metadata: sessionMetadata,
      });

      if (!session.client_secret) {
        console.error("Stripe embedded session has no client_secret:", session.id);
        return NextResponse.json(
          { error: "Stripe did not return a client secret. Embedded checkout may not be enabled for this account." },
          { status: 500 }
        );
      }
    } else {
      const successUrl =
        order.productType === "EVENT"
          ? `${siteUrl}/events/success?ref=${order.id}`
          : `${siteUrl}/shop/success?order=${order.id}`;

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: order.email,
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: `${siteUrl}/shop?cancelled=true`,
        metadata: sessionMetadata,
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: session.id },
    });

    if (embedded) {
      return NextResponse.json({
        clientSecret: session.client_secret,
        orderId: order.id,
      });
    }

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
