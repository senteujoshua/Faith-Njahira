import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const registrations = (await prisma.eventRegistration.findMany({
    where: { eventId: id },
    include: {
      order: { select: { name: true, email: true, phone: true, amount: true, currency: true, status: true, paymentMethod: true, createdAt: true } },
      tier: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })) as Prisma.EventRegistrationGetPayload<{ include: { order: true; tier: true } }>[];

  const header = ["Name", "Email", "Phone", "Tier", "Seats", "Amount", "Currency", "Payment Method", "Status", "Registered At"];
  const rows = registrations.map((reg) => [
    reg.order.name,
    reg.order.email,
    reg.order.phone || "",
    reg.tier.name,
    String(reg.seatCount),
    String(reg.order.amount),
    reg.order.currency,
    reg.order.paymentMethod,
    reg.order.status,
    new Date(reg.createdAt).toISOString(),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="registrations-${id}.csv"`,
    },
  });
}
