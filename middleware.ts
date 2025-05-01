import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./app/lib/utils/jwt";

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const UNSAFE_REQUESTS = [
  "/api/users",
  "/api/auth/register",
  "/api/admin/users",
];

const AUTH_EXEMPT_REQUESTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/passwordReset",
];

export default async function middleware(request: NextRequest) {
  //parse the request url to get the pathname for comparison with the UNSAFE_REQUESTS array

  const url = new URL(request.url, "http://localhost:3000");
  const path = url.pathname;
  console.log("middleware called", request.method, url.pathname);
  /*request.headers.forEach((value, key) => {
    console.log(key, value);
  });*/

  //if the request path is in the AUTH_EXEMPT_REQUESTS array, return without validating the token
  //this is used for requests that don't require authentication, such as login and register
  if (AUTH_EXEMPT_REQUESTS.some((exemptPath) => path.startsWith(exemptPath))) {
    console.log("auth exempt request", path);
    return NextResponse.next();
  }

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
      const authorization = request.headers.get("authorization");
      if (!authorization?.startsWith("Bearer")) {
        console.log(request.headers);
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
      headers.set("role", decryptedToken.role);
      console.log("userId: ", decryptedToken.userId);
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
  matcher: ["/api/auth/:path*", "/api/users/:path*", "/api/admin/:path*"],
};
