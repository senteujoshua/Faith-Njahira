import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();
  const item = await prisma.spiritualCoaching.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      duration: data.duration || null,
      price: data.price || null,
      isActive: data.isActive,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.spiritualCoaching.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
