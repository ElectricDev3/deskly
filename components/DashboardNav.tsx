"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inbox, LogOut, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tickets", icon: Inbox },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

export function DashboardNav({ businessName, slug }: { businessName: string; slug: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="border-b border-line bg-paper-raised px-6 py-4 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <div className="mb-6 leading-tight">
        <p className="font-display text-sm font-semibold text-ink">{businessName}</p>
        <p className="font-mono text-xs text-ink-faint">/{slug}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand text-white" : "text-ink-soft hover:bg-brand-light hover:text-brand-dark"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-faint hover:bg-brand-light hover:text-brand-dark"
      >
        <LogOut size={15} />
        Cerrar sesión
      </button>
    </aside>
  );
}
