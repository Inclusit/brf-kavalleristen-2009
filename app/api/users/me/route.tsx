//src/app/api/users/me/route.tsx

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UserUpdateData } from "../../../types/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the userId from the request headers
    const userId = request.headers.get("userId");
    if (!userId) {
      throw new Error("Failed to retrieve userId from headers");
    }

    // Find the user in the database using the userId from the headers
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    // Remove the password from the user object before returning it to the client
    const safeUser = {
      ...user,
      password: undefined,
    };

    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.warn("Error: Failed to get user from request", error.message);
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.warn("Error: Failed to update user", error.message);
    return NextResponse.json(
      { message: "An error occurred while updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const userId = request.headers.get("userId");

  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (body.id !== userId) {
      return NextResponse.json(
        { message: "You are not authorized to delete this user" },
        { status: 403 }
      );
    }

    await prisma.booking.deleteMany({
      where: {
        userId: body.id,
      },
    });

    await prisma.property.deleteMany({
      where: {
        ownerId: body.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.warn("Error: Failed to delete user", error.message);
    return NextResponse.json(
      { message: "An error occurred while deleting user" },
      { status: 500 }
    );
  }
}
