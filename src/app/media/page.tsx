import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Media & Press",
  description:
    "Interviews, blog posts, video appearances, and gallery from Faith Njah\u00eera Wangar\u00ee\u2019s work in disability justice and intersectional feminism.",
};

const interviews = [
  {
    title: "Disability Justice in the Global South",
    type: "Conference Panel",
    description: "A panel discussion on centering Global South perspectives in disability justice frameworks.",
    year: "2024",
  },
  {
    title: "Intersectionality & SRHR",
    type: "Roundtable",
    description: "Roundtable exploring the intersections of sexual and reproductive health rights with disability.",
    year: "2024",
  },
  {
    title: "Youth & Disability Advocacy",
    type: "Youth Town Hall",
    description: "Engaging young disability rights advocates in conversation about movement building and futures.",
    year: "2023",
  },
];

const blogs = [
  {
    title: "Queering SRHR",
    description: "An exploration of how sexual and reproductive health rights frameworks must expand to include queer disabled people.",
    category: "Opinion",
    date: "2024",
  },
  {
    title: "Disability Justice Beyond the NGO",
    description: "Why disability justice cannot be contained within NGO frameworks and must center radical transformation.",
    category: "Essay",
    date: "2024",
  },
  {
    title: "On Being Disabled in Kenyan Schools",
    description: "A personal reflection on navigating Kenya\u2019s education system as a disabled student and what \u2018inclusion\u2019 really means.",
    category: "Personal Essay",
    date: "2023",
  },
];

const videos = [
  {
    title: "For All the Brilliant Conversations",
    type: "Documentary Film",
    description: "Full-length documentary exploring disability, identity, and the transformative power of dialogue.",
    featured: true,
  },
  {
    title: "Disability Rights in Africa \u2014 Lecture Series",
    type: "Academic Lecture",
    description: "Recorded lecture at the Centre for Human Rights, University of Pretoria on disability rights frameworks in Africa.",
    featured: false,
  },
  {
    title: "Kenya National Health Conference Keynote",
    type: "Conference Recording",
    description: "Keynote presentation on disability and health intersectionality at the national health conference.",
    featured: false,
  },
];

export default function MediaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            In the Spotlight
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Media &amp; Press
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            Interviews, panel discussions, blog posts, video appearances, and highlights from disability justice work across the globe.
          </p>
        </div>
      </section>

      {/* Interviews */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              <h2 className="font-heading text-3xl font-bold text-teal">Interviews &amp; Panels</h2>
            </div>
            <div className="section-divider" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {interviews.map((item) => (
              <article
                key={item.title}
                className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <span className="inline-block px-3 py-1 bg-gold/10 text-gold font-body text-xs uppercase tracking-wider font-semibold rounded-full mb-4">
                  {item.type}
                </span>
                <h3 className="font-heading text-lg font-bold text-teal mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-3">
                  {item.description}
                </p>
                <span className="font-body text-warm-gray text-xs">{item.year}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
              <h2 className="font-heading text-3xl font-bold text-teal">Blogs &amp; Opinion Pieces</h2>
            </div>
            <div className="section-divider" />
          </div>

          <div className="space-y-6">
            {blogs.map((post) => (
              <article
                key={post.title}
                className="bg-cream-lightest rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-gold/10 text-gold font-body text-xs uppercase tracking-wider font-semibold rounded-full">
                        {post.category}
                      </span>
                      <span className="font-body text-warm-gray text-xs">{post.date}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-teal mb-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-slate text-sm leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-gold font-body text-sm font-semibold hover:text-gold-dark transition-colors cursor-pointer">
                      Read More &rarr;
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Video Appearances */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              <h2 className="font-heading text-3xl font-bold text-teal">Video Appearances</h2>
            </div>
            <div className="section-divider" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <article
                key={video.title}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
                  video.featured ? "md:col-span-3" : ""
                }`}
              >
                <div
                  className={`bg-gradient-to-br from-teal to-slate flex items-center justify-center ${
                    video.featured ? "h-64 md:h-80" : "h-48"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                      </svg>
                    </div>
                    <p className="text-cream/50 font-body text-sm">Video Embed</p>
                  </div>
                </div>
                <div className="bg-white p-6 border-t border-cream">
                  <span className="inline-block px-3 py-1 bg-gold/10 text-gold font-body text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
                    {video.type}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-teal mb-2">
                    {video.title}
                  </h3>
                  <p className="font-body text-slate text-sm leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12z" />
              </svg>
              <h2 className="font-heading text-3xl font-bold text-teal">Gallery</h2>
            </div>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Conferences",
              "Global Advocacy",
              "Community Engagement",
              "Panel Discussions",
              "Film Screenings",
              "Workshops",
              "Academic Events",
              "Movement Building",
            ].map((label, i) => (
              <div
                key={label}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                  i === 0 || i === 5 ? "row-span-2" : ""
                }`}
              >
                <div className={`bg-gradient-to-br from-slate/80 to-teal/80 flex items-center justify-center ${
                  i === 0 || i === 5 ? "h-full min-h-[280px]" : "h-[200px]"
                }`}>
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 mx-auto text-cream/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12z" />
                    </svg>
                    <p className="text-cream/50 font-body text-xs">{label}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-end">
                  <div className="p-4 w-full bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-body text-sm font-medium">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Press &amp; Media Inquiries
          </h2>
          <p className="font-body text-cream/70 mb-8">
            For interviews, speaking invitations, or media collaborations, please get in touch.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </>
  );
}
