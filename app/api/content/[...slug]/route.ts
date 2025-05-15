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

// ✅ GET
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug?.join("/") ?? "";
    if (!slug) throw createBadRequest("Slug krävs");

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
    console.warn("Error: Kunde inte hämta innehåll", error.message);
    return handleApiErrors(error);
  }
}

// ✅ PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug?.join("/") ?? "";

  console.log("🔧 PUT /api/content/[slug]", {
    slug,
    role: request.headers.get("role"),
    userId: request.headers.get("userId"),
  });

  try {
    const userId = request.headers.get("userId");
    const role = request.headers.get("role");

    if (!slug) throw createBadRequest("Slug krävs");
    if (!userId) throw createBadRequest("User ID krävs");
    if (role !== "ADMIN" && role !== "MODERATOR") {
      throw createUnauthorized("Unauthorized");
    }

    const body: ContentUpdateData = await request.json();
    if (!body || !body.content) throw createBadRequest("Content krävs");

    let contentBlock: IncludedContent;

    const existing = await prisma.contentBlock.findUnique({ where: { slug } });

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
    console.warn("Error: Kunde inte hämta innehåll", error.message);
    return handleApiErrors(error);
  }
}

// ✅ DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug?.join("/") ?? "";
    const role = request.headers.get("role");

    if (!slug) throw createBadRequest("Slug krävs");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

    const contentBlock = await prisma.contentBlock.findUnique({
      where: { slug },
    });

    if (!contentBlock) throw createNotFound("Innehåll hittades inte");

    await prisma.contentBlock.delete({ where: { slug } });

    return NextResponse.json({ message: "Innehåll raderat" });
  } catch (error: any) {
    console.warn("Error: Kunde inte radera innehåll", error.message);
    return handleApiErrors(error);
  }
}
