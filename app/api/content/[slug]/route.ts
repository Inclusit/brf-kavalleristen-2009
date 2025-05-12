import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { ContentUpdateData, SafeContentBlock } from "@/app/types/content";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createNotFound,
  createUnauthorized,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

const includeRelations = {
  author: true,
  updatedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;

type IncludedContent = Prisma.ContentBlockGetPayload<{
  include: typeof includeRelations;
}>;

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params;
    if (!slug) throw createBadRequest("Slug is required");

    let content: IncludedContent | null = await prisma.contentBlock.findUnique({
      where: { slug },
      include: includeRelations,
    });

    if (!content) {
      await prisma.contentBlock.create({
        data: {
          slug,
          title: "Auto-skapat innehåll",
          content: "",
        },
      });

      content = await prisma.contentBlock.findUnique({
        where: { slug },
        include: includeRelations,
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.warn("Error: Failed to get content", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest, context: any) {

  console.log("🔧 PUT /api/content/[slug]", {
    slug: context.params.slug,
    role: request.headers.get("role"),
    userId: request.headers.get("userId"),
  });
  
  try {
    const { slug } = await context.params;
    const userId = request.headers.get("userId");
    const role = request.headers.get("role");

    if (!slug) throw createBadRequest("Slug is required");
    if (!userId) throw createBadRequest("User ID is required");
    if (role !== "ADMIN" && role !== "MODERATOR") {
      throw createUnauthorized("Unauthorized");
    }

    const body: ContentUpdateData = await request.json();
    if (!body || !body.content) throw createBadRequest("Content is required");

    let contentBlock: IncludedContent;

    const existing = await prisma.contentBlock.findUnique({
      where: { slug },
    });

    if (!existing) {
      contentBlock = await prisma.contentBlock.create({
        data: {
          slug,
          content: body.content,
          title: body.title ?? "Nytt innehåll",
          updatedById: userId,
        },
        include: includeRelations,
      });
    } else {
      contentBlock = await prisma.contentBlock.update({
        where: { slug },
        data: {
          ...body,
          updatedById: userId,
          updatedAt: new Date(),
        },
        include: includeRelations,
      });
    }

    const safeContent: SafeContentBlock = {
      ...contentBlock,
      createdAt: contentBlock.createdAt.toISOString(),
      updatedAt: contentBlock.updatedAt.toISOString(),
      author: contentBlock.author
        ? {
            id: contentBlock.author.id,
            firstName: contentBlock.author.firstName,
            lastName: contentBlock.author.lastName,
            email: contentBlock.author.email ?? null,
            phone: contentBlock.author.phone ?? null,
            address: contentBlock.author.address ?? null,
            role: contentBlock.author.role,
            createdAt: contentBlock.author.createdAt.toISOString(),
            updatedAt: contentBlock.author.updatedAt.toISOString(),
          }
        : null,
      updatedBy: contentBlock.updatedBy
        ? {
            id: contentBlock.updatedBy.id,
            firstName: contentBlock.updatedBy.firstName,
            lastName: contentBlock.updatedBy.lastName,
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

    if (!slug) throw createBadRequest("Slug is required");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

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
