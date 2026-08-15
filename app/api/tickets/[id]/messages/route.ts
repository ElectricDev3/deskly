import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentAccountId } from "@/lib/session";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/tickets/[id]/messages">) {
  const accountId = await getCurrentAccountId();
  if (!accountId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.text !== "string" || body.text.trim().length === 0) {
    return NextResponse.json({ error: "Escribe un mensaje" }, { status: 400 });
  }

  const tickets = await sql`SELECT id FROM tickets WHERE id = ${id} AND account_id = ${accountId}`;
  if (tickets.length === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const rows = await sql`
    INSERT INTO ticket_messages (ticket_id, author_type, body)
    VALUES (${id}, 'staff', ${body.text.trim()})
    RETURNING id, author_type, body, created_at
  `;
  await sql`UPDATE tickets SET updated_at = now() WHERE id = ${id}`;

  return NextResponse.json({ message: rows[0] }, { status: 201 });
}
