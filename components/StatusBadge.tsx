import type { TicketPriority, TicketStatus } from "@/lib/types";

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Abierto",
  in_progress: "En progreso",
  closed: "Cerrado",
};

const STATUS_CLASSES: Record<TicketStatus, string> = {
  open: "bg-sky-50 text-sky-700",
  in_progress: "bg-amber-50 text-amber-700",
  closed: "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
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
  low: "text-slate-400",
  normal: "text-slate-600",
  high: "text-red-600 font-medium",
};

export function PriorityLabel({ priority }: { priority: TicketPriority }) {
  return <span className={`text-xs ${PRIORITY_CLASSES[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
}
