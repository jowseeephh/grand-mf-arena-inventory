import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Edge-level guard. Pages/actions ALSO re-check the session server-side (requireAdmin / requireStore).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("gma_session")?.value;
  let role: string | null = null;
  if (token && process.env.AUTH_SECRET) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      role = payload.role as string;
    } catch {}
  }
  const to = (p: string) => NextResponse.redirect(new URL(p, req.url));

  if (pathname === "/login") return role ? to(role === "ADMIN" ? "/admin" : "/store") : NextResponse.next();
  if (!role) return to("/login");
  if (pathname.startsWith("/admin") && role !== "ADMIN") return to("/store");
  if (pathname.startsWith("/store") && role !== "STORE") return to("/admin");
  return NextResponse.next();
}

export const config = { matcher: ["/login", "/admin/:path*", "/store/:path*"] };
