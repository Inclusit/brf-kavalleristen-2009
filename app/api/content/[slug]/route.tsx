import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "path";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const content = await prisma.contentBlock.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!content) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.warn("Error: Failed to get content", error.message);
    return NextResponse.json(
      { message: "An error occurred while fetching content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const role = request.headers.get("role");
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const content = body.content;
    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    let contentBlock = await prisma.contentBlock.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!contentBlock) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 }
      );
    }

    if (contentBlock) {
      contentBlock = await prisma.contentBlock.update({
        where: {
          slug: slug,
        },
        data: {
          content: content,
        },
      });
      return NextResponse.json(contentBlock, { status: 200 });
    }

  } catch (error: any) {
    console.warn("Error: Failed to update content", error.message);
    return NextResponse.json(
      { message: "An error occurred while updating content" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const role = request.headers.get("role");
    if (role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const contentBlock = await prisma.contentBlock.findUnique({
      where: {
        slug
      },
    });

    if (!contentBlock) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 }
      );
    }

    await prisma.contentBlock.delete({
      where: {
        slug: slug,
      },
    });

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error: any) {
    console.warn("Error: Failed to delete content", error.message);
    return NextResponse.json(
      { message: "An error occurred while deleting content" },
      { status: 500 }
    );
  }
}
