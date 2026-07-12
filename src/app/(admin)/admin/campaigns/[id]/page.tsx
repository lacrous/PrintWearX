import { CampaignDetailView } from "@/views/admin/campaign-detail";

export const metadata = { title: "Campaign · Admin" };

export function generateStaticParams() {
  return [
    { id: "c1" },
    { id: "c2" },
    { id: "c3" },
    { id: "c4" },
  ];
}

export default async function AdminCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignDetailView campaignId={id} />;
}