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
  const item = await prisma.mediaItem.update({
    where: { id },
    data: {
      category: data.category,
      title: data.title,
      description: data.description || null,
      source: data.source || null,
      url: data.url || null,
      date: data.date || null,
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
  await prisma.mediaItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
