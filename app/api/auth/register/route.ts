//app/api/auth/login/route.ts
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
 
  try {
    const body: UserRegistrationData = await request.json();
    const [hasErrors, errors] = UserRegistrationValidator(body);

    if (hasErrors) {
      throw createBadRequest(
        "Error i registreringsformulär: " + JSON.stringify(errors)
      );
    }

    const { email, password, firstName, lastName, address, phone } = body;

    const hashedPassword = await hashPassword(body.password);

    const userCheck = await userExists(prisma, body.email);
    if (userCheck) throw createConflict("Användare med denna e-postadress finns redan");


    const user: User = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hashPassword(password),
        role: "USER",
        firstName,
        lastName,
        address,
        phone,
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
