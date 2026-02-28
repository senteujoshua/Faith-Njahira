import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  const event = await prisma.event.update({
    where: { id },
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

  return NextResponse.json(event);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
