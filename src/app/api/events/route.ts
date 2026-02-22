import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      tiers: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          priceUSD: true,
          priceGBP: true,
          priceKES: true,
          originalPriceUSD: true,
          originalPriceGBP: true,
          originalPriceKES: true,
          quantityAvailable: true,
          soldCount: true,
          isSaleClosed: true,
          isDefault: true,
        },
      },
      sessions: {
        orderBy: { sessionNumber: "asc" },
        take: 1,
        select: { sessionNumber: true, title: true, startTime: true, endTime: true, timezone: true },
      },
    },
  });

  return NextResponse.json(events);
}
