import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import path from "path";
import { createBadRequest } from "@/app/lib/errors";
import { handleApiErrors } from "@/app/lib/handleApiErrors";

function createUniqueName(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${base}-${timestamp}.webp`;
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

    // Endast bilder hanteras
    if (!file.type.startsWith("image/")) {
      throw createBadRequest("Endast bildfiler tillåtna.");
    }

    // Konvertera till WebP
    let webpBuffer: Buffer;
    try {
      webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
    } catch (sharpError) {
      console.error("Konvertering misslyckades:", sharpError);
      throw createBadRequest(
        "Ogiltig bildfil eller konvertering misslyckades."
      );
    }

    // Unikt filnamn
    const filename = createUniqueName(file.name);

    // Ladda upp till Vercel Blob
    const blob = await put(filename, webpBuffer, {
      access: "public", // Viktigt: annars kan du inte visa bilden i <img src="">
    });

    console.log("Uppladdad till Blob:", blob.url);

    // Returnera URL
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error: any) {
    console.error("Uppladdningsfel:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return handleApiErrors(error);
  }
}
