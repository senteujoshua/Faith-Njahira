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

  // Update bundle, recreate items
  await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
  const bundle = await prisma.bundle.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      priceUSD: parseFloat(data.priceUSD),
      priceKES: parseFloat(data.priceKES),
      coverImage: data.coverImage || null,
      isActive: data.isActive,
      order: parseInt(data.order) || 0,
      items: data.bookIds?.length
        ? { create: data.bookIds.map((bookId: string) => ({ bookId })) }
        : undefined,
    },
    include: { items: { include: { book: true } } },
  });
  return NextResponse.json(bundle);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.bundle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
