import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import { generateAuthToken, timingSafeEqual } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const password = process.env.PAGE_ACCESS_PASSWORD;

  if (!password) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);
  const receivedToken = cookies.authToken;

  if (!receivedToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const expectedToken = await generateAuthToken(password);
  const valid = timingSafeEqual(receivedToken, expectedToken);

  return NextResponse.json(
    { authenticated: valid },
    { status: valid ? 200 : 401 },
  );
}
