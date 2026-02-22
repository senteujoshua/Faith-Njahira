import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publications = await prisma.publication.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(publications);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const publication = await prisma.publication.create({
    data: {
      type: data.type,
      year: data.year,
      title: data.title,
      description: data.description || null,
      publisher: data.publisher || null,
      link: data.link || null,
      tags: data.tags || null,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(publication, { status: 201 });
}
