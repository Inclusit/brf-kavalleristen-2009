// app/api/tmp/[...filename]/route.ts
import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string[] | string } }
) {
  const filename = Array.isArray(params.filename)
    ? params.filename.join("/")
    : params.filename;

  const filePath = path.join("/tmp", filename);

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/webp", // Anpassa om du har olika bildtyper
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Kunde inte läsa fil:", error);
    return NextResponse.json({ message: "Fil ej hittad" }, { status: 404 });
  }
}
