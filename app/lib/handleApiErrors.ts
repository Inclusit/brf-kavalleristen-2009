//app/lib/errors.ts
import { NextResponse } from "next/server";

export function handleApiErrors(error: unknown) {
  if (error instanceof Error) {
    switch (error.name) {
      case "BadRequest": 
        return NextResponse.json({ message: error.message }, { status: 400 });
    case "NotFound":
        return NextResponse.json({ message: error.message }, { status: 404 });
      case "Unauthorized":
        return NextResponse.json({ message: error.message }, { status: 401 });
      case "Forbidden":
        return NextResponse.json({ message: error.message }, { status: 403 });
      case "InternalServerError":
        return NextResponse.json({ message: error.message }, { status: 500 });
      case "Conflict":
        return NextResponse.json({ message: error.message }, { status: 409 });
      default:
        return NextResponse.json({ message: "Intern Server Error" }, { status: 500 });
    }
  }

  console.error("Unexpected error:", error);
  return NextResponse.json(
    { message: "Intern Server Error - Försök igen senare" }, 
    { status: 500 }
  )


}