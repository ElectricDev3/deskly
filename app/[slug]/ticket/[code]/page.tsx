import { TicketPublicView } from "@/components/TicketPublicView";

export default async function TicketPublicPage({
  params,
  searchParams,
}: PageProps<"/[slug]/ticket/[code]">) {
  const { slug, code } = await params;
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email : "";
  return <TicketPublicView slug={slug} code={code} initialEmail={email} />;
}
