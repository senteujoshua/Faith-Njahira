import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase().trim(),
      type: data.type,
      value: parseFloat(data.value),
      minAmountUSD: data.minAmountUSD ? parseFloat(data.minAmountUSD) : null,
      maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      appliesTo: data.appliesTo || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive ?? true,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}
