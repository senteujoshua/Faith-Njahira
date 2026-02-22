import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDownloadEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, productName, productType, affiliateCode } = await req.json();

    if (!name || !email || !productName) {
      return NextResponse.json({ error: "Name, email and product are required" }, { status: 400 });
    }

    const downloadToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        email,
        name,
        productType: productType || "BOOK",
        productName,
        amount: 0,
        currency: "USD",
        paymentMethod: "FREE",
        status: "PAID",
        downloadToken,
        tokenExpiresAt,
        affiliateCode: affiliateCode || null,
      },
    });

    // Track affiliate if code provided
    if (affiliateCode) {
      await prisma.affiliate.updateMany({
        where: { code: affiliateCode, isActive: true },
        data: { totalEarnings: { increment: 0 } }, // free product = no commission
      });
    }

    await sendDownloadEmail(email, name, productName, downloadToken);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Free checkout error:", error);
    return NextResponse.json({ error: "Failed to process free download" }, { status: 500 });
  }
}
