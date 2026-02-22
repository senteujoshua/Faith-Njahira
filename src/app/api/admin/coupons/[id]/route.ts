import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code.toUpperCase().trim(),
      type: data.type,
      value: parseFloat(data.value),
      minAmountUSD: data.minAmountUSD ? parseFloat(data.minAmountUSD) : null,
      maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      appliesTo: data.appliesTo || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive,
    },
  });
  return NextResponse.json(coupon);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
