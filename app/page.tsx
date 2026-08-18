import Link from "next/link";
import { Inbox, MessageSquare, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/StatusBadge";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Tus clientes escriben, tú respondes",
    description: "Cada consulta se convierte en un ticket con hilo de mensajes, sin necesidad de que el cliente cree una cuenta.",
  },
  {
    icon: Inbox,
    title: "Bandeja con estado y prioridad",
    description: "Marca cada ticket como abierto, en progreso o cerrado, y ordénalo por prioridad.",
  },
  {
    icon: Search,
    title: "Seguimiento sin cuenta",
    description: "Tu cliente revisa el estado de su ticket con un código y su correo, desde cualquier dispositivo.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper-raised px-8 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary">Crear cuenta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Una mesa de ayuda simple para tu negocio
            </h1>
            <p className="mt-4 max-w-lg text-ink-soft">
              Deskly te da una página pública donde tus clientes abren tickets de soporte, y un panel donde
              tú los atiendes — sin bandeja de correo desordenada.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/signup">
                <Button variant="accent" className="px-5 py-2.5 text-base">
                  Empezar gratis
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-center lg:block">
            <div
              className="ticket-stub w-72 rotate-2 rounded-xl border border-line bg-paper-raised p-5 shadow-[0_20px_50px_-20px_rgba(14,37,33,0.25)]"
              style={{ "--stub-notch-color": "var(--paper)" } as React.CSSProperties}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-ink-faint">Ticket</p>
                <StatusBadge status="open" />
              </div>
              <p className="mt-2 font-display text-base font-semibold text-ink">La impresora no conecta</p>
              <p className="mt-1 font-mono text-xs text-ink-faint">Camila R. · #K7M3PQR</p>
              <div className="my-4 border-t border-dashed border-line" />
              <p className="text-xs text-ink-soft">
                &ldquo;Desde ayer no logro imprimir desde la oficina 2, ¿me ayudan?&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-line bg-paper-raised p-5 transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(14,37,33,0.25)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand-dark">
                <f.icon size={18} />
              </div>
              <p className="mt-3 text-sm font-medium text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
