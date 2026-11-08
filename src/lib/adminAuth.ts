import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "cbd_admin_session";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "cbd-poet-colligan-admin-secret-2026"
  );
}

export function getExpectedCredentials() {
  const expectedEmail = (
    process.env.ADMIN_EMAIL || "clodaghberesford@yahoo.com"
  )
    .trim()
    .toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "ColliganPoet2026!";

  return { expectedEmail, expectedPassword };
}

export function verifyAdminCredentials(
  emailOrUsername: string,
  password: string
): { valid: boolean; email: string } {
  const { expectedEmail, expectedPassword } = getExpectedCredentials();
  const normalizedUser = emailOrUsername.trim().toLowerCase();

  const userMatches =
    normalizedUser === expectedEmail ||
    normalizedUser === "admin" ||
    normalizedUser === "clodagh" ||
    normalizedUser === "joe@networksolutions.ie";

  const passMatches = password === expectedPassword;

  return {
    valid: userMatches && passMatches,
    email: userMatches ? normalizedUser : expectedEmail,
  };
}

export function createAdminSessionToken(email: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token?: string): {
  valid: boolean;
  email?: string;
} {
  if (!token || !token.includes(".")) return { valid: false };
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { valid: false };

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  if (sig !== expectedSig) return { valid: false };

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { email: string; exp: number };
    if (!decoded.exp || Date.now() > decoded.exp) {
      return { valid: false };
    }
    return { valid: true, email: decoded.email };
  } catch {
    return { valid: false };
  }
}

export async function isAdminAuthenticated(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const verified = verifyAdminSessionToken(token);
  return { authenticated: verified.valid, email: verified.email };
}
