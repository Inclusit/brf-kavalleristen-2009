import * as Jose from "jose";

type JWTUserPayload = {
  userId: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  [key: string]: any;
};

//Ensureethe environment variable is available
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

//convert the secret into a Unit8Array
const encodedSecret = new TextEncoder().encode(secret);

export async function signJWT(payload: JWTUserPayload): Promise<string> {
   return await new Jose.SignJWT({
     userId: payload.userId,
     role: payload.role,
   })
     .setProtectedHeader({ alg: "HS256" })
     .setIssuedAt()
     .setExpirationTime("1d")
     .sign(encodedSecret);
}

export async function verifyJWT(token: string): Promise<JWTUserPayload | null> {
  try {
    const { payload } = await Jose.jwtVerify(token, encodedSecret);
    return payload as JWTUserPayload;
  } catch (error) {
    return null;
  }
}
