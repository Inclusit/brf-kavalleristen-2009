import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createNotFound,
  createUnauthorized,
  createForbidden,
} from "@/app/lib/errors";

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

    if (!news) throw createNotFound("News not found");

    return NextResponse.json(news, { status: 200 });

  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const role = request.headers.get("role");
  if (role !== "ADMIN" && role !== "MODERATOR") {
    throw createUnauthorized("Unauthorized");
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
    return handleApiErrors(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const role = request.headers.get("role");
  if (role !== "ADMIN") throw createUnauthorized("Unauthorized");
  if (!params.slug) throw createBadRequest("Slug is required");

  try {
    await prisma.newsPost.delete({
      where: { slug: params.slug },
    });
    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
  } catch (error) {
    return handleApiErrors(error);
  }
}