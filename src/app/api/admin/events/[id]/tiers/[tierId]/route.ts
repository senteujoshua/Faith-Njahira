import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tierId: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tierId } = await params;
  const data = await request.json();

  const tier = await prisma.ticketTier.update({
    where: { id: tierId },
    data: {
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

  return NextResponse.json(tier);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; tierId: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tierId } = await params;

  const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });
  if (!tier) {
    return NextResponse.json({ error: "Tier not found" }, { status: 404 });
  }
  if (tier.soldCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete a tier that has sold tickets" },
      { status: 400 }
    );
  }

  await prisma.ticketTier.delete({ where: { id: tierId } });
  return NextResponse.json({ success: true });
}
