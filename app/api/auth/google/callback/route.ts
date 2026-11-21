import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getAdminEmail, sessionName } from "../../../../lib/admin-session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("bahati_google_state")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const baseUrl = process.env.APP_URL || request.nextUrl.origin;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/admin?error=invalid_state", baseUrl));
  }
  if (!clientId || !clientSecret || !sessionSecret) {
    return NextResponse.redirect(new URL("/admin?error=not_configured", baseUrl));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/admin?error=google_login_failed", baseUrl));
  }

  const tokenData = await tokenResponse.json();
  const profileResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
  );
  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL("/admin?error=google_profile_failed", baseUrl));
  }

  const profile = await profileResponse.json();
  if (profile.email !== getAdminEmail() || profile.email_verified !== true) {
    return NextResponse.redirect(new URL("/admin?error=unauthorized", baseUrl));
  }

  const token = await new SignJWT({
    email: profile.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(sessionSecret));

  const response = NextResponse.redirect(new URL("/admin", baseUrl));
  response.cookies.set(sessionName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.delete("bahati_google_state");
  return response;
}
