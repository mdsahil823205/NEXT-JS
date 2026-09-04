import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const pathName = req.nextUrl.pathname;

  // Public paths
  const publicPaths = ["/login", "/register", "/api/auth"];
  const isPublicRoute = publicPaths.some((path) => pathName.startsWith(path));

  // 1. Await zaroori hai
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 2. Agar logged in hai aur login/register par gaya -> Home bhej do
  if (token && (pathName === "/login" || pathName === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Agar public page hai -> Aage jaane do
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. Agar token nahi hai aur protected page hai -> Login par redirect
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};