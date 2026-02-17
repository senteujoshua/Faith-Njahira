"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal";
import CalendlyEmbed from "@/components/CalendlyEmbed";

/* ── Books data ───────────────────────────────────────────── */

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

const books: Book[] = [
  {
    id: "crip-genealogies",
    title: "Can I Call My Kenyan Education Inclusive?",
    description:
      "A chapter in Crip Genealogies, exploring the intersections of disability and education in Kenya through personal narrative and critical analysis. This work interrogates what inclusion means in Kenyan educational contexts and challenges dominant narratives of disability.",
    price: 15.0,
    priceKES: 2000,
    coverImage: "/book-cover-crip-genealogies.jpg",
    publisher: "Duke University Press",
    year: "2023",
    format: "Digital PDF",
  },
  {
    id: "ngano-cia-marimbu",
    title: "Ng\u2019ano cia marim\u016b\u2026",
    description:
      "A chapter in Activating Arts to Understand Disability in Africa, examining disability through arts-based methodologies and cultural storytelling traditions. Explores the power of narrative and creative expression in disability scholarship.",
    price: 18.0,
    priceKES: 2400,
    coverImage: "/book-cover-ngano.jpg",
    publisher: "Routledge",
    year: "2025",
    format: "Digital PDF",
  },
];

/* ── Coaching data ────────────────────────────────────────── */

type Session = {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  priceKES: number;
  isFree: boolean;
  calendlyUrl: string;
};

const sessions: Session[] = [
  {
    id: "discovery-call",
    title: "Discovery Call",
    description:
      "A free 30-minute introductory session to explore your needs and how we can work together. Perfect for first-time clients.",
    duration: "30 min",
    price: 0,
    priceKES: 0,
    isFree: true,
    calendlyUrl:
      (process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/faith-njahira") +
      "/discovery-call",
  },
  {
    id: "disability-inclusion",
    title: "Disability Inclusion Strategy",
    description:
      "A focused session on building disability-inclusive practices in your organization, project, or research. Practical frameworks and actionable next steps.",
    duration: "60 min",
    price: 75,
    priceKES: 10000,
    isFree: false,
    calendlyUrl:
      (process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/faith-njahira") +
      "/disability-inclusion",
  },
  {
    id: "research-mentorship",
    title: "Research Mentorship",
    description:
      "One-on-one guidance for students, early-career researchers, or professionals working on disability studies, intersectionality, or social justice research.",
    duration: "60 min",
    price: 60,
    priceKES: 8000,
    isFree: false,
    calendlyUrl:
      (process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/faith-njahira") +
      "/research-mentorship",
  },
  {
    id: "deep-dive",
    title: "Deep Dive Consultation",
    description:
      "An extended session for complex consulting needs — policy review, curriculum design, organizational audits, or strategic planning on disability and gender justice.",
    duration: "90 min",
    price: 120,
    priceKES: 16000,
    isFree: false,
    calendlyUrl:
      (process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/faith-njahira") +
      "/deep-dive",
  },
];

/* ── Component ────────────────────────────────────────────── */

type Tab = "books" | "coaching";

export default function ShopPage() {
  const [tab, setTab] = useState<Tab>("books");

  // Book checkout
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookCheckoutOpen, setBookCheckoutOpen] = useState(false);

  // Coaching checkout
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [coachingCheckoutOpen, setCoachingCheckoutOpen] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");

  const openBookCheckout = (book: Book) => {
    setSelectedBook(book);
    setBookCheckoutOpen(true);
  };

  const handleFreeBooking = (session: Session) => {
    setCalendlyUrl(session.calendlyUrl);
    setShowCalendly(true);
  };

  const handlePaidBooking = (session: Session) => {
    setSelectedSession(session);
    setCoachingCheckoutOpen(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal to-slate pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Shop
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Books &amp; Coaching
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto mb-10">
            Digital publications and one-on-one coaching sessions on disability
            justice, intersectionality, and inclusive futures.
          </p>

          {/* Tab Switcher */}
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
              Coaching
            </button>
          </div>
        </div>
      </section>

      {/* ── Books Tab ──────────────────────────────────────── */}
      {tab === "books" && (
        <>
          <section className="bg-cream-lightest py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                {books.map((book) => (
                  <article
                    key={book.id}
                    className="bg-white rounded-2xl overflow-hidden border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="aspect-[3/2] bg-gradient-to-br from-teal/10 to-cream relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-8">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-teal/10 flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-teal/40"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                              />
                            </svg>
                          </div>
                          <p className="font-body text-sm text-teal/50">
                            {book.publisher}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-cream-lightest text-gold text-xs font-body font-semibold uppercase tracking-wider rounded-full">
                          {book.format}
                        </span>
                        <span className="text-warm-gray font-body text-xs">
                          {book.year}
                        </span>
                      </div>

                      <h2 className="font-heading text-xl font-bold text-teal mb-3">
                        {book.title}
                      </h2>

                      <p className="font-body text-slate text-sm leading-relaxed mb-2">
                        {book.description}
                      </p>

                      <p className="font-body text-warm-gray text-sm italic mb-6">
                        {book.publisher}
                      </p>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading text-2xl font-bold text-teal">
                            ${book.price.toFixed(2)}
                          </p>
                          <p className="font-body text-xs text-warm-gray">
                            KES {book.priceKES.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => openBookCheckout(book)}
                          className="px-6 py-3 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Info Strip */}
          <section className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Instant Download
                  </h3>
                  <p className="font-body text-sm text-slate">
                    Receive your digital copy immediately after payment via email.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Flexible Payments
                  </h3>
                  <p className="font-body text-sm text-slate">
                    Pay with card (global) or M-Pesa (Kenya). No account needed.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Secure &amp; Private
                  </h3>
                  <p className="font-body text-sm text-slate">
                    Payments processed securely through Stripe and IntaSend.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Coaching Tab ───────────────────────────────────── */}
      {tab === "coaching" && (
        <>
          <section className="bg-cream-lightest py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <article
                    key={session.id}
                    className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Badge Row */}
                    <div className="flex items-center gap-3 mb-4">
                      {session.isFree ? (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-body font-semibold uppercase tracking-wider rounded-full">
                          Free
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-body font-semibold uppercase tracking-wider rounded-full">
                          Paid
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-warm-gray font-body text-xs">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {session.duration}
                      </span>
                    </div>

                    {/* Content */}
                    <h2 className="font-heading text-xl font-bold text-teal mb-3">
                      {session.title}
                    </h2>
                    <p className="font-body text-slate text-sm leading-relaxed mb-6 flex-1">
                      {session.description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-cream">
                      <div>
                        {session.isFree ? (
                          <p className="font-heading text-xl font-bold text-green-600">
                            Free
                          </p>
                        ) : (
                          <>
                            <p className="font-heading text-xl font-bold text-teal">
                              ${session.price}
                            </p>
                            <p className="font-body text-xs text-warm-gray">
                              KES {session.priceKES.toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>

                      {session.isFree ? (
                        <button
                          onClick={() => handleFreeBooking(session)}
                          className="px-6 py-3 bg-teal text-white font-body font-semibold rounded-full hover:bg-teal-light transition-all duration-300"
                        >
                          Book Free Session
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePaidBooking(session)}
                          className="px-6 py-3 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
                        >
                          Book &amp; Pay
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Calendly Section (shown for free sessions) */}
          {showCalendly && (
            <section className="bg-white py-16">
              <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-bold text-teal">
                    Schedule Your Session
                  </h2>
                  <button
                    onClick={() => setShowCalendly(false)}
                    className="px-4 py-2 text-warm-gray font-body text-sm hover:text-teal transition-colors"
                  >
                    Close
                  </button>
                </div>
                <CalendlyEmbed url={calendlyUrl} />
              </div>
            </section>
          )}

          {/* How It Works */}
          <section className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-teal text-center mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 text-gold font-heading font-bold text-lg flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Choose a Session
                  </h3>
                  <p className="font-body text-sm text-slate">
                    Select the session type that fits your needs — free discovery
                    or paid deep-dive.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 text-gold font-heading font-bold text-lg flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Pay (If Required)
                  </h3>
                  <p className="font-body text-sm text-slate">
                    For paid sessions, complete payment via card or M-Pesa. No
                    account needed.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 text-gold font-heading font-bold text-lg flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    Schedule &amp; Meet
                  </h3>
                  <p className="font-body text-sm text-slate">
                    Pick a time via Calendly and receive a confirmation email with
                    the meeting link.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Need Something Custom?
          </h2>
          <p className="font-body text-cream/70 mb-8">
            For bespoke consulting packages, organizational workshops, or
            speaking engagements, reach out directly.
          </p>
          <Link
            href="/consulting"
            className="inline-block px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
          >
            View Consulting Packages
          </Link>
        </div>
      </section>

      {/* Checkout Modal for Books */}
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

      {/* Checkout Modal for Coaching */}
      {selectedSession && (
        <CheckoutModal
          isOpen={coachingCheckoutOpen}
          onClose={() => {
            setCoachingCheckoutOpen(false);
            setSelectedSession(null);
          }}
          product={{
            name: selectedSession.title,
            price: selectedSession.price,
            priceKES: selectedSession.priceKES,
            type: "COACHING",
            calendlyUrl: selectedSession.calendlyUrl,
          }}
        />
      )}
    </>
  );
}
