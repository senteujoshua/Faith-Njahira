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
  const session = await prisma.coachingSession.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      clientName: data.clientName || null,
      clientEmail: data.clientEmail || null,
      status: data.status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      recordingUrl: data.recordingUrl || null,
      duration: data.duration ? parseInt(data.duration) : null,
    },
  });
  return NextResponse.json(session);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.coachingSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
