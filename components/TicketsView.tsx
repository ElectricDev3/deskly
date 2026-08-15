"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge, PriorityLabel } from "./StatusBadge";
import type { Ticket, TicketStatus } from "@/lib/types";

const FILTERS: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Abiertos" },
  { value: "in_progress", label: "En progreso" },
  { value: "closed", label: "Cerrados" },
];

export function TicketsView() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/tickets?status=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setTickets(data.tickets ?? []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [filter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Tickets</h1>
        <p className="text-sm text-slate-500">Las consultas de tus clientes, en un solo lugar.</p>
      </div>

      <div className="mb-4 flex gap-1 rounded-md bg-slate-100 p-1 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : tickets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No hay tickets aquí todavía.
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/tickets/${t.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{t.subject}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.requester_name} · #{t.code}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <PriorityLabel priority={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
