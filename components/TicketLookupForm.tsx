"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";

export function TicketLookupForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/${slug}/ticket/${code.trim().toUpperCase()}?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-paper-raised p-5">
      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-ink-soft">Código de ticket</span>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej. K7M3PQR"
          className="w-full rounded-md border border-line px-2.5 py-1.5 font-mono text-sm uppercase tracking-widest text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-medium text-ink-soft">Tu correo</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
      </label>
      <Button type="submit" className="w-full">
        Ver ticket
      </Button>
    </form>
  );
}
