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
    <aside className="border-b border-slate-200 bg-white px-6 py-4 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <div className="mb-6 leading-tight">
        <p className="text-sm font-semibold text-slate-900">{businessName}</p>
        <p className="text-xs text-slate-400">/{slug}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
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
        className="mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
      >
        <LogOut size={15} />
        Cerrar sesión
      </button>
    </aside>
  );
}
