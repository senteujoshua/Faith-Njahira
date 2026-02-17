import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.coachingSession.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const session = await prisma.coachingSession.create({
    data: {
      title: data.title,
      description: data.description || null,
      clientName: data.clientName || null,
      clientEmail: data.clientEmail || null,
      status: data.status || "UPCOMING",
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      recordingUrl: data.recordingUrl || null,
      duration: data.duration ? parseInt(data.duration) : null,
    },
  });
  return NextResponse.json(session, { status: 201 });
}
