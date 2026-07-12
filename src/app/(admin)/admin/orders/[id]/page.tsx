import { OrderDetailView } from "@/views/admin/order-detail";

export const metadata = { title: "Order · Admin" };

export function generateStaticParams() {
  return [
    { id: "o1" },
    { id: "o2" },
    { id: "o3" },
    { id: "o4" },
    { id: "o5" },
    { id: "o6" },
    { id: "o7" },
    { id: "o8" },
  ];
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}