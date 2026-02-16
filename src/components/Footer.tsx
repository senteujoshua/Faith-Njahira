import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-teal text-cream-light">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl font-bold text-white mb-4">
              Faith Njah&icirc;ra
            </h3>
            <p className="text-warm-gray text-sm leading-relaxed mb-6">
              Disability studies scholar, global disability consultant, and inclusion specialist.
              Passionate about teaching, research, and supporting disability inclusion.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-cream hover:bg-gold transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-cream hover:bg-gold transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:contact@faithnjahira.com"
                className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-cream hover:bg-gold transition-colors duration-200"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Faith" },
                { href: "/publications", label: "Publications" },
                { href: "/shop", label: "Bookshop" },
                { href: "/coaching", label: "Coaching" },
                { href: "/consulting", label: "Consulting" },
                { href: "/media", label: "Media & Press" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-gray text-sm hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-6">
              Focus Areas
            </h4>
            <ul className="space-y-3">
              {[
                "Disability Justice",
                "Intersectional Feminism",
                "SRHR & Disability",
                "Inclusive Education",
                "Queer Justice",
              ].map((item) => (
                <li key={item} className="text-warm-gray text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-6">
              Get in Touch
            </h4>
            <div className="space-y-4 text-warm-gray text-sm">
              <p>For consulting inquiries, speaking engagements, and collaborations.</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-2.5 border border-gold text-gold text-sm font-medium rounded-full hover:bg-gold hover:text-white transition-all duration-200"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-gray text-xs">
            &copy; {new Date().getFullYear()} Faith Njah&icirc;ra Wangar&icirc;. All rights reserved.
          </p>
          <p className="text-warm-gray/60 text-xs">
            Disability justice is not charity. It is structural transformation.
          </p>
        </div>
      </div>
    </footer>
  );
}
