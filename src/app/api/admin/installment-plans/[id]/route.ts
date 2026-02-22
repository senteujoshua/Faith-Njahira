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
  const plan = await prisma.installmentPlan.update({
    where: { id },
    data: {
      paidCount: data.paidCount !== undefined ? parseInt(data.paidCount) : undefined,
      status: data.status,
      nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      notes: data.notes || null,
    },
  });
  return NextResponse.json(plan);
}
