import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId, seatCount = 1, email, name, phone, currency = "USD" } = body;

    if (!tierId || !email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const seats = Math.max(1, parseInt(String(seatCount)));

    // Concurrency-safe seat reservation inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch and validate tier
      const tier = await tx.ticketTier.findUnique({
        where: { id: tierId },
        include: { event: true },
      });

      if (!tier) throw new Error("TIER_NOT_FOUND");
      if (tier.isSaleClosed) throw new Error("SALE_CLOSED");
      if (seats > tier.maxPerPurchase) throw new Error("EXCEEDS_MAX_PER_PURCHASE");

      // 2. Optimistic lock: only update if enough seats remain
      if (tier.quantityAvailable > 0) {
        const updated = await tx.ticketTier.updateMany({
          where: {
            id: tierId,
            soldCount: { lte: tier.quantityAvailable - seats },
            isSaleClosed: false,
          },
          data: { soldCount: { increment: seats } },
        });

        if (updated.count === 0) throw new Error("INSUFFICIENT_SEATS");

        // Auto-close if now full
        const newSoldCount = tier.soldCount + seats;
        if (newSoldCount >= tier.quantityAvailable) {
          await tx.ticketTier.update({
            where: { id: tierId },
            data: { isSaleClosed: true },
          });
        }
      }

      // 3. Determine amount based on currency
      let amount = 0;
      let orderCurrency = currency;
      if (currency === "GBP") {
        amount = tier.priceGBP * seats;
        orderCurrency = "GBP";
      } else if (currency === "KES") {
        amount = tier.priceKES * seats;
        orderCurrency = "KES";
      } else {
        amount = tier.priceUSD * seats;
        orderCurrency = "USD";
      }

      // 4. Create PENDING order (no downloadToken for events)
      const order = await tx.order.create({
        data: {
          email,
          name,
          phone: phone || null,
          productType: "EVENT",
          productName: `${tier.event.title} — ${tier.name}`,
          amount,
          currency: orderCurrency,
          paymentMethod: "STRIPE", // will be updated by checkout method
          status: "PENDING",
          tierId,
        },
      });

      return { order, tier };
    });

    return NextResponse.json({
      orderId: result.order.id,
      amount: result.order.amount,
      currency: result.order.currency,
      productName: result.order.productName,
      tierId,
      seatCount: seats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    const statusMap: Record<string, number> = {
      TIER_NOT_FOUND: 404,
      SALE_CLOSED: 409,
      INSUFFICIENT_SEATS: 409,
      EXCEEDS_MAX_PER_PURCHASE: 400,
    };
    return NextResponse.json(
      { error: message },
      { status: statusMap[message] || 500 }
    );
  }
}
