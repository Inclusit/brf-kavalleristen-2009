import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import { createBadRequest, createUnauthorized } from "@/app/lib/errors";
import { BoardMemberUpdateData, BoardMemberCreateData } from "@/app/types/boardMember";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const boardMembers = await prisma.boardMembers.findMany();
    return NextResponse.json(boardMembers);
  } catch (error: any) {
    console.warn("Error: Failed to get board members", error.message);
    return handleApiErrors(error);
  }
}


export async function POST(request: NextRequest) {
  try {
    const role = request.headers.get("role");
    if (role !== "ADMIN") throw createUnauthorized("Unauthorized");

    const body: BoardMemberCreateData = await request.json();
    const { name, position, phone, email, image } = body;

    if (!name || !position || !phone || !email || !image) {
      throw createBadRequest("All fields are required");
    }

    const newBoardMember = await prisma.boardMembers.create({
      data: { name, position, phone, email, image },
    });

    return NextResponse.json(newBoardMember);
  } catch (error: any) {
    console.warn("Error: Failed to create board member", error.message);
    return handleApiErrors(error);
  }
}