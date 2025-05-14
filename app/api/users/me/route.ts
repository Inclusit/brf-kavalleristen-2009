import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createUnauthorized,
  createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const userId = request.headers.get("userId");
  if (!userId) throw createUnauthorized("Saknar userId i header");

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.warn("Error: Failed to get user from request", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  const userId = request.headers.get("userId");
  if (!userId) throw createUnauthorized("Saknar userId i header");

  try {
    const body = await request.json();
    if (!body) throw createBadRequest("Body saknas");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.email && { email: body.email.toLowerCase() }),
        ...(body.password && { password: body.password }),
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.address && { address: body.address }),
        ...(body.phone && { phone: body.phone }),
      },
    });

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.warn("Error: Failed to update user", error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  const userId = request.headers.get("userId");

  try {
    const body = await request.json();
    if (!body?.id) throw createBadRequest("User ID krävs");
    if (!userId) throw createUnauthorized("Saknar userId i header");
    if (body.id !== userId)
      throw createForbidden("Du kan bara radera ditt eget konto");

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.warn("Error: Failed to delete user", error.message);
    return handleApiErrors(error);
  }
}
