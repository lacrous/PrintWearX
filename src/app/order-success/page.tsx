import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrderSuccessPage } from "@/views/order-success";

export const metadata = {
  title: "Order confirmed — thank you!",
  description:
    "Your PrintWearX order has been placed. You will receive a confirmation email shortly with tracking information.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessRoute() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <OrderSuccessPage />
      </main>
      <Footer />
    </>
  );
}