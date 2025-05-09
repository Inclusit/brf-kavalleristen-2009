import { UserRegistrationData } from "../../../types/user";
import { hashPassword } from "../../../lib/utils/bcrypt";
import { signJWT } from "../../../lib/utils/jwt";
import { userExists } from "../../../lib/utils/prisma";
import { UserRegistrationValidator } from "../../../lib/utils/validators/userValidator";
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import {
  createBadRequest,
  createConflict,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("POST /api/auth/register called");
  try {
    const body: UserRegistrationData = await request.json();
    const [hasErrors, errors] = UserRegistrationValidator(body);

    if (hasErrors) {
      throw createBadRequest(
        "Error in registration form: " + JSON.stringify(errors)
      );
    }

    const hashedPassword = await hashPassword(body.password);

    const userCheck = await userExists(prisma, body.email);
    if (userCheck) throw createConflict("User already exists");


    const user: User = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: "USER"
      },
    });

    const token = await signJWT({
      userId: user.id,
      role: user.role,
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error: any) {
    return handleApiErrors(error);
  }
}
