"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/Button";
import { MessageThread } from "./MessageThread";
import { StatusBadge } from "./StatusBadge";
import type { Ticket, TicketMessage } from "@/lib/types";

interface TicketPublicViewProps {
  slug: string;
  code: string;
  initialEmail: string;
}

export function TicketPublicView({ slug, code, initialEmail }: TicketPublicViewProps) {
  const [email, setEmail] = useState(initialEmail);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function lookup(targetEmail: string) {
    if (!targetEmail) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/${slug}/tickets/${code}?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo cargar el ticket");
        setTicket(null);
        return;
      }
      setTicket(data.ticket);
      setMessages(data.messages);
      setEmail(targetEmail);
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialEmail) lookup(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    lookup(emailInput.trim());
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/public/${slug}/tickets/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, text: reply }),
      });
      setReply("");
      lookup(email);
    } finally {
      setSending(false);
    }
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="mb-1 text-center text-xl font-semibold tracking-tight text-slate-900">
            Ticket #{code}
          </h1>
          <p className="mb-6 text-center text-sm text-slate-500">
            Ingresa el correo con el que enviaste este ticket para verlo.
          </p>
          <form onSubmit={handleUnlock} className="rounded-lg border border-slate-200 bg-white p-5">
            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Tu correo</span>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Buscando…" : "Ver ticket"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{ticket.subject}</h1>
              <p className="mt-0.5 text-xs text-slate-500">#{ticket.code}</p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <MessageThread messages={messages} />

          {ticket.status !== "closed" ? (
            <form onSubmit={handleReply} className="mt-4 border-t border-slate-100 pt-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Agrega más detalles…"
                className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <Button type="submit" disabled={sending || !reply.trim()} className="mt-2">
                <Send size={14} /> {sending ? "Enviando…" : "Enviar"}
              </Button>
            </form>
          ) : (
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-400">
              Este ticket está cerrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
