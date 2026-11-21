import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const sessionName = "bahati_admin";

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "bahatixofficial@gmail.com";
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function getAdminSession() {
  const secret = getSessionSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(sessionName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.email !== getAdminEmail()) return null;
    return payload;
  } catch {
    return null;
  }
}

export { sessionName };
