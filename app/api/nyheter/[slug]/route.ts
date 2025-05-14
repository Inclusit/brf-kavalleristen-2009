//app/api/nyheter/route.ts
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
  { params }: { params: { slug: string } }
) {
  try {
    const news = await prisma.newsPost.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        updatedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
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
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const role = request.headers.get("role");
  const userId = request.headers.get("userId");

  console.log(" Update /api/nyheter/", { slug, role, userId });

  if (!slug) throw createBadRequest("Slug is required");

  if (role !== "ADMIN" && role !== "MODERATOR") {
    throw createUnauthorized("Du har inte rätt att uppdatera nyheter.");
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      throw createBadRequest("Titel och innehåll krävs");
    }

    const existingPost = await prisma.newsPost.findUnique({ where: { slug } });

    if (!existingPost) {
      throw createNotFound(`Nyhet med slug '${slug}' finns inte`);
    }

    const updated = await prisma.newsPost.update({
      where: { slug },
      data: {
        title,
        content,
        updatedAt: new Date(),
        updatedBy: {
          connect: { id: userId },
        },
        author: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(updated);
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
    return NextResponse.json(
      { message: "News deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrors(error);
  }
}
