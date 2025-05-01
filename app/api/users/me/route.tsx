import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UserUpdateData, SafeUser } from "@/app/types/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Get the userId from the request headers
  const userId = request.headers.get("userId");

  if (!userId) {
    throw new Error("Failed to retrieve userId from headers");
  }

  try {
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
  const userId = request.headers.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "Failed to retrieve userId from headers" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json() as Partial<Pick<UserUpdateData,  "email" | "password">>;

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!body.email && !body.password) {
      return NextResponse.json(
        { message: "No data to update" },
        { status: 400 }
      );
    }

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

    if (!userId) {
      return NextResponse.json(
        { message: "Failed to retrieve userId from headers" },
        { status: 401 }
      );
    }

    if (body.id !== userId) {
      return NextResponse.json(
        { message: "You are not authorized to delete this user" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
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
