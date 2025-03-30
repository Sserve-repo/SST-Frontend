import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/auth", "/auth/forgot-password"];

const protectedPaths = [
  "/buyer/dashboard",
  "/vendor/dashboard",
  "/artisan/dashboard",
  "/buyer/dashboard/*",
  "/vendor/dashboard/*",
  "/artisan/dashboard/*",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true";
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute = pathname === "/auth"

  const isPublicPath =
    publicPaths.some((path) => pathname.startsWith(path)) || isAuthRoute;

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (isAuthenticated && accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicPath || (requiresAuth && isAuthenticated && accessToken)) {
    return NextResponse.next();
  }

  if (requiresAuth && (!isAuthenticated || !accessToken)) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("from", pathname + searchParams.toString());
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
