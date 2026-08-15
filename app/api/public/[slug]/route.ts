import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_req: Request, ctx: RouteContext<"/api/public/[slug]">) {
  const { slug } = await ctx.params;

  const accounts = await sql`SELECT business_name FROM accounts WHERE slug = ${slug}`;
  const account = accounts[0];
  if (!account) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ businessName: account.business_name });
}
