import { NavigationData } from "@/app/types/nav";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createNotFound,
  createUnauthorized,
  createForbidden,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Inkommande data till API:", body);
    

    const {
      category,
      label,
      href,
      pageTitle,
      authOnly = false,
    } = body as NavigationData & { authOnly?: boolean };

    console.log("Rå category-sträng:", JSON.stringify(category));

    console.log("Validering:", {
      category,
      label,
      href,
      pageTitle,
      authOnly,
    });

    if (!category?.trim()) throw createBadRequest("Kategori saknas");
    if (!label?.trim()) throw createBadRequest("Navigationsnamn saknas");
    if (!href?.trim()) throw createBadRequest("Länk saknas");
    if (!pageTitle?.trim()) throw createBadRequest("Sidtitel saknas");

    const existingNavigation = await prisma.navigation.findFirst({
      where: { href },
    });

    if (existingNavigation) throw createBadRequest("Länken finns redan");

    const entry = await prisma.navigation.create({
      data: {
        category,
        label,
        pageTitle,
        href,
        authOnly,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.warn("Error: Failed to create navigation", error.message);
    return handleApiErrors(error);
  }
}


export async function GET(request: NextRequest) {
  try {
    const entries = await prisma.navigation.findMany();

    return NextResponse.json(entries, { status: 200 });
  } catch (error: any) {
    console.warn("Error: Failed to get navigation", error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { href } = body;
    if (!href) throw createBadRequest("Länk krävs");

    const navToDelete = await prisma.navigation.findUnique({
      where: { href },
    });

    if (!navToDelete) throw createNotFound("Länken finns inte");

    await prisma.navigation.delete({
      where: { href },
    });

    return NextResponse.json(
      { message: "Sidan har tagits bort" },
      { status: 200 }
    );
  } catch (error: any) {
    console.warn("Error: Failed to delete navigation", error.message);
    return handleApiErrors(error);
  }
}
