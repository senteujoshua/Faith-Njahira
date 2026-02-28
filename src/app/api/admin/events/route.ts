import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { order: "asc" },
    include: {
      tiers: { orderBy: { order: "asc" } },
      sessions: { orderBy: { sessionNumber: "asc" } },
      _count: { select: { registrations: true } },
    },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const event = await prisma.event.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      shortDesc: data.shortDesc || null,
      coverImage: data.coverImage || null,
      eventType: data.eventType || "ONLINE",
      isRecurring: data.isRecurring ?? false,
      timezone: data.timezone || "Africa/Nairobi",
      meetingLink: data.meetingLink || null,
      meetingDetails: data.meetingDetails || null,
      extraDetails: data.extraDetails || null,
      calendlyUrl: data.calendlyUrl || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
