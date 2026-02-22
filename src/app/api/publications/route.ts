import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const publications = await prisma.publication.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(publications);
}
