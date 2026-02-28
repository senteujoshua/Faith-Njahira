import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  sendDownloadEmail,
  sendCoachingConfirmationEmail,
  sendEventConfirmationEmail,
} from "@/lib/email";

// GET /api/admin/orders/[id]/emails — list email logs for an order
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const logs = await prisma.emailLog.findMany({
    where: { orderId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}

// Prisma Accelerate extension breaks include type inference — cast explicitly
type OrderWithTier = Prisma.OrderGetPayload<{
  include: {
    tier: {
      include: { event: { include: { sessions: true } } };
    };
  };
}>;

// POST /api/admin/orders/[id]/emails — resend a specific email type
// Body: { emailType: "DOWNLOAD" | "CONFIRMATION" | "COACHING" }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json() as { emailType?: string };
  const { emailType } = body;

  if (!emailType) {
    return NextResponse.json({ error: "Missing emailType" }, { status: 400 });
  }

  // Prisma Accelerate extension breaks include type inference — cast explicitly
  const order = (await prisma.order.findUnique({
    where: { id },
    include: {
      tier: {
        include: {
          event: { include: { sessions: { orderBy: { sessionNumber: "asc" } } } },
        },
      },
    },
  })) as OrderWithTier | null;

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "PAID") {
    return NextResponse.json(
      { error: "Can only resend emails for PAID orders" },
      { status: 400 }
    );
  }

  try {
    if (emailType === "DOWNLOAD") {
      if (!order.downloadToken) {
        return NextResponse.json(
          { error: "Order has no download token" },
          { status: 400 }
        );
      }
      // Clear any existing SENT log so the idempotency guard doesn't block resend
      await prisma.emailLog.updateMany({
        where: { type: "DOWNLOAD", orderId: id, status: "SENT" },
        data: { status: "SUPERSEDED" },
      });
      await sendDownloadEmail(
        order.email,
        order.name,
        order.productName,
        order.downloadToken,
        order.id
      );
    } else if (emailType === "COACHING") {
      const calendlyUrl =
        order.calendlyUrl || "https://calendly.com/faith-njahira";
      await prisma.emailLog.updateMany({
        where: { type: "COACHING", orderId: id, status: "SENT" },
        data: { status: "SUPERSEDED" },
      });
      await sendCoachingConfirmationEmail(
        order.email,
        order.name,
        order.productName,
        calendlyUrl,
        order.id
      );
    } else if (emailType === "CONFIRMATION") {
      if (!order.tier) {
        return NextResponse.json(
          { error: "Order has no ticket tier" },
          { status: 400 }
        );
      }
      await prisma.emailLog.updateMany({
        where: { type: "CONFIRMATION", orderId: id, status: "SENT" },
        data: { status: "SUPERSEDED" },
      });
      await sendEventConfirmationEmail({
        to: order.email,
        name: order.name,
        eventTitle: order.tier.event.title,
        tierName: order.tier.name,
        seatCount: 1,
        orderRef: order.id,
        meetingLink: order.tier.event.meetingLink,
        meetingDetails: order.tier.event.meetingDetails,
        sessions: order.tier.event.sessions.map((s) => ({
          sessionNumber: s.sessionNumber,
          title: s.title,
          startTime: s.startTime,
          endTime: s.endTime,
          timezone: s.timezone,
        })),
        orderId: order.id,
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported emailType. Use: DOWNLOAD | COACHING | CONFIRMATION" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    console.error(`[admin] Resend ${emailType} for order ${id} failed:`, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
