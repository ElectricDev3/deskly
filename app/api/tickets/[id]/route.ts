import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentAccountId } from "@/lib/session";

export async function GET(_req: Request, ctx: RouteContext<"/api/tickets/[id]">) {
  const accountId = await getCurrentAccountId();
  if (!accountId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;

  const tickets = await sql`
    SELECT id, code, subject, requester_name, requester_email, status, priority, created_at, updated_at
    FROM tickets WHERE id = ${id} AND account_id = ${accountId}
  `;
  const ticket = tickets[0];
  if (!ticket) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const messages = await sql`
    SELECT id, author_type, body, created_at FROM ticket_messages
    WHERE ticket_id = ${id} ORDER BY created_at ASC
  `;

  return NextResponse.json({ ticket, messages });
}

const VALID_STATUS = new Set(["open", "in_progress", "closed"]);
const VALID_PRIORITY = new Set(["low", "normal", "high"]);

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/tickets/[id]">) {
  const accountId = await getCurrentAccountId();
  if (!accountId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { status, priority } = body as { status?: string; priority?: string };

  if (status !== undefined && !VALID_STATUS.has(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }
  if (priority !== undefined && !VALID_PRIORITY.has(priority)) {
    return NextResponse.json({ error: "Prioridad inválida" }, { status: 400 });
  }

  if (status !== undefined) {
    await sql`UPDATE tickets SET status = ${status}, updated_at = now() WHERE id = ${id} AND account_id = ${accountId}`;
  }
  if (priority !== undefined) {
    await sql`UPDATE tickets SET priority = ${priority}, updated_at = now() WHERE id = ${id} AND account_id = ${accountId}`;
  }

  return NextResponse.json({ ok: true });
}
