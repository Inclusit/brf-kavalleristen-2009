import { NavigationData } from "@/app/types/nav";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { category, label, href } = (await request.json()) as NavigationData;

    if (!category || !label || !href) {
      return NextResponse.json(
        { message: "Kategori, titel och länk krävs" },
        { status: 400 }
      );
    }

    const existingNavigation = await prisma.navigation.findFirst({
      where: { href },
    });

    if (existingNavigation) {
      return NextResponse.json(
        { message: "En sida med denna länk finns redan" },
        { status: 400 }
      );
    }

    const entry = await prisma.navigation.create({
      data: {
        category,
        label,
        href,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.warn("Error: Failed to create navigation", error.message);
    return NextResponse.json(
      { message: "An error occurred while creating navigation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const entries = await prisma.navigation.findMany();

    return NextResponse.json(entries, { status: 200 });
  } catch (error: any) {
    console.warn("Error: Failed to get navigation", error.message);
    return NextResponse.json(
      { message: "An error occurred while fetching navigation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { href } = (await request.json()) as NavigationData;
    if (!href) {
      return NextResponse.json({ message: "Länk krävs" }, { status: 400 });
    }

    const navToDelete = await prisma.navigation.findUnique({
      where: { href },
    });

    if (!navToDelete) {
      return NextResponse.json(
        { message: "Ingen sida med denna länk hittades" },
        { status: 404 }
      );
    }

    const categoryContent = await prisma.navigation.findMany({
      where: {
        category: navToDelete.category,
        NOT: { href },
      },
    });

    if (categoryContent.length > 0) {
        return NextResponse.json(
            { message: "Du kan ej ta bort kategorin så länge det finns sidor" },
            { status: 400 }
        );
        }   

    await prisma.navigation.delete({
      where: { href },
    });

    return NextResponse.json(
      { message: "Sidan har tagits bort" },
      { status: 200 }
    );
  } catch (error: any) {
    console.warn("Error: Failed to delete navigation", error.message);
    return NextResponse.json(
      { message: "An error occurred while deleting navigation" },
      { status: 500 }
    );
  }
}
