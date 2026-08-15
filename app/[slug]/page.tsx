import { PublicSupportView } from "@/components/PublicSupportView";

export default async function PublicSlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  return <PublicSupportView slug={slug} />;
}
