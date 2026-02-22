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
  const book = await prisma.bookResource.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      fileName: data.fileName,
      description: data.description || null,
      publisher: data.publisher || null,
      coverImage: data.coverImage || null,
      priceUSD: data.priceUSD ? parseFloat(data.priceUSD) : null,
      priceKES: data.priceKES ? parseFloat(data.priceKES) : null,
      order: parseInt(data.order) || 0,
      isActive: data.isActive,
    },
  });
  return NextResponse.json(book);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.bookResource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
