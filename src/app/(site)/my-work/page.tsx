"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  organization: string | null;
  country: string | null;
  description: string | null;
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

const services = [
  {
    title: "Disability Inclusion Audits",
    description:
      "Comprehensive institutional accessibility assessments, policy development, and organizational strategy to build genuinely inclusive systems.",
    items: [
      "Institutional accessibility assessments",
      "Policy development & review",
      "Organizational inclusion strategy",
      "Compliance gap analysis",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Intersectionality & Gender Mainstreaming",
    description:
      "Expert guidance on disability and gender programming, feminist movement building, and integrating intersectional analysis into organizational work.",
    items: [
      "Disability & gender programming",
      "Feminist movement building",
      "Intersectional policy frameworks",
      "Gender-responsive disability inclusion",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Training & Capacity Building",
    description:
      "Tailored training programs for organizations, governments, and civil society on disability rights, SRHR, and inclusive practices.",
    items: [
      "UN reporting mechanisms",
      "Disability & sexuality",
      "SRHR & disability",
      "Inclusive elections",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Coaching & Mentorship",
    description:
      "One-on-one guidance for scholars, activists, and disability justice leaders navigating academia, advocacy, and professional development.",
    items: [
      "Emerging scholars",
      "Disability rights activists",
      "Movement leaders",
      "Career navigation",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

const packages = [
  {
    name: "Institutional Consulting",
    description: "Comprehensive organizational assessment, strategy development, and implementation support for disability inclusion.",
    features: ["Full accessibility audit", "Policy recommendations", "Staff training", "Implementation roadmap"],
    highlight: false,
  },
  {
    name: "Strategic Advisory Retainer",
    description: "Ongoing advisory partnership for organizations committed to embedding disability justice in their work.",
    features: ["Monthly strategy sessions", "Policy review", "Priority support", "Quarterly progress reviews"],
    highlight: true,
  },
  {
    name: "Speaking Engagements",
    description: "Keynote speeches, panel participation, and conference presentations on disability justice and intersectionality.",
    features: ["Keynote addresses", "Panel moderation", "Workshop facilitation", "Academic lectures"],
    highlight: false,
  },
  {
    name: "1:1 Coaching",
    description: "Personalized mentorship for scholars, activists, and professionals in disability justice and human rights.",
    features: ["Career guidance", "Research mentorship", "Advocacy coaching", "Flexible scheduling"],
    highlight: false,
  },
];

const communityWork = [
  {
    title: "Zaidi ya Misuli Resource Centre",
    description:
      "A disability-led resource centre supporting persons with disabilities in accessing information, advocacy tools, and community support in Kenya. Named from Swahili meaning 'more than muscles', it centers disability identity beyond physical ability.",
    link: null,
  },
  {
    title: "Movement Building Initiatives",
    description:
      "Facilitating cross-movement solidarity between disability justice, feminist, and LGBTQ+ movements across Africa. Convening spaces for disability advocates, queer activists, and women's rights leaders to build shared analysis and strategy.",
    link: null,
  },
  {
    title: "Inclusive Education Advocacy",
    description:
      "Campaigning for genuinely inclusive education systems in Kenya and across the African continent — moving beyond tokenistic integration to substantive inclusion that honors disabled children's full humanity and learning needs.",
    link: null,
  },
  {
    title: "Disability & SRHR Programming",
    description:
      "Advocating for disabled people's sexual and reproductive health rights, challenging the desexualization of disabled bodies, and building coalitions between SRHR and disability justice movements.",
    link: null,
  },
];

type TabType = "consultation" | "coaching" | "community-work";

function MyWorkContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "consultation";
  const [tab, setTab] = useState<TabType>(initialTab);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    if (tab === "consultation" && clients.length === 0) {
      setClientsLoading(true);
      fetch("/api/clients")
        .then((r) => r.json())
        .then((data) => { setClients(data); setClientsLoading(false); })
        .catch(() => setClientsLoading(false));
    }
    if (tab === "coaching" && events.length === 0) {
      setEventsLoading(true);
      fetch("/api/events")
        .then((r) => r.json())
        .then((data: EventCard[]) => { setEvents(data); setEventsLoading(false); })
        .catch(() => setEventsLoading(false));
    }
  }, [tab, clients.length, events.length]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal to-slate pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Work & Practice
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            My Work
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto mb-10">
            Consulting, coaching, and community work rooted in disability justice, intersectional feminism, and structural transformation.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex flex-wrap justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-1.5 gap-1">
            <button
              onClick={() => setTab("consultation")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "consultation"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Consultation
            </button>
            <button
              onClick={() => setTab("coaching")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "coaching"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Coaching
            </button>
            <button
              onClick={() => setTab("community-work")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "community-work"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Community Work
            </button>
          </div>
        </div>
      </section>

      {/* ── Consultation Tab ── */}
      {tab === "consultation" && (
        <>
          {/* Services */}
          <section className="bg-cream-lightest py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
                  Services Offered
                </h2>
                <div className="section-divider mx-auto" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-teal mb-3">{service.title}</h3>
                    <p className="font-body text-slate text-sm leading-relaxed mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 font-body text-sm text-slate">
                          <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
                  Engagement Packages
                </h2>
                <div className="section-divider mx-auto mb-6" />
                <p className="font-body text-slate text-lg max-w-2xl mx-auto">
                  Flexible options tailored to your organisation&apos;s needs and goals.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${
                      pkg.highlight
                        ? "bg-teal text-cream border-teal shadow-lg"
                        : "bg-cream-lightest border-cream hover:border-gold/30"
                    }`}
                  >
                    <h3 className={`font-heading text-lg font-bold mb-3 ${pkg.highlight ? "text-gold" : "text-teal"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`font-body text-sm leading-relaxed mb-6 ${pkg.highlight ? "text-cream/80" : "text-slate"}`}>
                      {pkg.description}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {pkg.features.map((feature) => (
                        <li key={feature} className={`flex items-center gap-2 font-body text-sm ${pkg.highlight ? "text-cream/70" : "text-slate"}`}>
                          <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#book"
                      className={`block text-center px-6 py-3 rounded-full font-body font-semibold text-sm transition-all duration-200 ${
                        pkg.highlight
                          ? "bg-gold text-white hover:bg-gold-dark"
                          : "border-2 border-gold text-gold hover:bg-gold hover:text-white"
                      }`}
                    >
                      Inquire
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Clients Section */}
          <section className="bg-cream-lightest py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl font-bold text-teal mb-4">
                  Organisations &amp; People I&apos;ve Worked With
                </h2>
                <div className="section-divider mx-auto" />
              </div>

              {clientsLoading ? (
                <div className="text-center py-12 text-warm-gray font-body">Loading clients...</div>
              ) : clients.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="bg-white rounded-2xl p-6 border border-cream hover:border-gold/30 hover:shadow-md transition-all duration-300"
                    >
                      <h3 className="font-heading text-base font-bold text-teal mb-1">{client.name}</h3>
                      {client.organization && (
                        <p className="font-body text-sm text-gold mb-1">{client.organization}</p>
                      )}
                      {client.country && (
                        <p className="font-body text-xs text-warm-gray mb-3">{client.country}</p>
                      )}
                      {client.description && (
                        <p className="font-body text-sm text-slate leading-relaxed">{client.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "UN Women Kenya", org: "United Nations Entity", country: "Kenya", desc: "Gender & disability mainstreaming training" },
                    { name: "Humanity & Inclusion", org: "International NGO", country: "Global", desc: "Disability inclusion audit & policy review" },
                    { name: "Kenya Human Rights Commission", org: "Government Commission", country: "Kenya", desc: "Intersectionality & SRHR capacity building" },
                  ].map((c) => (
                    <div key={c.name} className="bg-white rounded-2xl p-6 border border-cream hover:border-gold/30 hover:shadow-md transition-all duration-300">
                      <h3 className="font-heading text-base font-bold text-teal mb-1">{c.name}</h3>
                      <p className="font-body text-sm text-gold mb-1">{c.org}</p>
                      <p className="font-body text-xs text-warm-gray mb-3">{c.country}</p>
                      <p className="font-body text-sm text-slate leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Booking Section */}
          <section id="book" className="bg-white py-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
                  Book a Consultation
                </h2>
                <div className="section-divider mx-auto mb-6" />
                <p className="font-body text-slate text-lg">
                  Ready to work together? Fill out the form below and I&apos;ll get back to you within 48 hours.
                </p>
              </div>

              <form className="bg-cream-lightest rounded-2xl p-8 md:p-12 border border-cream shadow-sm space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-body text-sm font-medium text-teal mb-2">Full Name</label>
                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-cream bg-white font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-body text-sm font-medium text-teal mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-cream bg-white font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="org" className="block font-body text-sm font-medium text-teal mb-2">Organisation</label>
                  <input type="text" id="org" name="org" className="w-full px-4 py-3 rounded-xl border border-cream bg-white font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" placeholder="Your organisation (optional)" />
                </div>
                <div>
                  <label htmlFor="service" className="block font-body text-sm font-medium text-teal mb-2">Service of Interest</label>
                  <select id="service" name="service" className="w-full px-4 py-3 rounded-xl border border-cream bg-white font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors">
                    <option value="">Select a service</option>
                    <option value="audit">Disability Inclusion Audit</option>
                    <option value="gender">Intersectionality & Gender Mainstreaming</option>
                    <option value="training">Training & Capacity Building</option>
                    <option value="coaching">Coaching & Mentorship</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="advisory">Strategic Advisory Retainer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-teal mb-2">Tell Me About Your Needs</label>
                  <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 rounded-xl border border-cream bg-white font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none" placeholder="Describe your project, goals, and timeline..." />
                </div>
                <button type="submit" className="w-full px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20">
                  Send Consultation Request
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* ── Coaching Tab ── */}
      {tab === "coaching" && (
        <section className="bg-cream-lightest py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-3">Coaching Sessions</h2>
              <div className="section-divider mb-6" />
              <p className="font-body text-slate text-lg max-w-2xl">
                Join a session and get the Zoom meeting link delivered to your inbox after registration.
              </p>
            </div>

            {eventsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <p className="text-center font-body text-slate py-16">No coaching sessions available yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => {
                  const lowestTier = event.tiers[0];
                  const nextSession = event.sessions[0];
                  const seatsRemaining =
                    lowestTier && lowestTier.quantityAvailable > 0
                      ? Math.max(0, lowestTier.quantityAvailable - lowestTier.soldCount)
                      : null;

                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group bg-white rounded-2xl border border-cream overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Cover image */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-teal to-teal-light overflow-hidden">
                        {event.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-white/90 text-teal text-xs font-body font-medium rounded-full">
                            {event.eventType}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-teal mb-2 group-hover:text-gold transition-colors">
                          {event.title}
                        </h3>
                        {event.shortDesc && (
                          <p className="font-body text-sm text-warm-gray mb-4 line-clamp-2">
                            {event.shortDesc}
                          </p>
                        )}

                        {/* Next session date */}
                        {nextSession && (
                          <div className="flex items-center gap-2 text-xs font-body text-warm-gray mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                            </svg>
                            <span>
                              {new Date(nextSession.startTime).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Pricing + seats */}
                        <div className="flex items-center justify-between">
                          {lowestTier ? (
                            <div>
                              {lowestTier.originalPriceUSD && lowestTier.originalPriceUSD > lowestTier.priceUSD && (
                                <span className="font-body text-xs text-warm-gray line-through mr-1">
                                  ${lowestTier.originalPriceUSD}
                                </span>
                              )}
                              <span className="font-heading text-lg font-bold text-teal">
                                {lowestTier.priceUSD === 0 ? "Free" : `From $${lowestTier.priceUSD}`}
                              </span>
                            </div>
                          ) : (
                            <span className="font-body text-sm text-warm-gray">Free</span>
                          )}
                          {seatsRemaining !== null && seatsRemaining <= 20 && seatsRemaining > 0 && (
                            <span className="text-xs font-body text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              {seatsRemaining} left
                            </span>
                          )}
                          {lowestTier?.isSaleClosed && (
                            <span className="text-xs font-body text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                              Sold out
                            </span>
                          )}
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

      {/* ── Community Work Tab ── */}
      {tab === "community-work" && (
        <section className="bg-cream-lightest py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
                Community Work
              </h2>
              <div className="section-divider mx-auto mb-6" />
              <p className="font-body text-slate text-lg max-w-2xl mx-auto">
                Grassroots work, movement building, and community-centred initiatives at the intersection of disability, gender, and justice.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {communityWork.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-teal mb-3">{item.title}</h3>
                  <p className="font-body text-slate text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Work Together?
          </h2>
          <p className="font-body text-cream/70 mb-8">
            Whether you need consulting, coaching, or a collaborator for community work, reach out and let&apos;s explore how we can create impact together.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}

export default function MyWorkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-lightest" />}>
      <MyWorkContent />
    </Suspense>
  );
}
