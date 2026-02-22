import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bundles = await prisma.bundle.findMany({
    include: { items: { include: { book: true } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(bundles);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const bundle = await prisma.bundle.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      priceUSD: parseFloat(data.priceUSD),
      priceKES: parseFloat(data.priceKES),
      coverImage: data.coverImage || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
      items: data.bookIds?.length
        ? { create: data.bookIds.map((bookId: string) => ({ bookId })) }
        : undefined,
    },
    include: { items: { include: { book: true } } },
  });
  return NextResponse.json(bundle, { status: 201 });
}
