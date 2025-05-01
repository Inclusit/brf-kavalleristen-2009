import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { UserUpdateData, SafeUser } from "@/app/types/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const role = request.headers.get("role");

  if (!role) {
    return NextResponse.json(
      { message: "Failed to retrieve role from headers" },
      { status: 401 }
    );
  }
  
  if (role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  };


  try {
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
    return NextResponse.json(
      { message: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const role = request.headers.get("role");

  if (!role) {
    return NextResponse.json(
      { message: "Failed to retrieve role from headers" },
      { status: 401 }
    );
  }

  if (role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  };

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { message: "An error occurred while updating user" },
      { status: 500 }
    );
  }
}
