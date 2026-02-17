"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="bg-cream-lightest py-16">
        <div className="max-w-xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-cream text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h2 className="font-heading text-xl font-bold text-teal mb-3">
              Check Your Email
            </h2>
            <p className="font-body text-slate text-sm leading-relaxed mb-6">
              We&apos;ve sent a download link to your email address. The link is
              valid for 72 hours. If you don&apos;t see it, please check your
              spam folder.
            </p>

            {orderId && (
              <p className="font-body text-xs text-warm-gray mb-6">
                Order reference: {orderId}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="px-6 py-3 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
              >
                Back to Shop
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-cream-lightest text-teal font-body font-semibold rounded-full hover:bg-cream transition-all duration-300"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="font-heading text-4xl font-bold text-white">
              Loading...
            </h1>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
