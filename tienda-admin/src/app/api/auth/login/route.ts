import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admi1234";

export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json()) as { password?: string };
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });
    return res;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida" }, { status: 400 });
  }
}
