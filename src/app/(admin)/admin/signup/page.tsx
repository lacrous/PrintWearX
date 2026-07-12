import type { Metadata } from "next";
import { SignupAdminView } from "@/views/admin/signup-admin";

export const metadata: Metadata = {
  title: "Create admin account",
  description:
    "Create a PrintWearX admin account. Requires an invite code from an existing admin.",
  robots: { index: false, follow: false },
};

export default function AdminSignupPage() {
  return <SignupAdminView />;
}