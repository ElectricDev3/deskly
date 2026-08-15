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
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-slate-600">Código de ticket</span>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej. K7M3PQR"
          className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 font-mono text-sm uppercase tracking-widest text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-medium text-slate-600">Tu correo</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
      <Button type="submit" className="w-full">
        Ver ticket
      </Button>
    </form>
  );
}
