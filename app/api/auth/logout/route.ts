import { NextResponse } from "next/server";
import { sessionName } from "../../../lib/admin-session";

export async function POST(request: Request) {
  const baseUrl = process.env.APP_URL || new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin", baseUrl));
  response.cookies.delete(sessionName);
  return response;
}
