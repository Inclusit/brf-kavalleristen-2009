import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import sharp from "sharp";

// Mapp för uppladdade filer
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Enkel funktion för unika filnamn
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
      return NextResponse.json(
        { error: "Ingen giltig fil skickades." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = file.type;

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    let savedFilename = createUniqueName(file.name);
    let fileUrl = `/uploads/${savedFilename}`;
    let html = "";

    if (fileType.startsWith("image/")) {
      savedFilename = savedFilename.replace(/\.\w+$/, ".webp");
      fileUrl = `/uploads/${savedFilename}`;
      const outputPath = path.join(UPLOAD_DIR, savedFilename);

      const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
      await writeFile(outputPath, webpBuffer);

      html = `<img src="${fileUrl}" alt="${savedFilename}" style="max-width: 100%;" />`;
    } else {
      const outputPath = path.join(UPLOAD_DIR, savedFilename);
      await writeFile(outputPath, buffer);

      html = `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
    }

    return NextResponse.json({ url: fileUrl, html }, { status: 201 });
  } catch (error) {
    console.error("Uppladdningsfel:", error);
    return NextResponse.json(
      { error: "Serverfel vid uppladdning." },
      { status: 500 }
    );
  }
}
