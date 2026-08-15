import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/public/[slug]/tickets/[code]/messages">) {
  const { slug, code } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { email, text } = body as Record<string, string>;
  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: "Escribe un mensaje" }, { status: 400 });
  }
  if (!email) return NextResponse.json({ error: "Falta el correo" }, { status: 400 });

  const rows = await sql`
    SELECT t.id, t.requester_email FROM tickets t
    JOIN accounts a ON a.id = t.account_id
    WHERE a.slug = ${slug} AND t.code = ${code.toUpperCase()}
  `;
  const ticket = rows[0];
  if (!ticket || ticket.requester_email !== email.toLowerCase()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const inserted = await sql`
    INSERT INTO ticket_messages (ticket_id, author_type, body)
    VALUES (${ticket.id}, 'customer', ${text.trim()})
    RETURNING id, author_type, body, created_at
  `;
  await sql`UPDATE tickets SET updated_at = now() WHERE id = ${ticket.id}`;

  return NextResponse.json({ message: inserted[0] }, { status: 201 });
}
