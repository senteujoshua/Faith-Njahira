import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    select: {
      id: true,
      amount: true,
      currency: true,
      productType: true,
      productName: true,
      paymentMethod: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Revenue by month (USD, GBP, KES)
  const revenueByMonth: Record<string, { usd: number; gbp: number; kes: number; count: number }> = {};
  for (const order of paidOrders) {
    const key = order.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
    if (!revenueByMonth[key]) revenueByMonth[key] = { usd: 0, gbp: 0, kes: 0, count: 0 };
    if (order.currency === "USD") revenueByMonth[key].usd += order.amount;
    else if (order.currency === "GBP") revenueByMonth[key].gbp += order.amount;
    else revenueByMonth[key].kes += order.amount;
    revenueByMonth[key].count += 1;
  }

  // Revenue by product
  const revenueByProduct: Record<string, { total: number; currency: string; count: number }> = {};
  for (const order of paidOrders) {
    if (!revenueByProduct[order.productName]) {
      revenueByProduct[order.productName] = { total: 0, currency: order.currency, count: 0 };
    }
    revenueByProduct[order.productName].total += order.amount;
    revenueByProduct[order.productName].count += 1;
  }

  // Revenue by type (BOOK, COACHING, BUNDLE)
  const revenueByType: Record<string, number> = {};
  for (const order of paidOrders) {
    if (!revenueByType[order.productType]) revenueByType[order.productType] = 0;
    if (order.currency === "USD") revenueByType[order.productType] += order.amount;
  }

  // Totals
  const totalUSD = paidOrders.filter((o) => o.currency === "USD").reduce((s, o) => s + o.amount, 0);
  const totalGBP = paidOrders.filter((o) => o.currency === "GBP").reduce((s, o) => s + o.amount, 0);
  const totalKES = paidOrders.filter((o) => o.currency === "KES").reduce((s, o) => s + o.amount, 0);

  // This month
  const now = new Date();
  const thisMonthKey = now.toISOString().slice(0, 7);
  const thisMonth = revenueByMonth[thisMonthKey] || { usd: 0, gbp: 0, kes: 0, count: 0 };

  return NextResponse.json({
    totalUSD,
    totalGBP,
    totalKES,
    totalOrders: paidOrders.length,
    thisMonth,
    revenueByMonth: Object.entries(revenueByMonth).map(([month, data]) => ({ month, ...data })),
    revenueByProduct: Object.entries(revenueByProduct)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10),
    revenueByType,
  });
}
