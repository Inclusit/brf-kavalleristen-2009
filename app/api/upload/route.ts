import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import sharp from "sharp";
import { createBadRequest } from "@/app/lib/errors";
import { handleApiErrors } from "@/app/lib/handleApiErrors";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function createUniqueName(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${base}-${timestamp}${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file === "string") {
      throw createBadRequest("Ingen fil uppladdad.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    let filename = createUniqueName(file.name);
    let outputPath = path.join(UPLOAD_DIR, filename);
    let fileUrl = `/uploads/${filename}`;

    // Om det är en bild, konvertera till webp
    if (fileType.startsWith("image/")) {
      filename = filename.replace(/\.\w+$/, ".webp");
      outputPath = path.join(UPLOAD_DIR, filename);
      fileUrl = `/uploads/${filename}`;

      const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
      await writeFile(outputPath, webpBuffer);
    } else {
      await writeFile(outputPath, buffer);
    }

    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error: any) {
    console.error("Uppladdningsfel:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return handleApiErrors(error);
  }
}
