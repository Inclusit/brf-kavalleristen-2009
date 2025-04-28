import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./jwt"; 

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const UNSAFE_REQUESTS = ["/api/users/me"];

export default async function middleware(request: NextRequest) {
  //parse the request url to get the pathname for comparison with the UNSAFE_REQUESTS array
  const url = new URL(request.url, "http://localhost:3000");
  console.log("middleware called", request.method, url.pathname);

  //if the request method is unsafe or the request path is unsafe, return without validating the token
  if (
    UNSAFE_METHODS.includes(request.method) ||
    UNSAFE_REQUESTS.some((unsafeRequest) =>
      url.pathname.startsWith(unsafeRequest)
    )
  ) {
    try {
      console.log("unsafe method");
      //get the authorization header from the request and extract the token from it
      const authorization = request.headers.get("Authorization");
      if (!authorization) {
        throw new Error("No authorization header found");
      }

      //extract the token from the authorization header
      const token = authorization.split(" ")?.[1] || null;

      if (!token) {
        throw new Error("No token found in authorization header");
      }

      //verify the token and get the decrypted token payload
      const decryptedToken = await verifyJWT(token);

      if (!decryptedToken) {
        throw new Error("Failed to decrypt token or no token payload found");
      }

      //set the userId header with the decrypted token userId
      const headers = new Headers();
      headers.set("userId", decryptedToken.userId);

      return NextResponse.next({ headers });
    } catch (error: any) {
      console.log("Error validating token: ", error.message);
      return NextResponse.json(
        {
          message: "Unauthenticated",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/users/me",
    "/api/users/me/:path*",
    "/api/properties/:id*",
    "/api/bookings/:id*",
    "/api/bookings/",
  ],
};
