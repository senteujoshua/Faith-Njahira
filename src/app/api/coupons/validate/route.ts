import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, productType, amountUSD } = await req.json();

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, error: "Invalid or inactive coupon code" });
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ valid: false, error: "This coupon has expired" });
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
  }

  if (coupon.appliesTo && coupon.appliesTo !== productType) {
    return NextResponse.json({
      valid: false,
      error: `This coupon only applies to ${coupon.appliesTo.toLowerCase()} products`,
    });
  }

  if (coupon.minAmountUSD && amountUSD < coupon.minAmountUSD) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order of $${coupon.minAmountUSD} required for this coupon`,
    });
  }

  // Calculate discount
  let discountUSD = 0;
  let discountKES = 0;

  if (coupon.type === "PERCENT") {
    discountUSD = (amountUSD * coupon.value) / 100;
    discountKES = 0; // calculated client-side from KES amount
  } else if (coupon.type === "FIXED_USD") {
    discountUSD = Math.min(coupon.value, amountUSD);
  } else if (coupon.type === "FIXED_KES") {
    discountKES = coupon.value;
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
    discountUSD: parseFloat(discountUSD.toFixed(2)),
    discountKES: parseFloat(discountKES.toFixed(2)),
    message:
      coupon.type === "PERCENT"
        ? `${coupon.value}% discount applied!`
        : coupon.type === "FIXED_USD"
        ? `$${coupon.value} discount applied!`
        : `KES ${coupon.value} discount applied!`,
  });
}
