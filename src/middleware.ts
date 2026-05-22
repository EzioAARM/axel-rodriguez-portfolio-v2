import { NextRequest, NextResponse } from "next/server";
import { generateAuthToken, timingSafeEqual } from "@/lib/auth";
import { protectedRoutes } from "@/resources";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/i18n/translations";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Server-side enforcement of password-protected routes
  const isProtected = Object.keys(protectedRoutes).some(
    (route) => protectedRoutes[route as keyof typeof protectedRoutes] && pathname === route,
  );

  if (isProtected) {
    const password = process.env.PAGE_ACCESS_PASSWORD;
    const token = request.cookies.get("authToken")?.value;

    if (!password || !token) {
      return redirectToHome(request);
    }

    const expected = await generateAuthToken(password);
    if (!timingSafeEqual(token, expected)) {
      return redirectToHome(request);
    }
  }

  // Set default locale cookie on first visit (used by non-prefixed routes)
  const response = NextResponse.next();
  if (!request.cookies.has(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

function redirectToHome(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
