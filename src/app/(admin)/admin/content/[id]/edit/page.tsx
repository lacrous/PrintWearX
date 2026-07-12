import { ContentFormView } from "@/views/admin/content-form";

export const metadata = { title: "Edit content · Admin" };

export function generateStaticParams() {
  return [
    { id: "ct1" }, { id: "ct2" }, { id: "ct3" },
    { id: "ct4" }, { id: "ct5" }, { id: "ct6" },
  ];
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContentFormView contentId={id} />;
}