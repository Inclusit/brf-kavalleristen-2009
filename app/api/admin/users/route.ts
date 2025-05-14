import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/utils/jwt";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createUnauthorized,
  createBadRequest,
  createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    throw createUnauthorized("Ingen auth-header");

  const token = authHeader.split(" ")[1];
  const payload = await verifyJWT(token);
  if (!payload || payload.role !== "ADMIN")
    throw createForbidden("Endast admin har behörighet");

  return payload;
}

export async function GET(request: NextRequest) {
  
  try {
    await authenticateAdmin(request);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        address: true,
        phone: true,
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
    await authenticateAdmin(request);

    const body = await request.json();
    if (!body.id) throw createBadRequest("User ID krävs");

    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...(body.email && { email: body.email.toLowerCase() }),
        ...(body.password && { password: body.password }),
        ...(body.role && { role: body.role }),
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.phone && { phone: body.phone }),
        ...(body.address && { address: body.address }),
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
  try {
    await authenticateAdmin(request);

    const body = await request.json();
    if (!body.id) throw createBadRequest("User ID krävs");

    await prisma.user.delete({ where: { id: body.id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.warn("Error: Failed to delete user", error.message);
    return handleApiErrors(error);
  }
}
