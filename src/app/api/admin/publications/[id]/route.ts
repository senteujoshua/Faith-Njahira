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
  const publication = await prisma.publication.update({
    where: { id },
    data: {
      type: data.type,
      year: data.year,
      title: data.title,
      description: data.description || null,
      publisher: data.publisher || null,
      link: data.link || null,
      tags: data.tags || null,
      isActive: data.isActive,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(publication);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.publication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
