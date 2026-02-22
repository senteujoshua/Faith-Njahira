import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.spiritualCoaching.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const item = await prisma.spiritualCoaching.create({
    data: {
      title: data.title,
      description: data.description || null,
      duration: data.duration || null,
      price: data.price || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
