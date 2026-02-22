import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { error: "Missing download token" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Invalid download link" },
      { status: 404 }
    );
  }

  if (order.status !== "PAID") {
    return NextResponse.json(
      { error: "Payment not confirmed yet" },
      { status: 403 }
    );
  }

  if (order.tokenExpiresAt && new Date() > order.tokenExpiresAt) {
    return NextResponse.json(
      { error: "Download link has expired. Please contact support for a new link." },
      { status: 410 }
    );
  }

  // Look up the book resource to get the actual file URL
  const slug = order.productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const book = await prisma.bookResource.findFirst({
    where: {
      OR: [{ slug }, { title: order.productName }],
    },
  });

  // If the book has a cloud URL (Vercel Blob), redirect to it
  if (book?.fileName && book.fileName.startsWith("http")) {
    return NextResponse.redirect(book.fileName);
  }

  // Fall back to serving from /public/downloads/
  const fileName = (book?.fileName || slug + ".pdf");
  const filePath = path.join(process.cwd(), "public", "downloads", fileName);

  try {
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "File not found. Please contact support." },
      { status: 404 }
    );
  }
}
