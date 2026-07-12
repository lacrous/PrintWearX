import type { Metadata } from "next";
import { LoginAdminView } from "@/views/admin/login-admin";

export const metadata: Metadata = {
  title: "Admin sign-in",
  description:
    "Sign in to the PrintWearX admin dashboard. Restricted to authorized staff only.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <LoginAdminView />;
}