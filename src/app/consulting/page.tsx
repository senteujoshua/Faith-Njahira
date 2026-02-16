import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consulting & Advisory",
  description:
    "Disability inclusion audits, intersectionality training, capacity building, coaching, and strategic advisory services by Faith Njah\u00eera Wangar\u00ee.",
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

export default function ConsultingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Services
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Consulting &amp; Advisory
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto mb-10">
            Expert guidance on disability inclusion, intersectional justice, and organizational transformation. Over 14 years of experience translating scholarship into actionable change.
          </p>
          <a
            href="#book"
            className="inline-block px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
          >
            Book a Consultation
          </a>
        </div>
      </section>

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
                <h3 className="font-heading text-xl font-bold text-teal mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
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
              Flexible options tailored to your organization&apos;s needs and goals.
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
                <h3
                  className={`font-heading text-lg font-bold mb-3 ${
                    pkg.highlight ? "text-gold" : "text-teal"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`font-body text-sm leading-relaxed mb-6 ${
                    pkg.highlight ? "text-cream/80" : "text-slate"
                  }`}
                >
                  {pkg.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 font-body text-sm ${
                        pkg.highlight ? "text-cream/70" : "text-slate"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 shrink-0 ${
                          pkg.highlight ? "text-gold" : "text-gold"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
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

      {/* Booking Section */}
      <section id="book" className="bg-cream-lightest py-24">
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

          <form className="bg-white rounded-2xl p-8 md:p-12 border border-cream shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-body text-sm font-medium text-teal mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-teal mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="org" className="block font-body text-sm font-medium text-teal mb-2">
                Organization
              </label>
              <input
                type="text"
                id="org"
                name="org"
                className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="Your organization (optional)"
              />
            </div>

            <div>
              <label htmlFor="service" className="block font-body text-sm font-medium text-teal mb-2">
                Service of Interest
              </label>
              <select
                id="service"
                name="service"
                className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              >
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
              <label htmlFor="message" className="block font-body text-sm font-medium text-teal mb-2">
                Tell Me About Your Needs
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                placeholder="Describe your project, goals, and timeline..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
            >
              Send Consultation Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
