"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

export function NewTicketForm({ slug }: { slug: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/${slug}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, requesterName, requesterEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar el ticket");
        return;
      }
      setCode(data.code);
    } finally {
      setSubmitting(false);
    }
  }

  if (code) {
    return (
      <div className="rounded-lg border border-line bg-paper-raised p-6 text-center">
        <CheckCircle2 size={28} className="mx-auto text-emerald-600" />
        <h2 className="mt-3 font-display text-lg font-semibold text-ink">Ticket enviado</h2>
        <p className="mt-2 text-sm text-ink-soft">Guarda este código para darle seguimiento:</p>

        <div
          className="ticket-stub mx-auto mt-4 max-w-[220px] rounded-md border border-dashed border-brand/40 bg-brand-light px-4 py-3"
          style={{ "--stub-notch-color": "var(--paper-raised)" } as React.CSSProperties}
        >
          <p className="text-[10px] font-medium uppercase tracking-widest text-brand-dark/70">Código de ticket</p>
          <p className="mt-1 font-mono text-xl font-semibold tracking-[0.2em] text-brand-dark">{code}</p>
        </div>

        <Link
          href={`/${slug}/ticket/${code}`}
          className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark underline underline-offset-2"
        >
          Ver mi ticket
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-paper-raised p-5">
      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-ink-soft">Asunto</span>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="¿En qué te podemos ayudar?"
          className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-ink-soft">Describe tu problema</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
      </label>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Tu nombre</span>
          <input
            required
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Tu correo</span>
          <input
            type="email"
            required
            value={requesterEmail}
            onChange={(e) => setRequesterEmail(e.target.value)}
            className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </label>
      </div>

      {error && <p className="mb-3 text-sm text-accent-dark">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Enviando…" : "Enviar ticket"}
      </Button>
    </form>
  );
}
