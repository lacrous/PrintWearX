import { LoginPage } from "@/views/login";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Sign in to your account",
  description:
    "Sign in to PrintWearX to track orders, save favorites, and check out faster. New customer? Create an account and get 15% off your first order.",
  keywords: ["sign in", "login", "account", "PrintWearX"],
  alternates: { canonical: `${SITE_URL}/login` },
  openGraph: {
    title: "Sign in to PrintWearX",
    description: "Sign in to track orders, save favorites, and check out faster.",
    url: `${SITE_URL}/login`,
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function LoginRoute() {
  return <LoginPage />;
}