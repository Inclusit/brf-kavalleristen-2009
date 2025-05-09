import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { UserUpdateData, SafeUser } from "@/app/types/user";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createUnauthorized,
  createBadRequest,
  createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const role = request.headers.get("role");

    if (!role) throw createUnauthorized("Failed to retrieve role from headers");
    if (role !== "ADMIN") throw createForbidden("Unauthorized");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.warn("Error: Failed to get users", error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const role = request.headers.get("role");

    if (!role) throw createUnauthorized("Failed to retrieve role from headers");
    if (role !== "ADMIN") throw createForbidden("Unauthorized");

    const body = await request.json();
    if (!body.id) throw createBadRequest("User ID is required");

    const updatedData = {
      ...(body.email && { email: body.email.toLowerCase() }),
      ...(body.password && { password: body.password }),
      ...(body.role && { role: body.role }),
    };

    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: updatedData,
    });

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser as SafeUser);

  } catch (error: any) {
    console.warn("Error: Failed to update user", error.message);
    return handleApiErrors(error);
  }
}
