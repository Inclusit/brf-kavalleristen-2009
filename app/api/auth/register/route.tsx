import { UserRegistrationData } from "../../../types/user";
import { hashPassword } from "../../../lib/utils/bcrypt";
import { signJWT } from "../../../lib/utils/jwt";
import { userExists } from "../../../lib/utils/prisma";
import { UserRegistrationValidator } from "../../../lib/utils/validators/userValidator";
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("POST /api/auth/register called");
  try {
    //get user data from request body and run it through the validator
    const body: UserRegistrationData = await request.json();
    const [hasErrors, errors] = UserRegistrationValidator(body);

    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);

    //Check if user already exists
    const userCheck = await userExists(prisma, body.email);

    if (userCheck) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    //Create user
    const user: User = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: "USER"
      },
    });

    //Sign JWT token and return it to the user for authentication
    const token = await signJWT({
      userId: user.id,
      role: user.role,
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
