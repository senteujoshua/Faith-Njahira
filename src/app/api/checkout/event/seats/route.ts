import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const tierId = request.nextUrl.searchParams.get("tierId");

  if (!tierId) {
    return NextResponse.json({ error: "tierId required" }, { status: 400 });
  }

  const tier = await prisma.ticketTier.findUnique({
    where: { id: tierId },
    select: { quantityAvailable: true, soldCount: true, isSaleClosed: true },
  });

  if (!tier) {
    return NextResponse.json({ error: "Tier not found" }, { status: 404 });
  }

  const seatsRemaining =
    tier.quantityAvailable === 0
      ? null
      : Math.max(0, tier.quantityAvailable - tier.soldCount);

  return NextResponse.json(
    { seatsRemaining, isSaleClosed: tier.isSaleClosed },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
