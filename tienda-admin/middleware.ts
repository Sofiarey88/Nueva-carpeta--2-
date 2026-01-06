import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname.startsWith("/admin/login");
  const hasSession = req.cookies.get("admin_session")?.value === "1";

  if (isAdminPath && !isLoginPath && !hasSession) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPath && hasSession) {
    const url = new URL("/admin", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
