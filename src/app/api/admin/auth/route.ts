import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isAdminAuthenticated,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

export async function GET() {
  const status = await isAdminAuthenticated();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both your email/username and password." },
        { status: 400 }
      );
    }

    const result = verifyAdminCredentials(email, password);
    if (!result.valid) {
      return NextResponse.json(
        { error: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(result.email);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      ok: true,
      authenticated: true,
      email: result.email,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication error", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true, authenticated: false });
}
