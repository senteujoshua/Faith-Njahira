import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books = await prisma.bookResource.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const book = await prisma.bookResource.create({
    data: {
      title: data.title,
      slug: data.slug,
      fileName: data.fileName,
      description: data.description || null,
      isActive: data.isActive ?? true,
    },
  });
  return NextResponse.json(book, { status: 201 });
}
