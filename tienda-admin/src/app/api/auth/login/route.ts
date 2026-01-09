import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";
const EMPLOYEE_PASSWORD = process.env.EMPLOYEE_PASSWORD || "emp1234";

export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json()) as { password?: string };
    
    let role: string | null = null;
    
    if (password === ADMIN_PASSWORD) {
      role = "admin";
    } else if (password === EMPLOYEE_PASSWORD) {
      role = "employee";
    } else {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, role });
    res.cookies.set("admin_session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });
    res.cookies.set("user_role", role, {
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
