"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Tier {
  id: string;
  name: string;
  description: string | null;
  priceUSD: number;
  priceGBP: number;
  priceKES: number;
  originalPriceUSD?: number | null;
  originalPriceGBP?: number | null;
  originalPriceKES?: number | null;
  quantityAvailable: number;
  soldCount: number;
  isSaleClosed: boolean;
  maxPerPurchase: number;
  seatsRemaining?: number | null;
}

interface Props {
  eventTitle: string;
  tiers: Tier[];
  onClose: () => void;
}

type Currency = "USD" | "GBP" | "KES";
type PaymentMethod = "STRIPE" | "PAYPAL" | "MPESA";

const currencySymbol: Record<Currency, string> = { USD: "$", GBP: "£", KES: "KES " };

function getPrice(tier: Tier, currency: Currency): number {
  if (currency === "GBP") return tier.priceGBP;
  if (currency === "KES") return tier.priceKES;
  return tier.priceUSD;
}

function getOriginalPrice(tier: Tier, currency: Currency): number | null | undefined {
  if (currency === "GBP") return tier.originalPriceGBP;
  if (currency === "KES") return tier.originalPriceKES;
  return tier.originalPriceUSD;
}

export default function EventCheckoutModal({ eventTitle, tiers, onClose }: Props) {
  const defaultTier = tiers.find((t) => t.isDefault) || tiers[0];
  const [selectedTierId, setSelectedTierId] = useState(defaultTier?.id || "");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
  const [seatCount, setSeatCount] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mpesaStep, setMpesaStep] = useState<"idle" | "polling" | "done">("idle");
  const [mpesaOrderId, setMpesaOrderId] = useState("");
  // Embedded Stripe checkout state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);

  const selectedTier = tiers.find((t) => t.id === selectedTierId);
  const isSoldOut =
    !selectedTier ||
    selectedTier.isSaleClosed ||
    (selectedTier.quantityAvailable > 0 &&
      selectedTier.seatsRemaining !== undefined &&
      selectedTier.seatsRemaining !== null &&
      selectedTier.seatsRemaining < seatCount);

  const price = selectedTier ? getPrice(selectedTier, currency) * seatCount : 0;
  const originalPrice = selectedTier ? getOriginalPrice(selectedTier, currency) : null;
  const isFree = price === 0;

  const handleCheckout = async () => {
    if (!selectedTier || !form.name || !form.email) {
      setError("Please fill in your name and email.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const orderRes = await fetch("/api/checkout/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: selectedTierId,
          seatCount,
          email: form.email,
          name: form.name,
          phone: form.phone || undefined,
          currency,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error || "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      const orderId: string = orderData.orderId;

      if (paymentMethod === "STRIPE") {
        const stripeRes = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            embedded: true,
            metadata: { seatCount: String(seatCount) },
          }),
        });
        const stripeData = await stripeRes.json();
        if (stripeData.clientSecret) {
          setStripeClientSecret(stripeData.clientSecret);
          setLoading(false);
        } else {
          setError(stripeData.error || "Failed to create Stripe session.");
          setLoading(false);
        }
      } else if (paymentMethod === "PAYPAL") {
        const ppRes = await fetch("/api/checkout/paypal/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const ppData = await ppRes.json();
        if (ppData.approvalUrl) {
          window.location.href = ppData.approvalUrl;
        } else {
          setError("Failed to create PayPal order.");
          setLoading(false);
        }
      } else if (paymentMethod === "MPESA") {
        const mpesaRes = await fetch("/api/checkout/mpesa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            phone: form.phone,
            amount: orderData.amount,
          }),
        });
        if (!mpesaRes.ok) {
          setError("M-Pesa STK push failed.");
          setLoading(false);
          return;
        }
        setMpesaOrderId(orderId);
        setMpesaStep("polling");
        setLoading(false);
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const statusRes = await fetch(`/api/checkout/mpesa/status?orderId=${orderId}`);
          const statusData = await statusRes.json();
          if (statusData.status === "PAID") {
            clearInterval(poll);
            setMpesaStep("done");
            window.location.href = `/events/success?ref=${orderId}`;
          } else if (statusData.status === "FAILED" || attempts >= 30) {
            clearInterval(poll);
            setError("M-Pesa payment failed or timed out.");
            setMpesaStep("idle");
          }
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  void mpesaOrderId;

  // ── Stripe Embedded Checkout view ────────────────────────────────────────
  if (stripeClientSecret) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-2xl">

          {/* Header */}
          <div className="relative bg-gradient-to-br from-teal to-slate px-6 pt-6 pb-5 flex-shrink-0">
            <div className="h-0.5 bg-gradient-to-r from-gold via-yellow-400 to-gold-dark absolute top-0 left-0 right-0" />
            {/* Back button */}
            <button
              onClick={() => setStripeClientSecret(null)}
              className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-body font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="font-body text-white/60 text-xs uppercase tracking-widest mb-1 pl-16">Complete Payment</p>
            <h2 className="font-heading text-xl font-bold text-white pl-16 pr-10 leading-snug">
              {eventTitle}
            </h2>
          </div>

          {/* Stripe embedded checkout */}
          <div className="overflow-y-auto flex-1">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: stripeClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form view ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-2xl">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-teal to-slate px-6 pt-6 pb-5 flex-shrink-0">
          <div className="h-0.5 bg-gradient-to-r from-gold via-yellow-400 to-gold-dark absolute top-0 left-0 right-0" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="font-body text-white/60 text-xs uppercase tracking-widest mb-1">Register for</p>
          <h2 className="font-heading text-xl font-bold text-white pr-10 leading-snug">
            {eventTitle}
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* ── Tier selector ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-3">
              Choose Your Ticket
            </p>
            <div className="space-y-2">
              {tiers.map((tier) => {
                const tierPrice = getPrice(tier, currency);
                const tierOriginal = getOriginalPrice(tier, currency);
                const tierSoldOut =
                  tier.isSaleClosed ||
                  (tier.quantityAvailable > 0 &&
                    (tier.seatsRemaining ?? tier.quantityAvailable - tier.soldCount) <= 0);
                const isSelected = selectedTierId === tier.id;

                return (
                  <label
                    key={tier.id}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                      tierSoldOut
                        ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                        : isSelected
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-cream bg-cream-lightest hover:border-gold/40"
                    }`}
                  >
                    {/* Custom radio */}
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? "border-gold bg-gold" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="tier"
                      value={tier.id}
                      checked={isSelected}
                      onChange={() => !tierSoldOut && setSelectedTierId(tier.id)}
                      disabled={tierSoldOut}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-body text-sm font-semibold ${isSelected ? "text-slate" : "text-slate"}`}>
                          {tier.name}
                        </span>
                        <div className="text-right flex-shrink-0">
                          {tierOriginal && tierOriginal > tierPrice && (
                            <p className="font-body text-xs text-warm-gray line-through leading-none mb-0.5">
                              {currencySymbol[currency]}{tierOriginal.toFixed(currency === "KES" ? 0 : 2)}
                            </p>
                          )}
                          <p className={`font-heading text-base font-bold leading-none ${isSelected ? "text-gold" : "text-teal"}`}>
                            {tierPrice === 0
                              ? "Free"
                              : `${currencySymbol[currency]}${tierPrice.toFixed(currency === "KES" ? 0 : 2)}`}
                          </p>
                        </div>
                      </div>
                      {tier.description && (
                        <p className="font-body text-xs text-warm-gray mt-1 leading-relaxed">
                          {tier.description}
                        </p>
                      )}
                      {tierSoldOut && (
                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-body font-medium bg-red-100 text-red-600">
                          Sold out
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Currency + Seats ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value as Currency);
                  if (e.target.value === "KES") setPaymentMethod("MPESA");
                  else if (paymentMethod === "MPESA") setPaymentMethod("STRIPE");
                }}
                className="w-full px-3 py-2.5 border-2 border-cream rounded-xl font-body text-sm bg-cream-lightest focus:outline-none focus:border-gold/60 transition-colors"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="KES">KES (M-Pesa)</option>
              </select>
            </div>
            <div>
              <label className="block font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-2">
                Seats
              </label>
              <input
                type="number"
                min="1"
                max={selectedTier?.maxPerPurchase || 5}
                value={seatCount}
                onChange={(e) =>
                  setSeatCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-2.5 border-2 border-cream rounded-xl font-body text-sm bg-cream-lightest focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>
          </div>

          {/* ── Contact info ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-3">
              Your Details
            </p>
            <div className="space-y-3">
              <div>
                <label className="block font-body text-xs font-medium text-slate mb-1.5">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border-2 border-cream rounded-xl font-body text-sm bg-cream-lightest focus:outline-none focus:border-gold/60 transition-colors placeholder:text-warm-gray/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-slate mb-1.5">
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border-2 border-cream rounded-xl font-body text-sm bg-cream-lightest focus:outline-none focus:border-gold/60 transition-colors placeholder:text-warm-gray/50"
                />
              </div>
              {(paymentMethod === "MPESA" || currency === "KES") && (
                <div>
                  <label className="block font-body text-xs font-medium text-slate mb-1.5">
                    M-Pesa Phone <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-2.5 border-2 border-cream rounded-xl font-body text-sm bg-cream-lightest focus:outline-none focus:border-gold/60 transition-colors placeholder:text-warm-gray/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Payment method ── */}
          {currency !== "KES" && (
            <div>
              <p className="font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-3">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["STRIPE", "PAYPAL"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-body font-semibold border-2 transition-all duration-150 ${
                      paymentMethod === method
                        ? "border-teal bg-teal text-white shadow-sm"
                        : "border-cream bg-cream-lightest text-slate hover:border-teal/30"
                    }`}
                  >
                    {method === "STRIPE" ? "💳 Card" : "🅿 PayPal"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Price summary ── */}
          {selectedTier && (
            <div className="rounded-xl bg-gradient-to-br from-cream-lightest to-cream p-4 border border-cream">
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm text-warm-gray">
                  {selectedTier.name}{" "}
                  {seatCount > 1 && <span className="text-xs">× {seatCount}</span>}
                </span>
                {originalPrice && originalPrice > price / seatCount && (
                  <span className="font-body text-xs text-warm-gray line-through">
                    {currencySymbol[currency]}
                    {(originalPrice * seatCount).toFixed(currency === "KES" ? 0 : 2)}
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-body text-xs text-warm-gray">Total due</span>
                <span className="font-heading text-2xl font-bold text-teal">
                  {isFree
                    ? "Free"
                    : `${currencySymbol[currency]}${price.toFixed(currency === "KES" ? 0 : 2)}`}
                </span>
              </div>
            </div>
          )}

          {/* ── Errors & M-Pesa status ── */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          {mpesaStep === "polling" && (
            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="font-body text-sm text-blue-700">
                STK push sent — please enter your M-Pesa PIN on your phone to complete payment.
              </p>
            </div>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="flex-shrink-0 p-6 pt-0">
          <button
            onClick={handleCheckout}
            disabled={loading || isSoldOut || mpesaStep === "polling"}
            className="w-full py-4 bg-gradient-to-r from-gold to-gold-dark text-white font-body font-bold rounded-xl hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-gold/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-base tracking-wide"
          >
            {loading
              ? "Processing..."
              : isSoldOut
              ? "Sold Out"
              : isFree
              ? "Register for Free →"
              : `Pay ${currencySymbol[currency]}${price.toFixed(currency === "KES" ? 0 : 2)} →`}
          </button>
          <p className="text-center font-body text-[10px] text-warm-gray mt-3">
            Payments secured by Stripe & IntaSend
          </p>
        </div>
      </div>
    </div>
  );
}
