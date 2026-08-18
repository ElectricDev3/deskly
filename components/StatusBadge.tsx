import type { TicketPriority, TicketStatus } from "@/lib/types";

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Abierto",
  in_progress: "En progreso",
  closed: "Cerrado",
};

const STATUS_CLASSES: Record<TicketStatus, string> = {
  open: "bg-brand-light text-brand-dark",
  in_progress: "bg-amber-50 text-amber-700",
  closed: "bg-line/60 text-ink-faint",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Baja",
  normal: "Normal",
  high: "Alta",
};

const PRIORITY_CLASSES: Record<TicketPriority, string> = {
  low: "text-ink-faint",
  normal: "text-ink-soft",
  high: "text-accent-dark font-medium",
};

export function PriorityLabel({ priority }: { priority: TicketPriority }) {
  return <span className={`text-xs ${PRIORITY_CLASSES[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
}
