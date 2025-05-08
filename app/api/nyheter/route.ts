import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const role = request.headers.get("role");
    const userId = request.headers.get("userId");
    
    if (role !== "ADMIN" && role !== "MODERATOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await request.json();
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
        return NextResponse.json({ error: "News posting failed" }, { status: 500 });
    }
}