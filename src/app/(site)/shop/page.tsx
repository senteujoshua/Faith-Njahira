"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal";

type Book = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceKES: number;
  coverImage: string;
  publisher: string;
  year: string;
  format: string;
};

type EventCard = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  coverImage: string | null;
  eventType: string;
  tiers: {
    priceUSD: number;
    originalPriceUSD: number | null;
    quantityAvailable: number;
    soldCount: number;
    isSaleClosed: boolean;
  }[];
  sessions: { startTime: string }[];
};

type Tab = "books" | "coaching";

export default function ShopPage() {
  const [tab, setTab] = useState<Tab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookCheckoutOpen, setBookCheckoutOpen] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data: any[]) => {
        setBooks(
          data.map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description ?? "",
            price: b.priceUSD ?? 0,
            priceKES: b.priceKES ?? 0,
            coverImage: b.coverImage ?? "",
            publisher: b.publisher ?? "",
            year: b.createdAt ? new Date(b.createdAt).getFullYear().toString() : "",
            format: "Digital PDF",
          }))
        );
      })
      .catch(() => {})
      .finally(() => setBooksLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: EventCard[]) => setEvents(data))
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal via-teal to-slate pt-32 pb-10">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold/5 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 font-body text-xs font-bold text-gold uppercase tracking-[0.25em] mb-5">
              <span className="w-8 h-px bg-gold/60" />
              Shop
              <span className="w-8 h-px bg-gold/60" />
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Books &amp; Coaching
            </h1>
            <p className="font-body text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Publications and sessions rooted in disability justice,
              intersectionality, and inclusive futures.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center pb-10">
            <div className="inline-flex rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-1.5 gap-1">
              <button
                onClick={() => setTab("books")}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                  tab === "books"
                    ? "bg-gold text-white shadow-lg shadow-gold/30"
                    : "text-cream/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Books
              </button>
              <button
                onClick={() => setTab("coaching")}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                  tab === "coaching"
                    ? "bg-gold text-white shadow-lg shadow-gold/30"
                    : "text-cream/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Coaching Sessions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Books Tab ── */}
      {tab === "books" && (
        <>
          <section className="bg-cream-lightest py-16 lg:py-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">

              {booksLoading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-6 bg-white rounded-2xl p-6 border border-cream animate-pulse">
                      <div className="w-36 flex-shrink-0 aspect-[2/3] bg-cream rounded-xl" />
                      <div className="flex-1 space-y-4 py-2">
                        <div className="h-3 bg-cream rounded w-1/4" />
                        <div className="h-7 bg-cream rounded w-3/4" />
                        <div className="h-4 bg-cream rounded w-full" />
                        <div className="h-4 bg-cream rounded w-5/6" />
                        <div className="h-4 bg-cream rounded w-4/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream flex items-center justify-center">
                    <svg className="w-8 h-8 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <p className="font-body text-warm-gray">No books available yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {books.map((book, idx) => {
                    const isExpanded = expandedDesc === book.id;
                    const longDesc = book.description.length > 220;
                    return (
                      <article
                        key={book.id}
                        className="group relative bg-white rounded-2xl border border-cream hover:border-gold/30 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col sm:flex-row"
                      >
                        {/* Gold accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold/0 via-gold to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Cover */}
                        <div className="sm:w-48 lg:w-56 flex-shrink-0">
                          <div className="h-64 sm:h-full relative bg-gradient-to-br from-teal/10 via-cream to-cream-lightest">
                            {book.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                                <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-teal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                  </svg>
                                </div>
                                {idx === 0 && (
                                  <span className="font-body text-xs text-teal/40 text-center leading-snug">
                                    {book.title}
                                  </span>
                                )}
                              </div>
                            )}
                            {/* New / featured badge for first book */}
                            {idx === 0 && (
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 bg-gold text-white text-[10px] font-body font-bold uppercase tracking-widest rounded-full shadow-md">
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-7 lg:p-8 flex flex-col">
                          {/* Meta row */}
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-lightest text-gold text-[10px] font-body font-bold uppercase tracking-[0.15em] rounded-full border border-cream">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              {book.format}
                            </span>
                            {book.year && (
                              <span className="font-body text-xs text-warm-gray">{book.year}</span>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="font-heading text-xl lg:text-2xl font-bold text-teal mb-2 leading-snug group-hover:text-teal transition-colors">
                            {book.title}
                          </h2>

                          {/* Author */}
                          {book.publisher && (
                            <p className="font-body text-sm text-gold font-medium mb-3">
                              by {book.publisher}
                            </p>
                          )}

                          {/* Description */}
                          {book.description && (
                            <div className="mb-auto">
                              <p className={`font-body text-sm text-slate leading-relaxed ${!isExpanded && longDesc ? "line-clamp-3" : ""}`}>
                                {book.description}
                              </p>
                              {longDesc && (
                                <button
                                  onClick={() => setExpandedDesc(isExpanded ? null : book.id)}
                                  className="mt-1.5 font-body text-xs text-gold hover:text-gold-dark font-medium transition-colors"
                                >
                                  {isExpanded ? "Show less ↑" : "Read more ↓"}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Price + CTA */}
                          <div className="flex items-end justify-between gap-4 mt-6 pt-5 border-t border-cream">
                            <div>
                              {book.price === 0 ? (
                                <p className="font-heading text-2xl font-bold text-teal">Free</p>
                              ) : (
                                <>
                                  <p className="font-heading text-2xl lg:text-3xl font-bold text-teal leading-none">
                                    ${book.price.toFixed(2)}
                                  </p>
                                  {book.priceKES > 0 && (
                                    <p className="font-body text-xs text-warm-gray mt-1">
                                      KES {book.priceKES.toLocaleString()}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedBook(book);
                                setBookCheckoutOpen(true);
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-body font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-gold/25 whitespace-nowrap"
                            >
                              {book.price === 0 ? "Download Free" : "Get Your Copy"}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Trust strip */}
          <section className="bg-teal py-12">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    ),
                    title: "Instant Download",
                    desc: "Your PDF arrives immediately via email.",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    ),
                    title: "Card & M-Pesa",
                    desc: "Pay globally with card or locally via M-Pesa.",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    ),
                    title: "Secure & Private",
                    desc: "Payments processed by Stripe & IntaSend.",
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        {icon}
                      </svg>
                    </div>
                    <h3 className="font-heading text-base font-bold text-white mb-1">{title}</h3>
                    <p className="font-body text-sm text-white/60 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Coaching Sessions Tab ── */}
      {tab === "coaching" && (
        <section className="bg-cream-lightest py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="mb-12">
              <p className="font-body text-xs font-bold text-gold uppercase tracking-[0.2em] mb-3">
                Live Sessions
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-teal mb-3">
                Coaching Sessions
              </h2>
              <p className="font-body text-warm-gray max-w-xl leading-relaxed">
                Register for a session and receive your Zoom link by email after payment is confirmed.
              </p>
            </div>

            {eventsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-cream animate-pulse">
                    <div className="aspect-[16/9] bg-cream" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-cream rounded w-3/4" />
                      <div className="h-4 bg-cream rounded w-full" />
                      <div className="h-4 bg-cream rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-cream flex items-center justify-center">
                  <svg className="w-8 h-8 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                  </svg>
                </div>
                <p className="font-body text-warm-gray">No coaching sessions yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const lowestTier = event.tiers[0];
                  const nextSession = event.sessions[0];
                  const seatsRemaining =
                    lowestTier && lowestTier.quantityAvailable > 0
                      ? Math.max(0, lowestTier.quantityAvailable - lowestTier.soldCount)
                      : null;
                  const isFull = lowestTier?.isSaleClosed || (seatsRemaining !== null && seatsRemaining <= 0);

                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-cream overflow-hidden hover:shadow-2xl hover:border-gold/20 transition-all duration-500"
                    >
                      {/* Cover */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-teal to-slate overflow-hidden flex-shrink-0">
                        {event.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                          </div>
                        )}
                        {/* Overlay gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-teal text-[10px] font-body font-bold uppercase tracking-widest rounded-full">
                            {event.eventType.replace(/_/g, " ")}
                          </span>
                        </div>
                        {/* Sold out overlay */}
                        {isFull && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="px-4 py-2 bg-white/90 text-red-700 text-xs font-body font-bold uppercase tracking-widest rounded-full">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="font-heading text-lg font-bold text-teal mb-1.5 group-hover:text-gold transition-colors duration-300 leading-snug line-clamp-2">
                          {event.title}
                        </h3>
                        {event.shortDesc && (
                          <p className="font-body text-sm text-warm-gray leading-relaxed mb-4 line-clamp-2 flex-1">
                            {event.shortDesc}
                          </p>
                        )}

                        {/* Date chip */}
                        {nextSession && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-lightest rounded-full border border-cream">
                              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                              </svg>
                              <span className="font-body text-xs text-slate font-medium">
                                {new Date(nextSession.startTime).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </span>
                          </div>
                        )}

                        {/* Price row */}
                        <div className="flex items-center justify-between pt-4 border-t border-cream mt-auto">
                          <div>
                            {lowestTier ? (
                              <div className="flex items-baseline gap-2">
                                {lowestTier.originalPriceUSD && lowestTier.originalPriceUSD > lowestTier.priceUSD && (
                                  <span className="font-body text-xs text-warm-gray line-through">
                                    ${lowestTier.originalPriceUSD}
                                  </span>
                                )}
                                <span className="font-heading text-xl font-bold text-teal">
                                  {lowestTier.priceUSD === 0 ? "Free" : `From $${lowestTier.priceUSD}`}
                                </span>
                              </div>
                            ) : (
                              <span className="font-heading text-xl font-bold text-teal">Free</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {seatsRemaining !== null && seatsRemaining > 0 && seatsRemaining <= 20 && (
                              <span className="text-[10px] font-body font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                                {seatsRemaining} left
                              </span>
                            )}
                            <span className="w-8 h-8 rounded-full bg-cream flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all duration-300">
                              <svg className="w-4 h-4 text-teal group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative bg-gradient-to-br from-slate to-teal py-20 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-body text-xs font-bold text-gold uppercase tracking-[0.2em] mb-4">
            Bespoke Work
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-5">
            Need Something Custom?
          </h2>
          <p className="font-body text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Consulting packages, organisational workshops, and speaking engagements tailored to your context.
          </p>
          <Link
            href="/my-work?tab=consultation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-white font-body font-bold rounded-full hover:opacity-90 transition-all shadow-xl shadow-gold/20"
          >
            View Consulting Packages
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Book Checkout Modal */}
      {selectedBook && (
        <CheckoutModal
          isOpen={bookCheckoutOpen}
          onClose={() => {
            setBookCheckoutOpen(false);
            setSelectedBook(null);
          }}
          product={{
            name: selectedBook.title,
            price: selectedBook.price,
            priceKES: selectedBook.priceKES,
            type: "BOOK",
          }}
        />
      )}
    </>
  );
}
