import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UserUpdateData, SafeUser } from "@/app/types/user";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createUnauthorized,
  createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {

  const userId = request.headers.get("userId");

  if (!userId) throw createUnauthorized("Failed to retrieve userId from headers");

  try {

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const safeUser = {
      ...user,
      password: undefined,
    };

    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.warn("Error: Failed to get user from request", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  const userId = request.headers.get("userId");

  if (!userId) throw createUnauthorized("Failed to retrieve userId from headers");

  try {
    const body = await request.json() as Partial<Pick<UserUpdateData,  "email" | "password">>;

    if (!body) throw createBadRequest("Invalid request body");

    if (!body.email && !body.password) throw createBadRequest("No data to update");

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(body.email && { email: body.email.toLowerCase() }),
        ...(body.password && { password: body.password }),
      },
    });

    const { password, ...safeUser } = user; 

    return NextResponse.json(safeUser, 
      { status: 200 }
    );

  } catch (error: any) {
    console.warn("Error: Failed to update user", error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  const userId = request.headers.get("userId");

  try {
    const body = await request.json();

    if (!body) throw createBadRequest("Invalid request body");

    if (!body.id) throw createBadRequest("User ID is required");

    if (!userId) throw createUnauthorized("Failed to retrieve userId from headers");

    if (body.id !== userId) throw createForbidden("You can only delete your own account");

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.warn("Error: Failed to delete user", error.message);
    return handleApiErrors(error);
  }
}
