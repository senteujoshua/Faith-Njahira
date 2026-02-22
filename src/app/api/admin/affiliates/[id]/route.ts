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
  const affiliate = await prisma.affiliate.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      code: data.code.toUpperCase().trim(),
      commissionRate: parseFloat(data.commissionRate) || 10,
      paidOut: parseFloat(data.paidOut) || 0,
      notes: data.notes || null,
      isActive: data.isActive,
    },
  });
  return NextResponse.json(affiliate);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.affiliate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
