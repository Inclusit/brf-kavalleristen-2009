// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import { createBadRequest } from "@/app/lib/errors";

function createUniqueName(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${base}-${timestamp}${ext}`;
}

const isVercel = process.env.VERCEL === "1";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const UPLOAD_DIR = isVercel
  ? "/tmp"
  : path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file === "string")
      throw createBadRequest("Ingen fil uppladdad.");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = file.type;

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const savedFilename = createUniqueName(file.name);
    const outputPath = path.join(UPLOAD_DIR, savedFilename);
    const fileUrl = `${
      isVercel ? `/tmp/${savedFilename}` : `/uploads/${savedFilename}`
    }`;
    let html = "";

    await writeFile(outputPath, buffer);

    if (fileType.startsWith("image/")) {
      html = `<img src="${fileUrl}" alt="${savedFilename}" style="max-width: 100%;" />`;
    } else {
      html = `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
    }

    console.log("Uppladdad:", fileUrl);
    return NextResponse.json({ url: fileUrl, html }, { status: 201 });
  } catch (error: any) {
    console.error("Uppladdningsfel:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return handleApiErrors(error);
  }
}
