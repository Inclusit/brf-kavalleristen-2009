import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  ContentBlockData,
  ContentUpdateData,
  SafeContentBlock,
} from "@/app/types/content";
import { parse } from "path";
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
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params;

    if (!slug) throw createBadRequest("Slug is required");

    let content = await prisma.contentBlock.findUnique({
      where: { slug },
    });

    if (!content) {
      content = await prisma.contentBlock.create({
        data: {
          slug,
          title: "Auto-skapat innehåll",
          content: "",
        },
      });
      console.log("Skapade ny contentBlock för:", slug);
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.warn("Error: Failed to get content", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const { slug } = await context.params;

    const role = request.headers.get("role");
    if (role !== "ADMIN" && role !== "MODERATOR") {
      throw createUnauthorized("Unauthorized");
    }

    if (!slug) throw createBadRequest("Slug is required");

    const body: ContentUpdateData = await request.json();
    if (!body || !body.content) throw createBadRequest("Content is required");

    let contentBlock = await prisma.contentBlock.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!contentBlock) {
      contentBlock = await prisma.contentBlock.create({
        data: {
          slug,
          content: body.content,
          title: body.title ?? "Nytt innehåll",
        },
        include: { author: true },
      });
    } else {
      contentBlock = await prisma.contentBlock.update({
        where: { slug },
        data: body,
        include: { author: true },
      });
    }

    const safeContent: SafeContentBlock = {
      ...contentBlock,
      author: contentBlock.author
        ? {
            id: contentBlock.author.id,
            name: contentBlock.author.name,
            email: contentBlock.author.email ?? null,
            role: contentBlock.author.role,
            createdAt: contentBlock.author.createdAt,
            updatedAt: contentBlock.author.updatedAt,
          }
        : null,
    };

    return NextResponse.json(safeContent, { status: 200 });
  } catch (error: any) {
    console.warn("Error: Failed to update content", error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { slug } = await context.params;

    const role = request.headers.get("role");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

    if (!slug) throw createBadRequest("Slug is required");

    const contentBlock = await prisma.contentBlock.findUnique({
      where: { slug },
    });

    if (!contentBlock) throw createNotFound("Content not found");

    await prisma.contentBlock.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error: any) {
    console.warn("Error: Failed to delete content", error.message);
    return handleApiErrors(error);
  }
}
