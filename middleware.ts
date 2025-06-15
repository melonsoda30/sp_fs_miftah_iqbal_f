/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const userId = req.auth?.user?.id;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/callback",
    "/api/auth/error",
  ];

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings", "/projects"];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
  );

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Handle project-specific routes
  const projectRouteMatch = nextUrl.pathname.match(
    /^\/project\/([^\/]+)(?:\/(.*))?$/
  );
  const isProjectRoute = !!projectRouteMatch;

  if (isProjectRoute) {
    // const projectId = projectRouteMatch[1];
    // const subPath = projectRouteMatch[2] || "";

    // User must be authenticated to access any project route
    if (!isAuthenticated || !userId) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For project routes, we'll check access in the page component itself
    // Middleware hanya check authentication, bukan authorization
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login/register
  if (
    isAuthenticated &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
