import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest, ctx: RouteContext<"/api/public/[slug]/tickets/[code]">) {
  const { slug, code } = await ctx.params;
  const email = request.nextUrl.searchParams.get("email");

  if (!email) return NextResponse.json({ error: "Ingresa tu correo" }, { status: 400 });

  const rows = await sql`
    SELECT t.id, t.code, t.subject, t.status, t.priority, t.requester_name, t.requester_email, t.created_at
    FROM tickets t
    JOIN accounts a ON a.id = t.account_id
    WHERE a.slug = ${slug} AND t.code = ${code.toUpperCase()}
  `;
  const ticket = rows[0];

  if (!ticket || ticket.requester_email !== email.toLowerCase()) {
    return NextResponse.json({ error: "Ticket no encontrado. Revisa el código y el correo." }, { status: 404 });
  }

  const messages = await sql`
    SELECT id, author_type, body, created_at FROM ticket_messages
    WHERE ticket_id = ${ticket.id} ORDER BY created_at ASC
  `;

  return NextResponse.json({ ticket, messages });
}
