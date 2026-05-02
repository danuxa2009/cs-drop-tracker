import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const password = typeof body?.password === "string" ? body.password : "";
  const adminPass = process.env.ADMIN_PASS ?? "";

  if (!adminPass || password !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("role", "admin", { httpOnly: true, secure: true, sameSite: "strict" });

  return NextResponse.json({ ok: true });
}
