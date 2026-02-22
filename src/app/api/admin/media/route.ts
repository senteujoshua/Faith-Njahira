import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const media = await prisma.mediaItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const item = await prisma.mediaItem.create({
    data: {
      category: data.category,
      title: data.title,
      description: data.description || null,
      source: data.source || null,
      url: data.url || null,
      date: data.date || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
