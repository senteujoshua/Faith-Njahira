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

  // Serve the file from /public/downloads/
  // The file name is derived from the product name (slugified)
  const fileName = order.productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + ".pdf";

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
    // If exact file not found, try a generic download file
    const fallbackPath = path.join(process.cwd(), "public", "downloads", "book.pdf");
    try {
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new NextResponse(fallbackBuffer, {
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
}
