import type { Metadata } from "next";
import { ForgotPasswordAdminView } from "@/views/admin/forgot-password-admin";

export const metadata: Metadata = {
  title: "Reset admin password",
  description:
    "Reset your PrintWearX admin password. We'll send a reset link to your registered email.",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordAdminView />;
}