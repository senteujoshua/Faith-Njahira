"use client";

import { useState } from "react";
import EventCheckoutModal from "@/components/EventCheckoutModal";
import EventSeatCounter from "@/components/EventSeatCounter";

interface Session {
  id: string;
  sessionNumber: number;
  title: string | null;
  startTime: string | Date;
  endTime: string | Date | null;
  timezone: string;
}

interface Tier {
  id: string;
  name: string;
  description: string | null;
  priceUSD: number;
  priceGBP: number;
  priceKES: number;
  originalPriceUSD: number | null;
  originalPriceGBP: number | null;
  originalPriceKES: number | null;
  quantityAvailable: number;
  soldCount: number;
  isSaleClosed: boolean;
  isDefault: boolean;
  maxPerPurchase: number;
  seatsRemaining: number | null;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  coverImage: string | null;
  eventType: string;
  extraDetails: string | null;
  hasMeetingLink: boolean;
  tiers: Tier[];
  sessions: Session[];
}

export default function EventDetailClient({ event }: { event: EventData }) {
  const [showModal, setShowModal] = useState(false);

  const allSoldOut =
    event.tiers.length > 0 &&
    event.tiers.every(
      (t) => t.isSaleClosed || (t.quantityAvailable > 0 && (t.seatsRemaining ?? 1) <= 0)
    );

  const lowestPrice =
    event.tiers.length > 0 ? Math.min(...event.tiers.map((t) => t.priceUSD)) : null;

  const eventTypeLabel = event.eventType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-cream-lightest">
      {/* ── Cinematic Hero ── */}
      <div className="relative h-[52vh] min-h-[380px] max-h-[540px] overflow-hidden">
        {event.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImage}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal via-slate to-teal-dark" />
        )}

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gold text-white text-xs font-body font-bold uppercase tracking-[0.15em] rounded-full mb-4 shadow-lg">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
              {eventTypeLabel}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-xl leading-tight max-w-3xl">
              {event.title}
            </h1>
            {event.shortDesc && (
              <p className="font-body text-white/80 text-lg max-w-2xl leading-relaxed">
                {event.shortDesc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {event.description && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-cream/80">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-7 bg-gold rounded-full block" />
                  <h2 className="font-heading text-xl font-bold text-teal">About this session</h2>
                </div>
                <div className="font-body text-slate leading-loose whitespace-pre-wrap text-[15px]">
                  {event.description}
                </div>
              </section>
            )}

            {/* Session schedule */}
            {event.sessions.length > 0 && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-cream/80">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-7 bg-gold rounded-full block" />
                  <h2 className="font-heading text-xl font-bold text-teal">Schedule</h2>
                </div>
                <div className="space-y-0">
                  {event.sessions.map((sess, index) => (
                    <div key={sess.id} className="flex gap-5">
                      {/* Timeline column */}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal to-teal-light flex items-center justify-center flex-shrink-0 shadow-md ring-4 ring-cream">
                          <span className="font-heading text-sm font-bold text-white">
                            {sess.sessionNumber}
                          </span>
                        </div>
                        {index < event.sessions.length - 1 && (
                          <div className="w-px flex-1 bg-cream-dark my-2" />
                        )}
                      </div>

                      {/* Session info */}
                      <div className={`pb-7 flex-1 ${index === event.sessions.length - 1 ? "pb-0" : ""}`}>
                        {sess.title && (
                          <p className="font-heading text-base font-bold text-slate mb-2">
                            {sess.title}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4">
                          <span className="inline-flex items-center gap-1.5 font-body text-sm text-warm-gray">
                            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                            </svg>
                            {new Date(sess.startTime).toLocaleDateString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-body text-sm text-warm-gray">
                            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(sess.startTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            UTC
                            {sess.endTime && (
                              <>
                                {" – "}
                                {new Date(sess.endTime).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                UTC
                              </>
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-body text-xs text-warm-gray/60 bg-cream px-2.5 py-1 rounded-full">
                            {sess.timezone}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Extra details */}
            {event.extraDetails && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-cream/80">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-7 bg-gold rounded-full block" />
                  <h2 className="font-heading text-xl font-bold text-teal">Additional Information</h2>
                </div>
                <div className="font-body text-slate leading-loose whitespace-pre-wrap text-[15px]">
                  {event.extraDetails}
                </div>
              </section>
            )}
          </div>

          {/* ── Sticky Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">

              {/* Ticket card */}
              <div className="bg-white rounded-2xl shadow-xl border border-cream/60 overflow-hidden">
                {/* Gold gradient accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-gold via-yellow-400 to-gold-dark" />

                <div className="p-6">
                  {/* Starting price */}
                  {lowestPrice !== null && (
                    <div className="mb-5 pb-5 border-b border-cream">
                      <p className="font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-1">
                        Starting from
                      </p>
                      <p className="font-heading text-4xl font-bold text-teal leading-none">
                        {lowestPrice === 0 ? "Free" : `$${lowestPrice}`}
                      </p>
                    </div>
                  )}

                  {/* Tier options */}
                  <p className="font-body text-[10px] font-bold text-warm-gray uppercase tracking-[0.15em] mb-3">
                    Ticket Options
                  </p>

                  {event.tiers.length === 0 ? (
                    <p className="font-body text-sm text-warm-gray mb-5 italic">
                      Tickets coming soon.
                    </p>
                  ) : (
                    <div className="space-y-2.5 mb-6">
                      {event.tiers.map((tier) => {
                        const isTierClosed =
                          tier.isSaleClosed ||
                          (tier.quantityAvailable > 0 && (tier.seatsRemaining ?? 1) <= 0);
                        return (
                          <div
                            key={tier.id}
                            className={`rounded-xl border p-4 transition-all ${
                              isTierClosed
                                ? "border-gray-100 bg-gray-50/50 opacity-60"
                                : "border-cream bg-cream-lightest hover:border-gold/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <span className="font-body text-sm font-semibold text-slate leading-snug">
                                {tier.name}
                              </span>
                              <div className="text-right flex-shrink-0">
                                {tier.originalPriceUSD && tier.originalPriceUSD > tier.priceUSD && (
                                  <p className="font-body text-xs text-warm-gray line-through">
                                    ${tier.originalPriceUSD}
                                  </p>
                                )}
                                <p className="font-heading text-lg font-bold text-teal leading-tight">
                                  {tier.priceUSD === 0 ? "Free" : `$${tier.priceUSD}`}
                                </p>
                              </div>
                            </div>
                            {tier.description && (
                              <p className="font-body text-xs text-warm-gray mb-2 leading-relaxed">
                                {tier.description}
                              </p>
                            )}
                            <EventSeatCounter
                              tierId={tier.id}
                              initialSeatsRemaining={tier.seatsRemaining}
                              initialSaleClosed={tier.isSaleClosed}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={allSoldOut || event.tiers.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-gold to-gold-dark text-white font-body font-bold rounded-xl hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-gold/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-base tracking-wide"
                  >
                    {allSoldOut ? "Sold Out" : "Register Now →"}
                  </button>

                  {/* Zoom notice */}
                  {event.hasMeetingLink && (
                    <div className="mt-4 flex items-start gap-3 p-4 bg-teal/5 rounded-xl border border-teal/15">
                      <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-teal"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-body text-xs font-bold text-teal mb-0.5">Online via Zoom</p>
                        <p className="font-body text-xs text-teal/70 leading-relaxed">
                          Meeting link sent to your email after payment is confirmed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trust signals */}
                  <div className="mt-5 pt-5 border-t border-cream grid grid-cols-3 gap-3 text-center">
                    {[
                      {
                        icon: (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                          />
                        ),
                        label: "Secure",
                      },
                      {
                        icon: (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        ),
                        label: "Instant Email",
                      },
                      {
                        icon: (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                          />
                        ),
                        label: "Card & M-Pesa",
                      },
                    ].map(({ icon, label }) => (
                      <div key={label}>
                        <svg
                          className="w-5 h-5 text-gold mx-auto mb-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          {icon}
                        </svg>
                        <p className="font-body text-[10px] text-warm-gray leading-tight">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EventCheckoutModal
          eventTitle={event.title}
          tiers={event.tiers}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
