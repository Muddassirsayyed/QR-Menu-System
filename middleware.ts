// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED = ["/dashboard"];
const PUBLIC_ONLY = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const session = token ? await verifyToken(token) : null;

  // Protected routes → redirect to login if not authed
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Public-only routes → redirect to dashboard if already authed
  if (PUBLIC_ONLY.some((p) => pathname.startsWith(p))) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
