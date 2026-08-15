export interface Account {
  id: string;
  email: string;
  business_name: string;
  slug: string;
  created_at: string;
}

export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "normal" | "high";

export interface Ticket {
  id: string;
  account_id: string;
  code: string;
  subject: string;
  requester_name: string;
  requester_email: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export type MessageAuthor = "staff" | "customer";

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_type: MessageAuthor;
  body: string;
  created_at: string;
}
