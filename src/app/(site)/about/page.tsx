import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Faith",
  description:
    "Learn about Faith Njah\u00eera Wangar\u00ee \u2014 disability justice scholar, intersectional feminist, consultant, and author with over 14 years in human rights.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal to-slate pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-cream/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Portrait */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 lg:w-72 lg:h-[440px] rounded-2xl overflow-hidden border-2 border-gold/20 shadow-2xl">
                  <Image
                    src="/faith-portrait.jpg"
                    alt="Faith Njahîra Wangarî"
                    width={288}
                    height={440}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-gold/20 rounded-2xl -z-10" />
              </div>
            </div>

            {/* Hero Text */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
                About
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Faith Njah&icirc;ra
                <br />
                <span className="text-gold">Wangar&icirc;</span>
              </h1>
              <p className="font-body text-xl text-cream/80 mb-2">
                Disability Studies Scholar &middot; Inclusion Specialist
              </p>
              <p className="font-body text-lg text-cream/60 mb-8">
                Global Consultant &middot; Researcher &middot; Filmmaker
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/consulting"
                  className="px-7 py-3 bg-gold text-white font-body font-semibold text-sm rounded-full hover:bg-gold-dark transition-all duration-300"
                >
                  Work With Me
                </Link>
                <Link
                  href="/publications"
                  className="px-7 py-3 border-2 border-cream/30 text-cream font-body font-semibold text-sm rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                >
                  View Publications
                </Link>
                <Link
                  href="/media"
                  className="px-7 py-3 border-2 border-cream/30 text-cream font-body font-semibold text-sm rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                >
                  Media &amp; Interviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Bio */}
      <section className="bg-cream-lightest py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-teal mb-4">At a Glance</h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
                title: "B.Ed Special Needs Education",
                subtitle: "Kenyatta University",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
                title: "MSc Teaching & Curriculum",
                subtitle: "Syracuse University (Disability Studies)",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: "Published Author",
                subtitle: "Duke University Press",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                ),
                title: "Founder & Co-Executive Director",
                subtitle: "Zaidi ya Misuli Resource Centre",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Njahira Wangari Consulting",
                subtitle: "Global Disability Consultant & Researcher",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
                title: "Grief Literacy Certified",
                subtitle: "Being Here, Human",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 items-start p-5 bg-white rounded-xl border border-cream hover:border-gold/30 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal">{item.title}</h3>
                  <p className="font-body text-slate text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Bio */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-teal mb-4">The Full Story</h2>
          <div className="section-divider mb-10" />

          <div className="font-body text-slate text-lg leading-relaxed space-y-6">
            <p>
              Faith Njah&#x0129;ra Wangar&#x01D0; is a disability studies scholar and inclusion specialist who loves teaching, research and supporting others to improve their practice of disability inclusion. Njahira has muscular dystrophy and moves through the world on a wheelchair.
            </p>
            <p>
              She is a graduate of the Bachelors of Education (Special Needs Education) specialising in learning disabilities from Kenyatta University and the Functional and Educational Assessment Certificate from KISE. Njahira did her Masters in Teaching and Curriculum specialising in disability studies at Syracuse University in the United States. She has additional training in Grief Literacy from Being Here, Human.
            </p>
            <p>
              She is a global disability consultant and researcher who has been involved in the disability movement for a long time now. Through her company, <strong>Njahira Wangari Consulting</strong>, she supports institutions and individuals seeking to better understand disability and grow in their disability consciousness through targeted training and technical support.
            </p>
            <p>
              After running an informal support group for muscular dystrophy since 2013, she is currently the founder and co-executive director of <strong>Zaidi ya Misuli Resource Centre</strong>, which seeks to demystify, research and support muscular dystrophy along with other disabilities through education, training and research towards wholeness.
            </p>
            <p>
              Faith is also a filmmaker. Her documentary <em>For All the Brilliant Conversations</em> has been screened at film festivals and academic settings, exploring disability, identity, and the transformative power of dialogue.
            </p>
            <p>
              Her academic work has been published by Duke University Press as part of the <em>Crip Genealogies</em> collection, and by Routledge in <em>Activating Arts to Understand Disability in Africa</em> (2025). She has contributed technical reports including the UN Independent Expert on Albinism animation series, and has delivered guest lectures at institutions including Colgate University and the Centre for Human Rights at the University of Pretoria.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-teal py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-8">Philosophy</h2>
          <blockquote className="font-heading text-2xl md:text-3xl text-cream italic leading-relaxed mb-6">
            &ldquo;Disability justice is not charity. It is structural transformation. It demands that we reimagine systems, redistribute power, and center the voices of those who have been most marginalized.&rdquo;
          </blockquote>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p className="font-body text-cream/70">
            Faith&apos;s work is guided by an intersectional framework that recognizes how disability, gender, race, sexuality, and geography shape access to justice and dignity.
          </p>
        </div>
      </section>

      {/* CV Download */}
      <section className="bg-cream-lightest py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-teal mb-4">
            Curriculum Vitae
          </h2>
          <p className="font-body text-slate mb-8">
            Download Faith&apos;s full academic and professional CV for a comprehensive overview of her publications, positions, and engagements.
          </p>
          <a
            href="/faith-njahira-cv.pdf"
            download
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download CV (PDF)
          </a>
        </div>
      </section>
    </>
  );
}
