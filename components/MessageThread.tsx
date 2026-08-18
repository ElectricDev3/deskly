import type { TicketMessage } from "@/lib/types";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function MessageThread({ messages }: { messages: TicketMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[85%] rounded-lg p-3 text-sm ${
            m.author_type === "staff" ? "ml-auto bg-brand text-white" : "bg-line/50 text-ink"
          }`}
        >
          <p className="whitespace-pre-wrap">{m.body}</p>
          <p className={`mt-1.5 text-xs ${m.author_type === "staff" ? "text-white/70" : "text-ink-faint"}`}>
            {m.author_type === "staff" ? "Tú" : "Cliente"} · {formatDate(m.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
}
