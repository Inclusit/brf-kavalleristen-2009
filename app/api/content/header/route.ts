import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createUnauthorized,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const existingHeader = await prisma.contentBlock.findUnique({
        where: { slug: "header" },
    });
    if (!existingHeader) {
        return NextResponse.json(
          {
            image: "/images/kavallerigatan.jpg",
            title: "Välkommen till vår förening",
            subtitle: "Här hittar du allt om boende, kontakt och miljö.",
          },
          { status: 200 }
        );
    }

    try {
        const data = await JSON.parse(existingHeader.content);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.warn("Error: Failed to parse header content", error.message);
        return handleApiErrors(error);
    }
}

export async function PUT(request: NextRequest) {
    const role = request.headers.get("role");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");
    

    try {
    
        const { image, title, subtitle } = await request.json();
        const payload = JSON.stringify({ image, title, subtitle });

        if (!image || !title || !subtitle) throw createBadRequest("All fields are required");
        
        const existingHeader = await prisma.contentBlock.findUnique({
            where: { slug: "header" },
        });

        if (existingHeader) {
            await prisma.contentBlock.update({
                where: { slug: "header" },
                data: { content: payload },
            });
        }
        else {
            await prisma.contentBlock.create({
                data: {
                    slug: "header",
                    title: "Headerinnehåll",
                    content: payload,
                },
            });
        }

        return NextResponse.json({ message: "Header content updated successfully" }, { status: 200 });
        
    } catch (error) {
        console.warn("Error: Failed to update header content", error.message);
        return handleApiErrors(error);
    }
}
