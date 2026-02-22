import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const plans = await prisma.installmentPlan.findMany({
    include: { payments: { select: { id: true, amount: true, status: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const plan = await prisma.installmentPlan.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      productName: data.productName,
      totalAmountUSD: parseFloat(data.totalAmountUSD),
      totalAmountKES: parseFloat(data.totalAmountKES),
      currency: data.currency,
      numInstallments: parseInt(data.numInstallments),
      amountPerInstall: parseFloat(data.amountPerInstall),
      nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      notes: data.notes || null,
    },
  });
  return NextResponse.json(plan, { status: 201 });
}
