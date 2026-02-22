import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "books";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeFileName}`;

  // Use Vercel Blob in production / when token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`${folder}/${uniqueName}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local fallback: save to public/uploads/ for development
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");

  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(join(uploadDir, uniqueName), buffer);

  const url = `/uploads/${folder}/${uniqueName}`;
  return NextResponse.json({ url });
}
