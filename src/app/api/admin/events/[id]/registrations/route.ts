import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "25");
  const search = url.searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const where = {
    eventId: id,
    ...(search
      ? {
          order: {
            OR: [
              { email: { contains: search, mode: "insensitive" as const } },
              { name: { contains: search, mode: "insensitive" as const } },
            ],
          },
        }
      : {}),
  };

  const [registrations, total] = await Promise.all([
    prisma.eventRegistration.findMany({
      where,
      include: {
        order: { select: { id: true, name: true, email: true, phone: true, amount: true, currency: true, status: true, paymentMethod: true, createdAt: true } },
        tier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.eventRegistration.count({ where }),
  ]);

  return NextResponse.json({ registrations, total, page, limit });
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

  // Manual registration: create a FREE order + registration
  const order = await prisma.order.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      productType: "EVENT",
      productName: data.eventTitle || "Event",
      amount: 0,
      currency: "USD",
      paymentMethod: "FREE",
      status: "PAID",
      tierId: data.tierId || null,
    },
  });

  const registration = await prisma.eventRegistration.create({
    data: {
      orderId: order.id,
      eventId: id,
      tierId: data.tierId,
      seatCount: data.seatCount ?? 1,
    },
  });

  // Increment soldCount
  if (data.tierId) {
    await prisma.ticketTier.update({
      where: { id: data.tierId },
      data: { soldCount: { increment: data.seatCount ?? 1 } },
    });
  }

  return NextResponse.json({ order, registration }, { status: 201 });
}
