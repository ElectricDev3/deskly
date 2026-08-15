import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { email, password } = body as Record<string, string>;
  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña son obligatorios" }, { status: 400 });
  }

  const rows = await sql`
    SELECT id, password_hash, slug FROM accounts WHERE email = ${email.toLowerCase()}
  `;
  const account = rows[0];

  if (!account || !(await verifyPassword(password, account.password_hash))) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(account.id);
  return NextResponse.json({ ok: true, slug: account.slug });
}
