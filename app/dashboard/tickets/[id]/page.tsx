import { TicketDetailView } from "@/components/TicketDetailView";

export default async function TicketDetailPage({ params }: PageProps<"/dashboard/tickets/[id]">) {
  const { id } = await params;
  return <TicketDetailView ticketId={id} />;
}
