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
  const [replyError, setReplyError] = useState<string | null>(null);

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
    setReplyError(null);
    try {
      const res = await fetch(`/api/public/${slug}/tickets/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, text: reply }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setReplyError(data?.error ?? "No se pudo enviar tu mensaje. Intenta de nuevo.");
        return;
      }
      setReply("");
      await lookup(email);
    } catch {
      setReplyError("No se pudo enviar tu mensaje. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-paper px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="mb-1 text-center font-display text-xl font-semibold tracking-tight text-ink">
            Ticket <span className="font-mono">#{code}</span>
          </h1>
          <p className="mb-6 text-center text-sm text-ink-soft">
            Ingresa el correo con el que enviaste este ticket para verlo.
          </p>
          <form onSubmit={handleUnlock} className="rounded-lg border border-line bg-paper-raised p-5">
            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-medium text-ink-soft">Tu correo</span>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </label>
            {error && <p className="mb-3 text-sm text-accent-dark">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Buscando…" : "Ver ticket"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-4 rounded-lg border border-line bg-paper-raised p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-lg font-semibold text-ink">{ticket.subject}</h1>
              <p className="mt-0.5 font-mono text-xs text-ink-soft">#{ticket.code}</p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-raised p-5">
          <MessageThread messages={messages} />

          {ticket.status !== "closed" ? (
            <form onSubmit={handleReply} className="mt-4 border-t border-line pt-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Agrega más detalles…"
                className="w-full resize-none rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              {replyError && <p className="mt-2 text-sm text-accent-dark">{replyError}</p>}
              <Button type="submit" disabled={sending || !reply.trim()} className="mt-2">
                <Send size={14} /> {sending ? "Enviando…" : "Enviar"}
              </Button>
            </form>
          ) : (
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-faint">
              Este ticket está cerrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
