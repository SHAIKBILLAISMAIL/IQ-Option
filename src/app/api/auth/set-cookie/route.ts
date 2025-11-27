import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "bearer_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error("set-cookie error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}