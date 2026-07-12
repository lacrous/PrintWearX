import { AdminShell } from "@/components/admin/admin-shell";
import { AdminGate } from "@/components/admin/admin-gate";
import { ToastHost } from "@/components/admin/toast";

export const metadata = {
  title: {
    default: "Admin · PrintWearX",
    template: "%s · PrintWearX",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
      <ToastHost />
    </AdminGate>
  );
}