
import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }) {
  const { filename } = params;
  const filePath = path.join("/tmp", filename);

  try {
    const file = createReadStream(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Fil ej hittad" }, { status: 404 });
  }
}
