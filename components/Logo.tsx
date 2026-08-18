import { LifeBuoy } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
        <LifeBuoy size={16} strokeWidth={2.25} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold tracking-tight text-ink">Deskly</p>
        <p className="text-[11px] uppercase tracking-widest text-ink-faint">Mesa de ayuda</p>
      </div>
    </div>
  );
}
