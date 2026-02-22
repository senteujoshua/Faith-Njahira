import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const affiliates = await prisma.affiliate.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(affiliates);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const affiliate = await prisma.affiliate.create({
    data: {
      name: data.name,
      email: data.email,
      code: data.code.toUpperCase().trim(),
      commissionRate: parseFloat(data.commissionRate) || 10,
      notes: data.notes || null,
      isActive: data.isActive ?? true,
    },
  });
  return NextResponse.json(affiliate, { status: 201 });
}
