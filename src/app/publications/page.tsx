"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

type Publication = {
  id: number;
  type: "book" | "film" | "report" | "lecture";
  title: string;
  description: string;
  year: string;
  topics: string[];
  publisher?: string;
  link?: string;
};

const publications: Publication[] = [
  {
    id: 1,
    type: "book",
    title: "Can I Call My Kenyan Education Inclusive?",
    description:
      "A chapter in Crip Genealogies, exploring the intersections of disability and education in Kenya through personal narrative and critical analysis.",
    year: "2023",
    topics: ["Disability", "Education"],
    publisher: "Duke University Press (Crip Genealogies)",
  },
  {
    id: 2,
    type: "book",
    title: "Ng\u2019ano cia marim\u00fb\u2026",
    description:
      "A chapter in Activating Arts to Understand Disability in Africa, examining disability through arts-based methodologies and cultural storytelling traditions.",
    year: "2025",
    topics: ["Disability", "Arts", "Culture"],
    publisher: "Routledge",
  },
  {
    id: 3,
    type: "film",
    title: "For All the Brilliant Conversations",
    description:
      "A documentary film exploring disability, identity, and the transformative power of dialogue. Selected for film festivals and screened in academic settings.",
    year: "2023",
    topics: ["Disability", "Film", "Identity"],
  },
  {
    id: 4,
    type: "report",
    title: "UN Independent Expert on Albinism Animation Series",
    description:
      "Technical contribution to the animation series supporting the work of the UN Independent Expert on the Enjoyment of Human Rights by Persons with Albinism.",
    year: "2024",
    topics: ["Disability", "Human Rights", "Albinism"],
    publisher: "United Nations",
  },
  {
    id: 5,
    type: "report",
    title: "Accessibility Audits & Budget Tracking Reports",
    description:
      "Technical reports on institutional accessibility assessments and disability-inclusive budget tracking for development organizations.",
    year: "2024",
    topics: ["Disability", "Policy", "Development"],
  },
  {
    id: 6,
    type: "lecture",
    title: "Guest Lecture \u2014 Colgate University",
    description:
      "Academic engagement on disability justice, intersectionality, and human rights frameworks in the Global South.",
    year: "2024",
    topics: ["Disability", "Education", "Gender"],
    publisher: "Colgate University",
  },
  {
    id: 7,
    type: "lecture",
    title: "Centre for Human Rights, University of Pretoria",
    description:
      "Lectures and academic engagement at the Centre for Human Rights on disability rights in Africa, SRHR, and intersectional justice.",
    year: "2024",
    topics: ["Disability", "Health", "Human Rights"],
    publisher: "University of Pretoria",
  },
  {
    id: 8,
    type: "lecture",
    title: "Kenya National Health Conference",
    description:
      "Presentation on disability and health intersectionality at the national level, advocating for inclusive health systems.",
    year: "2023",
    topics: ["Disability", "Health"],
    publisher: "Kenya Ministry of Health",
  },
];

const typeLabels: Record<string, string> = {
  all: "All",
  book: "Books & Chapters",
  film: "Film & Media",
  report: "Reports & Technical",
  lecture: "Lectures & Talks",
};

const typeIcons: Record<string, ReactNode> = {
  book: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  film: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
    </svg>
  ),
  report: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  lecture: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
};

export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? publications
      : publications.filter((p) => p.type === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Knowledge Production
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Publications &amp; Academia
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            Books, book chapters, documentary film, technical reports, and academic engagements building intellectual authority in disability justice.
          </p>
        </div>
      </section>

      {/* Filter & Content */}
      <section className="bg-cream-lightest py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                  activeFilter === key
                    ? "bg-gold text-white shadow-md"
                    : "bg-white text-slate border border-cream hover:border-gold/30 hover:text-gold"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Publications Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((pub) => (
              <article
                key={pub.id}
                className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    {typeIcons[pub.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gold font-body text-xs uppercase tracking-wider font-semibold">
                        {typeLabels[pub.type]}
                      </span>
                      <span className="text-warm-gray font-body text-xs">{pub.year}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-teal">
                      {pub.title}
                    </h3>
                  </div>
                </div>

                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  {pub.description}
                </p>

                {pub.publisher && (
                  <p className="font-body text-warm-gray text-sm italic mb-4">
                    {pub.publisher}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {pub.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-cream-lightest text-slate text-xs font-body rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-warm-gray text-lg">
                No publications found for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Interested in Collaboration?
          </h2>
          <p className="font-body text-cream/70 mb-8">
            For academic collaborations, guest lectures, or publication inquiries, get in touch.
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
