import { SignupPage } from "@/views/signup";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Create your account — 15% off your first order",
  description:
    "Join PrintWearX and get 15% off your first order. Track orders, save favorites, get early access to new drops, and unlock member-only deals. Free shipping over $50.",
  keywords: [
    "sign up",
    "create account",
    "register",
    "15% off first order",
    "PrintWearX",
    "newsletter",
  ],
  alternates: { canonical: `${SITE_URL}/signup` },
  openGraph: {
    title: "Create your PrintWearX account",
    description:
      "Join PrintWearX and get 15% off your first order. Free shipping over $50.",
    url: `${SITE_URL}/signup`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function SignupRoute() {
  return <SignupPage />;
}