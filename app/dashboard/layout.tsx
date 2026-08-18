import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentAccountId } from "@/lib/session";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const accountId = await getCurrentAccountId();
  if (!accountId) redirect("/login");

  const rows = await sql`SELECT business_name, slug FROM accounts WHERE id = ${accountId}`;
  const account = rows[0];
  if (!account) redirect("/login");

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <DashboardNav businessName={account.business_name} slug={account.slug} />
      <main className="flex-1 px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
