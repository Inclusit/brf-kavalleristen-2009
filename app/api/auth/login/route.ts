import { UserLoginData } from "../../../types/user";
import { comparePasswords } from "../../../lib/utils/bcrypt";
import { signJWT } from "../../../lib/utils/jwt";
import { userLoginValidator } from "../../../lib/utils/validators/userValidator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiErrors } from "@/app/lib/handleApiErrors";
import { 
  createBadRequest,
  createNotFound,
  createUnauthorized,
} from "@/app/lib/errors";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {

    const body: UserLoginData = await request.json();
    const [hasErrors, errors] = userLoginValidator(body);

    if (hasErrors) {
      throw createBadRequest("Error in form: " + JSON.stringify(errors));
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (!user) throw createNotFound("User not found");


    const validPassword = await comparePasswords(body.password, user.password);
    if (!validPassword) throw createUnauthorized("Invalid email or password");
    

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token: token,
    });
  } catch (error: any) {
    return handleApiErrors(error);
  }
}
