import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
    createBadRequest,
    createNotFound,
    createUnauthorized,
    createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 6;

    const [totalCount, newsPost] = await Promise.all([
      prisma.newsPost.count(),
      prisma.newsPost.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ newsPost, totalCount }, { status: 200 });
  } catch (error) {
    return handleApiErrors(error);
  }
}



export async function POST(request: NextRequest) {
    const role = request.headers.get("role");
    const userId = request.headers.get("userId");
    
    if (role !== "ADMIN" && role !== "MODERATOR") {
        throw createUnauthorized("Unauthorized");
    }

    if (!userId) throw createBadRequest("User ID krävs");
    

    try {
        const body = await request.json();

        if (!body.title || !body.content || !body.slug) {
            throw createBadRequest("Title, content, och slug krävs");
        }

        const newsPost = await prisma.newsPost.create({
            data: {
                title: body.title,
                content: body.content,
                slug: body.slug,
                authorId: userId || undefined,
                createdAt: new Date(),
            },
        });
        return NextResponse.json(newsPost, { status: 201 });
    } catch (error) {
        return handleApiErrors(error);
    }
}