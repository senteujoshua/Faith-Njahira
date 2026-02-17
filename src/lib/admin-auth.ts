import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD not set in environment");
    return false;
  }

  return username === adminUser && password === adminPass;
}

export async function createSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashPassword(token);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  // Store the hashed token for verification
  // Using a simple approach: store in cookie and verify presence
  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return !!session?.value;
}
