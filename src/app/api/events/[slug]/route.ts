import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, isActive: true },
    include: {
      tiers: {
        orderBy: { order: "asc" },
      },
      sessions: {
        orderBy: { sessionNumber: "asc" },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Add seatsRemaining to each tier
  const tiersWithSeats = event.tiers.map((tier) => ({
    ...tier,
    seatsRemaining:
      tier.quantityAvailable === 0
        ? null // unlimited
        : Math.max(0, tier.quantityAvailable - tier.soldCount),
  }));

  return NextResponse.json({ ...event, tiers: tiersWithSeats });
}
