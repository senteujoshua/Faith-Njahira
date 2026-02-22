import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const client = await prisma.client.create({
    data: {
      name: data.name,
      organization: data.organization || null,
      country: data.country || null,
      description: data.description || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
