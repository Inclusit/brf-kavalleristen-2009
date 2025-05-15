import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import { createBadRequest, createUnauthorized } from "@/app/lib/errors";
import { BoardMemberUpdateData, BoardMemberCreateData } from "@/app/types/boardMember";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.boardMembers.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error: any) {
    console.warn("Kunde inte hämta medlem via ID", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = request.headers.get("role");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

    const body: Omit<BoardMemberUpdateData, "id"> = await request.json();
    const id = params.id;

    const { name, position, phone, email, image } = body;

    if (!name || !position || !phone || !email || !image) {
      throw createBadRequest("Alla fält krävs");
    }

    const updated = await prisma.boardMembers.update({
      where: { id },
      data: { name, position, phone, email, image },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.warn("Error i att uppdatera styrelsemedlem", error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = request.headers.get("role");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

    const id = params.id;

    const deleted = await prisma.boardMembers.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.warn("Kunde inte radera styrelsemedlem", error.message);
    return handleApiErrors(error);
  }
}