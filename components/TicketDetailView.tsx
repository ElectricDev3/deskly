"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "./ui/Button";
import { MessageThread } from "./MessageThread";
import type { Ticket, TicketMessage, TicketPriority, TicketStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Abierto" },
  { value: "in_progress", label: "En progreso" },
  { value: "closed", label: "Cerrado" },
];

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
];

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/tickets/${ticketId}`);
    const data = await res.json();
    setTicket(data.ticket ?? null);
    setMessages(data.messages ?? []);
  }, [ticketId]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function updateField(patch: { status?: TicketStatus; priority?: TicketPriority }) {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });
      setReply("");
      load();
    } finally {
      setSending(false);
    }
  }

  if (!ticket) return <p className="text-sm text-slate-400">Cargando…</p>;

  return (
    <div>
      <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={14} /> Volver a tickets
      </Link>

      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{ticket.subject}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {ticket.requester_name} · {ticket.requester_email} · #{ticket.code}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            Estado
            <select
              value={ticket.status}
              onChange={(e) => updateField({ status: e.target.value as TicketStatus })}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            Prioridad
            <select
              value={ticket.priority}
              onChange={(e) => updateField({ priority: e.target.value as TicketPriority })}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <MessageThread messages={messages} />

        <form onSubmit={handleReply} className="mt-4 border-t border-slate-100 pt-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Escribe tu respuesta…"
            className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <Button type="submit" disabled={sending || !reply.trim()} className="mt-2">
            <Send size={14} /> {sending ? "Enviando…" : "Responder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
