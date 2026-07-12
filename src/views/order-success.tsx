"use client";
import { motion } from "framer-motion";
import { Link } from "@/lib/nav";
import {
  Check,
  Mail,
  Phone,
  Twitter,
  Facebook,
  Printer,
  Package,
  Truck,
  Home as HomeIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { generateOrderNumber } from "@/lib/utils";

export function OrderSuccessPage() {
  const [orderNumber] = useState(() => generateOrderNumber());
  const [today] = useState(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => window.print();

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success text-white shadow-xl shadow-success/30 mb-6"
            >
              <Check className="w-12 h-12" strokeWidth={3} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-3"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-neutral-600 dark:text-neutral-400 mb-1"
            >
              Thank you for your purchase
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-neutral-500 dark:text-neutral-400"
            >
              We've sent a confirmation email with all the details.
            </motion.p>
          </div>

          {/* Order info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Order Information
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500 dark:text-neutral-400">
                      Order number
                    </dt>
                    <dd className="font-semibold text-neutral-900 dark:text-white">
                      #{orderNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500 dark:text-neutral-400">
                      Order date
                    </dt>
                    <dd className="font-semibold text-neutral-900 dark:text-white">
                      {today}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500 dark:text-neutral-400">
                      Total
                    </dt>
                    <dd className="font-semibold text-neutral-900 dark:text-white">
                      $853.16
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Shipping To
                </h3>
                <address className="not-italic text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    John Doe
                  </p>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </address>
              </div>
            </div>

            {/* Next steps */}
            <div className="pt-6">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-5">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    Icon: Package,
                    label: "Order Processing",
                    sub: "1-2 business days",
                  },
                  {
                    Icon: Truck,
                    label: "Shipping",
                    sub: "Tracking via email",
                  },
                  {
                    Icon: HomeIcon,
                    label: "Delivery",
                    sub: "5-7 business days",
                  },
                ].map(({ Icon, label, sub }, i) => (
                  <div key={label} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-400 mb-3">
                      <Icon className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Link href="/shop" className="flex-1">
              <button className="w-full inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-md shadow-primary-500/30">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={handlePrint}
              className="flex-1 inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl border-2 border-primary-500 text-primary-500 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 mb-8"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Need help?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Our support team is here for you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@printwearx.com"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                <Mail className="w-4 h-4" />
                support@printwearx.com
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </a>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Love your purchase? Share the news.
            </p>
            <div className="flex justify-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <Twitter className="w-4 h-4" fill="currentColor" />
                Twitter
              </button>
              <button className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-blue-800 text-white text-sm font-medium hover:bg-blue-900 transition-colors">
                <Facebook className="w-4 h-4" fill="currentColor" />
                Facebook
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
