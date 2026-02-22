import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tiers = await prisma.ticketTier.findMany({
    where: { eventId: id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(tiers);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  const tier = await prisma.ticketTier.create({
    data: {
      eventId: id,
      name: data.name,
      description: data.description || null,
      priceUSD: parseFloat(data.priceUSD) || 0,
      priceGBP: parseFloat(data.priceGBP) || 0,
      priceKES: parseFloat(data.priceKES) || 0,
      originalPriceUSD: data.originalPriceUSD ? parseFloat(data.originalPriceUSD) : null,
      originalPriceGBP: data.originalPriceGBP ? parseFloat(data.originalPriceGBP) : null,
      originalPriceKES: data.originalPriceKES ? parseFloat(data.originalPriceKES) : null,
      quantityAvailable: parseInt(data.quantityAvailable) || 0,
      maxPerPurchase: parseInt(data.maxPerPurchase) || 5,
      isSaleClosed: data.isSaleClosed ?? false,
      isDefault: data.isDefault ?? false,
      order: parseInt(data.order) || 0,
    },
  });

  return NextResponse.json(tier, { status: 201 });
}
