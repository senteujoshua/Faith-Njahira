import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-teal via-teal-light to-slate overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cream/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cream/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <p className="animate-fade-in-up text-gold font-body text-sm uppercase tracking-[0.3em] mb-6">
                Disability Studies Scholar &middot; Inclusion Specialist
              </p>
              <h1 className="animate-fade-in-up animation-delay-200 font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Faith
                <br />
                Njah&icirc;ra
                <br />
                <span className="text-gold">Wangar&icirc;</span>
              </h1>
              <p className="animate-fade-in-up animation-delay-400 font-body text-cream/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                Disability studies scholar, global disability consultant, and researcher. Passionate about teaching, research, and supporting others to improve their practice of disability inclusion.
              </p>
              <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/consulting"
                  className="px-8 py-4 bg-gold text-white font-body font-semibold tracking-wide rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
                >
                  Work With Me
                </Link>
                <Link
                  href="/publications"
                  className="px-8 py-4 border-2 border-cream/30 text-cream font-body font-semibold tracking-wide rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                >
                  View Publications
                </Link>
                <Link
                  href="/media"
                  className="px-8 py-4 border-2 border-cream/30 text-cream font-body font-semibold tracking-wide rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                >
                  Media &amp; Interviews
                </Link>
              </div>
            </div>

            {/* Portrait */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-[480px] rounded-2xl overflow-hidden border-2 border-gold/20 shadow-2xl">
                  <Image
                    src="/faith-portrait.jpg"
                    alt="Faith Njahîra Wangarî"
                    width={320}
                    height={480}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gold/20 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-cream/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Introduction Strip */}
      <section className="bg-cream-lightest py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-divider mx-auto mb-8" />
          <blockquote className="font-heading text-2xl md:text-3xl text-teal leading-relaxed italic">
            &ldquo;Disability justice is not charity. It is structural transformation.&rdquo;
          </blockquote>
          <p className="mt-4 font-body text-warm-gray text-sm uppercase tracking-widest">
            &mdash; Faith Njah&icirc;ra Wangar&icirc;
          </p>
        </div>
      </section>

      {/* Key Areas */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
              Areas of Expertise
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Disability Justice",
                description:
                  "Centering the lived experiences of disabled people in policy, research, and movement building across the Global South.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
                  </svg>
                ),
              },
              {
                title: "Intersectional Feminism",
                description:
                  "Exploring the nexus of gender, disability, sexuality, and race to advance holistic human rights frameworks.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
              },
              {
                title: "SRHR & Disability",
                description:
                  "Advocating for sexual and reproductive health rights of persons with disabilities through research and policy engagement.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
              {
                title: "Inclusive Education",
                description:
                  "Challenging exclusionary educational systems and reimagining learning spaces that center disabled students.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
              },
              {
                title: "Health & Disability",
                description:
                  "Doctoral research at the University of Pretoria examining the intersections of health systems and disability rights.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
              },
              {
                title: "Movement Building",
                description:
                  "Co-founder of Zaidi ya Misuli Resource Centre, building grassroots movements for disability rights in East Africa.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
            ].map((area) => (
              <div
                key={area.title}
                className="group p-8 bg-cream-lightest rounded-2xl border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  {area.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-teal mb-3">
                  {area.title}
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-4">
              Featured Work
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Publication */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-teal to-slate flex items-center justify-center">
                <svg className="w-16 h-16 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="p-6">
                <span className="text-gold font-body text-xs uppercase tracking-wider font-semibold">Publication</span>
                <h3 className="font-heading text-lg font-bold text-teal mt-2 mb-2">
                  Crip Genealogies
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  &ldquo;Can I Call My Kenyan Education Inclusive?&rdquo; — Published by Duke University Press
                </p>
                <Link href="/publications" className="text-gold font-body text-sm font-semibold hover:text-gold-dark transition-colors">
                  Read More &rarr;
                </Link>
              </div>
            </div>

            {/* Film */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-slate to-teal flex items-center justify-center">
                <svg className="w-16 h-16 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                </svg>
              </div>
              <div className="p-6">
                <span className="text-gold font-body text-xs uppercase tracking-wider font-semibold">Film</span>
                <h3 className="font-heading text-lg font-bold text-teal mt-2 mb-2">
                  For All the Brilliant Conversations
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  Documentary film exploring disability, identity, and the power of dialogue.
                </p>
                <Link href="/media" className="text-gold font-body text-sm font-semibold hover:text-gold-dark transition-colors">
                  Watch &rarr;
                </Link>
              </div>
            </div>

            {/* Consulting */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-gold/80 to-gold-dark flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <div className="p-6">
                <span className="text-gold font-body text-xs uppercase tracking-wider font-semibold">Consulting</span>
                <h3 className="font-heading text-lg font-bold text-teal mt-2 mb-2">
                  Advisory Services
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  Disability inclusion audits, training, capacity building, and strategic advisory for organizations.
                </p>
                <Link href="/consulting" className="text-gold font-body text-sm font-semibold hover:text-gold-dark transition-colors">
                  Learn More &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Strip */}
      <section className="bg-teal py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "B.Ed", label: "Kenyatta University" },
              { number: "MSc", label: "Syracuse University" },
              { number: "2013", label: "Disability Movement Since" },
              { number: "Global", label: "Disability Consultant" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-cream/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-teal mb-6">
            Let&apos;s Build Inclusive Futures Together
          </h2>
          <p className="font-body text-slate text-lg leading-relaxed mb-10">
            Whether you&apos;re seeking expert consultation, a keynote speaker, or a strategic partner for disability justice work, I&apos;m here to collaborate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consulting#book"
              className="px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
            >
              Book a Consultation
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-teal text-cream font-body font-semibold rounded-full hover:bg-teal-light transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
