import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentAccountId } from "@/lib/session";
import { CopyLinkButton } from "@/components/CopyLinkButton";

export default async function SettingsPage() {
  const accountId = await getCurrentAccountId();
  if (!accountId) redirect("/login");

  const rows = await sql`SELECT business_name, email, slug FROM accounts WHERE id = ${accountId}`;
  const account = rows[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Ajustes</h1>
        <p className="text-sm text-slate-500">Tu página pública de soporte y los datos de tu cuenta.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Tu página de soporte
          </p>
          <CopyLinkButton slug={account.slug} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Cuenta</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Negocio</dt>
              <dd className="text-slate-900">{account.business_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Correo</dt>
              <dd className="text-slate-900">{account.email}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
