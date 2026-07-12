import { DiscountFormView } from "@/views/admin/discount-form";

export const metadata = { title: "Edit discount · Admin" };

export function generateStaticParams() {
  return [
    { id: "d1" },
    { id: "d2" },
    { id: "d3" },
    { id: "d4" },
  ];
}

export default async function EditDiscountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DiscountFormView discountId={id} />;
}