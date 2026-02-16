"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal";
import CalendlyEmbed from "@/components/CalendlyEmbed";

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

export default function CoachingPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");

  const handleFreeBooking = (session: Session) => {
    setCalendlyUrl(session.calendlyUrl);
    setShowCalendly(true);
  };

  const handlePaidBooking = (session: Session) => {
    setSelectedSession(session);
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            One-on-One
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Coaching &amp; Mentorship
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            Book a session for personalized guidance on disability justice,
            research, inclusive practice, or strategic consulting. No account
            needed.
          </p>
        </div>
      </section>

      {/* Sessions Grid */}
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
                Select the session type that fits your needs — free discovery or
                paid deep-dive.
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

      {/* Checkout Modal for Paid Sessions */}
      {selectedSession && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => {
            setCheckoutOpen(false);
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
