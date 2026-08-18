"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { NewTicketForm } from "./NewTicketForm";
import { TicketLookupForm } from "./TicketLookupForm";

type Tab = "new" | "lookup";

export function PublicSupportView({ slug }: { slug: string }) {
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("new");

  useEffect(() => {
    fetch(`/api/public/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => setBusinessName(data.businessName))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <p className="text-sm text-ink-soft">No encontramos esta página de soporte.</p>
      </div>
    );
  }

  if (businessName === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 size={20} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-display text-xl font-semibold tracking-tight text-ink">{businessName}</h1>
        <p className="mb-6 text-center text-sm text-ink-soft">¿En qué te podemos ayudar?</p>

        <div className="mb-4 flex gap-1 rounded-md bg-line/40 p-1">
          <button
            onClick={() => setTab("new")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "new" ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            Nuevo ticket
          </button>
          <button
            onClick={() => setTab("lookup")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "lookup" ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            Ver mi ticket
          </button>
        </div>

        {tab === "new" ? <NewTicketForm slug={slug} /> : <TicketLookupForm slug={slug} />}
      </div>
    </div>
  );
}
