import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bundles = await prisma.bundle.findMany({
    where: { isActive: true },
    include: { items: { include: { book: { select: { title: true, publisher: true } } } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(bundles);
}
