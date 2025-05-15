//app/api/auth/password-reset/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/utils/bcrypt";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createNotFound,
  createUnauthorized,
} from "@/app/lib/errors";


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  
  try {
    const {email, newPassword} = await request.json();
  
    if (!email || !newPassword) {
      throw createBadRequest("Email och nytt lösenord krävs");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw createNotFound("Användare hittades inte");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return handleApiErrors(error);
  }
}