import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Faith Njah\u00eera Wangar\u00ee for consulting inquiries, speaking engagements, academic collaborations, and media requests.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Let&apos;s Connect
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            For consulting inquiries, speaking engagements, academic collaborations, media requests, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-teal mb-6">
                  Reach Out
                </h2>
                <div className="section-divider mb-8" />
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-teal text-sm mb-1">Email</h3>
                  <a
                    href="mailto:contact@faithnjahira.com"
                    className="font-body text-slate text-sm hover:text-gold transition-colors"
                  >
                    contact@faithnjahira.com
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-teal text-sm mb-1">Social</h3>
                  <div className="space-y-1">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-body text-slate text-sm hover:text-gold transition-colors"
                    >
                      Twitter / X
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-body text-slate text-sm hover:text-gold transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Inquiry Types */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-teal text-sm mb-2">I&apos;m Available For</h3>
                  <ul className="space-y-1.5">
                    {[
                      "Consulting & Advisory",
                      "Speaking Engagements",
                      "Academic Collaborations",
                      "Media & Press Inquiries",
                      "Mentorship & Coaching",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 font-body text-slate text-sm">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-teal rounded-xl p-6 mt-8">
                <blockquote className="font-heading text-lg text-cream italic leading-relaxed">
                  &ldquo;The work of justice begins with connection \u2014 reaching across divides to build something new together.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form className="bg-white rounded-2xl p-8 md:p-10 border border-cream shadow-sm space-y-6">
                <h3 className="font-heading text-xl font-bold text-teal mb-2">
                  Send a Message
                </h3>
                <p className="font-body text-slate text-sm mb-6">
                  Fill out the form below and I&apos;ll respond within 48 hours.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-body text-sm font-medium text-teal mb-2">
                      Full Name *
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
                      Email Address *
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
                  <label htmlFor="subject" className="block font-body text-sm font-medium text-teal mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="consulting">Consulting Inquiry</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="academic">Academic Collaboration</option>
                    <option value="media">Media / Press Request</option>
                    <option value="mentorship">Mentorship / Coaching</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-teal mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-cream bg-cream-lightest font-body text-dark text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                    placeholder="Tell me about your inquiry, project, or how I can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
                >
                  Send Message
                </button>

                <p className="font-body text-warm-gray text-xs text-center">
                  Your information will be treated with confidentiality and respect.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
