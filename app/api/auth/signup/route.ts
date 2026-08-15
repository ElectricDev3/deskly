import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { isValidEmail, isValidSlug, slugify } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { email, password, businessName } = body as Record<string, string>;

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  if (!businessName || businessName.trim().length < 2) {
    return NextResponse.json({ error: "Ingresa el nombre de tu negocio" }, { status: 400 });
  }

  let slug = slugify(businessName);
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "No se pudo generar una URL válida a partir del nombre" }, { status: 400 });
  }

  const existingEmail = await sql`SELECT id FROM accounts WHERE email = ${email.toLowerCase()}`;
  if (existingEmail.length > 0) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }

  const existingSlug = await sql`SELECT id FROM accounts WHERE slug = ${slug}`;
  if (existingSlug.length > 0) {
    const suffix = Math.random().toString(36).slice(2, 6);
    slug = `${slug}-${suffix}`;
  }

  const passwordHash = await hashPassword(password);

  const rows = await sql`
    INSERT INTO accounts (email, password_hash, business_name, slug)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${businessName.trim()}, ${slug})
    RETURNING id, slug
  `;

  const account = rows[0];
  await createSession(account.id);

  return NextResponse.json({ ok: true, slug: account.slug });
}
