import { CustomerDetailView } from "@/views/admin/customer-detail";

export const metadata = { title: "Customer · Admin" };

export function generateStaticParams() {
  return [
    { id: "c1" },
    { id: "c2" },
    { id: "c3" },
    { id: "c4" },
    { id: "c5" },
    { id: "c6" },
    { id: "c7" },
    { id: "c8" },
    { id: "c9" },
    { id: "c10" },
  ];
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetailView customerId={id} />;
}