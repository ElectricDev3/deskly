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
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink">Ajustes</h1>
        <p className="text-sm text-ink-soft">Tu página pública de soporte y los datos de tu cuenta.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-paper-raised p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Tu página de soporte
          </p>
          <CopyLinkButton slug={account.slug} />
        </div>

        <div className="rounded-lg border border-line bg-paper-raised p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Cuenta</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Negocio</dt>
              <dd className="text-ink">{account.business_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Correo</dt>
              <dd className="text-ink">{account.email}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
