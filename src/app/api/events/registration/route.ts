import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const registration = (await prisma.eventRegistration.findUnique({
    where: { orderId },
    include: {
      order: {
        select: { id: true, name: true, email: true, productName: true, amount: true, currency: true },
      },
      event: {
        select: {
          title: true,
          meetingLink: true,
          meetingDetails: true,
          sessions: {
            orderBy: { sessionNumber: "asc" },
            select: { sessionNumber: true, title: true, startTime: true, endTime: true, timezone: true },
          },
        },
      },
      tier: { select: { name: true } },
    },
  })) as Prisma.EventRegistrationGetPayload<{ include: { order: true; event: { include: { sessions: true } }; tier: true } }> | null;

  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: registration.order,
    event: registration.event,
    tier: registration.tier,
    seatCount: registration.seatCount,
  });
}
