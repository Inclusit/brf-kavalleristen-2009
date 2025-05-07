import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest, 
  { params }: { params: { slug: string } }) {
  try {
    const news = await prisma.newsPost.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const role = request.headers.get("role");
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const post = await prisma.newsPost.update({
      where: { slug: params.slug },
      data: {
        title: body.title,
        content: body.content,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const role = request.headers.get("role");
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.newsPost.delete({
      where: { slug: params.slug },
    });
    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}