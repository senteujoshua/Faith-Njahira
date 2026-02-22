import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { status: "PAID" },
    select: {
      id: true,
      email: true,
      name: true,
      productName: true,
      productType: true,
      amount: true,
      currency: true,
      paymentMethod: true,
      couponCode: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by email
  const customerMap: Record<
    string,
    {
      name: string;
      email: string;
      orders: typeof orders;
      totalSpentUSD: number;
      totalSpentKES: number;
      firstPurchase: Date;
      lastPurchase: Date;
    }
  > = {};

  for (const order of orders) {
    if (!customerMap[order.email]) {
      customerMap[order.email] = {
        name: order.name,
        email: order.email,
        orders: [],
        totalSpentUSD: 0,
        totalSpentKES: 0,
        firstPurchase: order.createdAt,
        lastPurchase: order.createdAt,
      };
    }
    const customer = customerMap[order.email];
    customer.orders.push(order);
    if (order.currency === "USD") customer.totalSpentUSD += order.amount;
    else customer.totalSpentKES += order.amount;
    if (order.createdAt < customer.firstPurchase) customer.firstPurchase = order.createdAt;
    if (order.createdAt > customer.lastPurchase) customer.lastPurchase = order.createdAt;
  }

  const customers = Object.values(customerMap).sort(
    (a, b) => b.lastPurchase.getTime() - a.lastPurchase.getTime()
  );

  return NextResponse.json(customers);
}
