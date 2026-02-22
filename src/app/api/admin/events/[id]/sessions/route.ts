import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sessions = await prisma.eventSession.findMany({
    where: { eventId: id },
    orderBy: { sessionNumber: "asc" },
  });

  return NextResponse.json(sessions);
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

  const session = await prisma.eventSession.create({
    data: {
      eventId: id,
      sessionNumber: parseInt(data.sessionNumber) || 1,
      title: data.title || null,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
      timezone: data.timezone || "Africa/Nairobi",
    },
  });

  return NextResponse.json(session, { status: 201 });
}
