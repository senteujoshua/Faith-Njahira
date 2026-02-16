"use client";

import { useState } from "react";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    priceKES: number;
    type: "BOOK" | "COACHING";
    calendlyUrl?: string;
  };
};

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<
    "idle" | "sent" | "checking" | "paid" | "failed"
  >("idle");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCardCheckout = async () => {
    if (!name || !email) {
      setError("Please fill in your name and email.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          productType: product.type,
          productName: product.name,
          amount: product.price,
          currency: "USD",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMpesaCheckout = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          productType: product.type,
          productName: product.name,
          amount: product.priceKES,
        }),
      });

      const data = await res.json();
      if (data.orderId) {
        setMpesaStatus("sent");
        // Poll for payment status
        pollMpesaStatus(data.orderId);
      } else {
        setError(data.error || "Failed to initiate M-Pesa payment.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pollMpesaStatus = async (orderId: string) => {
    setMpesaStatus("checking");
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/checkout/mpesa?orderId=${orderId}`);
        const data = await res.json();

        if (data.status === "PAID") {
          clearInterval(interval);
          setMpesaStatus("paid");
          setTimeout(() => {
            window.location.href = `/shop/success?order=${orderId}`;
          }, 1500);
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setMpesaStatus("failed");
        }
      } catch {
        // continue polling
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setMpesaStatus("failed");
        setError("Payment verification timed out. If you completed payment, please check your email.");
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <div>
            <h2 className="font-heading text-xl font-bold text-teal">
              Checkout
            </h2>
            <p className="font-body text-sm text-warm-gray mt-1">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-lightest transition-colors"
          >
            <svg className="w-5 h-5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* M-Pesa STK Status */}
        {mpesaStatus !== "idle" && paymentMethod === "mpesa" && (
          <div className="p-6">
            {mpesaStatus === "sent" || mpesaStatus === "checking" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold text-teal mb-2">
                  Check Your Phone
                </h3>
                <p className="font-body text-slate text-sm">
                  An M-Pesa prompt has been sent to <strong>{phone}</strong>.
                  Enter your PIN to complete the payment.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-warm-gray text-sm">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Waiting for confirmation...
                </div>
              </div>
            ) : mpesaStatus === "paid" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold text-teal mb-2">
                  Payment Confirmed!
                </h3>
                <p className="font-body text-slate text-sm">
                  Redirecting you now...
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold text-teal mb-2">
                  Payment Failed
                </h3>
                <p className="font-body text-slate text-sm mb-4">
                  The M-Pesa payment was not completed. Please try again.
                </p>
                <button
                  onClick={() => setMpesaStatus("idle")}
                  className="px-6 py-2 bg-gold text-white rounded-full font-body text-sm font-semibold hover:bg-gold-dark transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form (hidden during M-Pesa status) */}
        {(mpesaStatus === "idle" || paymentMethod === "card") && (
          <div className="p-6 space-y-5">
            {/* Payment Method Tabs */}
            <div className="flex rounded-xl bg-cream-lightest p-1">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-2.5 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  paymentMethod === "card"
                    ? "bg-white text-teal shadow-sm"
                    : "text-warm-gray hover:text-slate"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setPaymentMethod("mpesa")}
                className={`flex-1 py-2.5 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  paymentMethod === "mpesa"
                    ? "bg-white text-teal shadow-sm"
                    : "text-warm-gray hover:text-slate"
                }`}
              >
                M-Pesa
              </button>
            </div>

            {/* Price Display */}
            <div className="text-center py-3 bg-cream-lightest rounded-xl">
              <p className="font-body text-sm text-warm-gray">Total</p>
              <p className="font-heading text-2xl font-bold text-teal">
                {paymentMethod === "card"
                  ? `$${product.price.toFixed(2)}`
                  : `KES ${product.priceKES.toLocaleString()}`}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm font-medium text-teal mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Faith Njahira"
                  className="w-full px-4 py-3 bg-cream-lightest border border-cream rounded-xl font-body text-sm text-teal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-teal mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-cream-lightest border border-cream rounded-xl font-body text-sm text-teal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
              {paymentMethod === "mpesa" && (
                <div>
                  <label className="block font-body text-sm font-medium text-teal mb-1.5">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full px-4 py-3 bg-cream-lightest border border-cream rounded-xl font-body text-sm text-teal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                  <p className="font-body text-xs text-warm-gray mt-1.5">
                    Enter in format: 254XXXXXXXXX
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={
                paymentMethod === "card" ? handleCardCheckout : handleMpesaCheckout
              }
              disabled={loading}
              className="w-full py-3.5 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : paymentMethod === "card" ? (
                `Pay $${product.price.toFixed(2)} with Card`
              ) : (
                `Pay KES ${product.priceKES.toLocaleString()} with M-Pesa`
              )}
            </button>

            <p className="font-body text-xs text-center text-warm-gray">
              {paymentMethod === "card"
                ? "You will be redirected to Stripe for secure payment."
                : "An STK push will be sent to your phone. Enter your M-Pesa PIN to confirm."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
