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

export async function POST(request: NextRequest) {
    const role = request.headers.get("role");
    const userId = request.headers.get("userId");
    
    if (role !== "ADMIN" && role !== "MODERATOR") {
        throw createUnauthorized("Unauthorized");
    }

    try {
        const body = await request.json();

        if (!body.title || !body.content || !body.slug) {
            throw createBadRequest("Title, content, and slug are required");
        }

        if (body.title.length < 5 || body.content.length < 10) {
            throw createBadRequest("Title must be at least 5 characters and content at least 10 characters long");
        }

        const post = await prisma.newsPost.create({
            data: {
                title: body.title,
                content: body.content,
                slug: body.slug,
                authorId: userId || undefined,
                createdAt: new Date(),
            },
        });
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return handleApiErrors(error);
    }
}