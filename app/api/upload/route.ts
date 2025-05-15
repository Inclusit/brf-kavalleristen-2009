import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import sharp from "sharp";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import { createBadRequest } from "@/app/lib/errors";

function createUniqueName(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${base}-${timestamp}${ext}`;
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file === "string") {
      throw createBadRequest("Ingen fil uppladdad.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = file.type;

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    let savedFilename = createUniqueName(file.name);

    if (fileType.startsWith("image/")) {
      savedFilename = savedFilename.replace(/\.\w+$/, ".webp");
      const outputPath = path.join(UPLOAD_DIR, savedFilename);

      try {
        const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
        await writeFile(outputPath, webpBuffer);
      } catch (sharpErr) {
        throw createBadRequest(
          "Ogiltig bildfil eller konvertering misslyckades."
        );
      }
    } else {
      const outputPath = path.join(UPLOAD_DIR, savedFilename);
      await writeFile(outputPath, buffer);
    }

    const fileUrl = `${BASE_URL}/uploads/${savedFilename}`;
    const html = fileType.startsWith("image/")
      ? `<img src="${fileUrl}" alt="${savedFilename}" style="max-width: 100%;" />`
      : `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;

    console.log("Fil uppladdad:", fileUrl);

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
