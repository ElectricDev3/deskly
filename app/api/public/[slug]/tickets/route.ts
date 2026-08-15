import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateTicketCode } from "@/lib/ticketCode";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/public/[slug]/tickets">) {
  const { slug } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { subject, message, requesterName, requesterEmail } = body as Record<string, string>;

  if (!subject || subject.trim().length < 3) {
    return NextResponse.json({ error: "Escribe un asunto" }, { status: 400 });
  }
  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Describe tu problema" }, { status: 400 });
  }
  if (!requesterName || requesterName.trim().length < 2) {
    return NextResponse.json({ error: "Ingresa tu nombre" }, { status: 400 });
  }
  if (!requesterEmail || !isValidEmail(requesterEmail)) {
    return NextResponse.json({ error: "Ingresa un correo válido" }, { status: 400 });
  }

  const accounts = await sql`SELECT id FROM accounts WHERE slug = ${slug}`;
  const account = accounts[0];
  if (!account) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  let code = generateTicketCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await sql`SELECT id FROM tickets WHERE code = ${code}`;
    if (existing.length === 0) break;
    code = generateTicketCode();
  }

  const rows = await sql`
    INSERT INTO tickets (account_id, code, subject, requester_name, requester_email)
    VALUES (${account.id}, ${code}, ${subject.trim()}, ${requesterName.trim()}, ${requesterEmail.toLowerCase()})
    RETURNING id, code
  `;
  const ticket = rows[0];

  await sql`
    INSERT INTO ticket_messages (ticket_id, author_type, body)
    VALUES (${ticket.id}, 'customer', ${message.trim()})
  `;

  return NextResponse.json({ ok: true, code: ticket.code }, { status: 201 });
}
