import { NextRequest, NextResponse } from "next/server";
import { generateAuthToken, timingSafeEqual } from "@/lib/auth";
import { protectedRoutes } from "@/resources";

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

  return NextResponse.next();
}

function redirectToHome(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  // Run on all routes except static assets, _next internals, and the studio
  matcher: ["/((?!_next/static|_next/image|favicon.ico|studio).*)"],
};
