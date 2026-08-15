import Link from "next/link";
import { Inbox, MessageSquare, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 py-4">
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

      <main className="mx-auto max-w-3xl px-8 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Una mesa de ayuda simple para tu negocio
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Deskly te da una página pública donde tus clientes abren tickets de soporte, y un panel donde tú
          los atiendes — sin bandeja de correo desordenada.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup">
            <Button variant="primary" className="px-5 py-2.5 text-base">
              Empezar gratis
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-slate-200 bg-white p-5">
              <f.icon size={18} className="text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-900">{f.title}</p>
              <p className="mt-1 text-sm text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
