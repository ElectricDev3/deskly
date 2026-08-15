import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentAccountId } from "@/lib/session";

export async function GET(request: NextRequest) {
  const accountId = await getCurrentAccountId();
  if (!accountId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status");

  const tickets =
    status && status !== "all"
      ? await sql`
          SELECT id, code, subject, requester_name, requester_email, status, priority, created_at, updated_at
          FROM tickets
          WHERE account_id = ${accountId} AND status = ${status}
          ORDER BY updated_at DESC
        `
      : await sql`
          SELECT id, code, subject, requester_name, requester_email, status, priority, created_at, updated_at
          FROM tickets
          WHERE account_id = ${accountId}
          ORDER BY updated_at DESC
        `;

  return NextResponse.json({ tickets });
}
