import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import sharp from "sharp";
import { createBadRequest } from "@/app/lib/errors";
import { handleApiErrors } from "@/app/lib/handleApiErrors";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const isVercel = process.env.VERCEL === "1";
const UPLOAD_DIR = isVercel
  ? "/tmp"
  : path.join(process.cwd(), "public", "uploads");

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

    console.log("Filmottagen:", file.name, file.type, file.size);

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    let filename = createUniqueName(file.name);
    let outputPath = path.join(UPLOAD_DIR, filename);
    let fileUrl = `${BASE_URL}${
      isVercel ? `/api/tmp/${filename}` : `/uploads/${filename}`
    }`;
    
    if (fileType.startsWith("image/")) {
      filename = filename.replace(/\.\w+$/, ".webp");
      outputPath = path.join(UPLOAD_DIR, filename);
      fileUrl = `${BASE_URL}${
        isVercel ? `/tmp/${filename}` : `/uploads/${filename}`
      }`;

      console.log("file url", fileUrl);
      console.log("output path", outputPath);
      console.log("filename", filename);
      
      try {
        const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
        await writeFile(outputPath, webpBuffer);
      } catch (sharpError) {
        console.error("Konvertering misslyckades:", sharpError);
        throw createBadRequest(
          "Ogiltig bildfil eller konvertering misslyckades."
        );
      }
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
