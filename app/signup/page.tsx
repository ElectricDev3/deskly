"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo crear la cuenta");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-paper-raised p-6">
          <h1 className="mb-4 font-display text-lg font-semibold text-ink">Crea tu cuenta</h1>

          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">Nombre de tu negocio</span>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej. Taller Andrade"
              className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">Contraseña</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </label>

          {error && <p className="mb-3 text-sm text-accent-dark">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando…" : "Crear cuenta"}
          </Button>

          <p className="mt-4 text-center text-sm text-ink-soft">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-brand hover:text-brand-dark underline underline-offset-2">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
