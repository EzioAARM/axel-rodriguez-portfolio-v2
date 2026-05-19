import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import { generateAuthToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Try again in 15 minutes." },
      {
        status: 429,
        headers: { "Retry-After": "900" },
      },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

  if (!correctPassword) {
    console.error("PAGE_ACCESS_PASSWORD is not set");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

  if (password !== correctPassword) {
    return NextResponse.json(
      { message: "Incorrect password", remaining },
      { status: 401 },
    );
  }

  const token = await generateAuthToken(correctPassword);

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    }),
  );

  return response;
}
