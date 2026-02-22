"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Publication = {
  id: string;
  type: string;
  year: string;
  title: string;
  description: string | null;
  publisher: string | null;
  link: string | null;
  tags: string | null;
  isActive: boolean;
  order: number;
};

type MediaItem = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  source: string | null;
  url: string | null;
  date: string | null;
};

function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

type SpiritualCoachingItem = {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
};

// ── Photo Album Card ────────────────────────────────────────────────────────
interface PhotoAlbumCardProps {
  albumName: string | null;
  date: string | null;
  photos: MediaItem[];
}

function PhotoAlbumCard({ albumName, date, photos }: PhotoAlbumCardProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const navigate = useCallback((dir: "prev" | "next") => {
    if (animating || photos.length <= 1) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setIndex((i) =>
        dir === "next" ? (i + 1) % photos.length : (i - 1 + photos.length) % photos.length
      );
      setAnimating(false);
    }, 200);
  }, [animating, photos.length]);

  const current = photos[index];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream hover:border-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Photo display */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {current.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.title}
            className={`w-full h-full object-cover transition-all duration-200 ${
              animating
                ? direction === "next"
                  ? "opacity-0 scale-[1.02]"
                  : "opacity-0 scale-[0.98]"
                : "opacity-100 scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
        )}

        {/* Navigation arrows — only shown when multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => navigate("prev")}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-200 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => navigate("next")}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-200 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Photo counter */}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-body font-semibold">
              {index + 1} / {photos.length}
            </div>

            {/* Dot indicators (up to 8) */}
            {photos.length <= 8 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > index ? "next" : "prev"); setIndex(i); }}
                    className={`rounded-full transition-all duration-200 ${
                      i === index ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Caption */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="font-body text-sm font-semibold text-slate leading-snug mb-1.5 line-clamp-2">
          {current.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-gray-50">
          {albumName && (
            <span className="font-body text-xs text-teal font-medium truncate">{albumName}</span>
          )}
          {albumName && date && <span className="text-warm-gray/40 text-xs">·</span>}
          {date && (
            <span className="font-body text-xs text-warm-gray">{date}</span>
          )}
        </div>
      </div>
    </div>
  );
}

const PUBLICATION_TYPES = [
  { key: "ALL", label: "All" },
  { key: "BOOK_CHAPTER", label: "Books & Chapters" },
  { key: "FILM_MEDIA", label: "Film & Media" },
  { key: "REPORT", label: "Reports & Technical" },
  { key: "LECTURE", label: "Lectures & Talks" },
];

const MEDIA_CATEGORIES: Record<string, string> = {
  INTERVIEW: "Interviews & Panels",
  BLOG: "Blogs & Opinion Pieces",
  VIDEO: "Video Appearances",
  PHOTO: "Photo Gallery",
};

function getTypeLabel(type: string) {
  const found = PUBLICATION_TYPES.find((t) => t.key === type);
  return found ? found.label : type;
}

type TabType = "publications" | "media" | "spiritual-coaching";

function KnowledgeProductionContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "publications";
  const [tab, setTab] = useState<TabType>(initialTab);

  // Publications state
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pubLoading, setPubLoading] = useState(false);
  const [pubFilter, setPubFilter] = useState("ALL");

  // Media state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Spiritual Coaching state
  const [coachingItems, setCoachingItems] = useState<SpiritualCoachingItem[]>([]);
  const [coachingLoading, setCoachingLoading] = useState(false);

  useEffect(() => {
    if (tab === "publications" && publications.length === 0) {
      setPubLoading(true);
      fetch("/api/publications")
        .then((r) => r.json())
        .then((data) => { setPublications(data); setPubLoading(false); })
        .catch(() => setPubLoading(false));
    }
    if (tab === "media" && media.length === 0) {
      setMediaLoading(true);
      fetch("/api/media")
        .then((r) => r.json())
        .then((data) => { setMedia(data); setMediaLoading(false); })
        .catch(() => setMediaLoading(false));
    }
    if (tab === "spiritual-coaching" && coachingItems.length === 0) {
      setCoachingLoading(true);
      fetch("/api/spiritual-coaching")
        .then((r) => r.json())
        .then((data) => { setCoachingItems(data); setCoachingLoading(false); })
        .catch(() => setCoachingLoading(false));
    }
  }, [tab, publications.length, media.length, coachingItems.length]);

  const filteredPublications =
    pubFilter === "ALL"
      ? publications
      : publications.filter((p) => p.type === pubFilter);

  const groupedMedia = media.reduce<Record<string, MediaItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal to-slate pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Scholarship & Thought
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Knowledge Production
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto mb-10">
            Scholarly publications, media appearances, and spiritual coaching offerings rooted in disability justice and intersectional feminism.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex flex-wrap justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-1.5 gap-1">
            <button
              onClick={() => setTab("publications")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "publications"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Publications
            </button>
            <button
              onClick={() => setTab("media")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "media"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0012 6.75zm-1.683 6.443l-.005.005-.006-.005.006-.005.005.005zm-.005 2.127l-.005-.006.005-.005.005.005-.005.006zm-2.116-.006l-.005.006-.006-.006.005-.005.006.005zm-.006-2.116l-.005-.005.006-.005.005.005-.006.005zM9.255 13.5l-.005.005-.006-.005.006-.005.005.005zm3.817 2.384l-.005.006-.006-.006.005-.005.006.005zm-.006-4.5l-.005-.005.006-.005.005.005-.006.005z" />
              </svg>
              Media
            </button>
            <button
              onClick={() => setTab("spiritual-coaching")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 ${
                tab === "spiritual-coaching"
                  ? "bg-gold text-white shadow-lg shadow-gold/30"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Spiritual Coaching
            </button>
          </div>
        </div>
      </section>

      {/* ── Publications Tab ── */}
      {tab === "publications" && (
        <section className="bg-cream-lightest py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {PUBLICATION_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPubFilter(t.key)}
                  className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                    pubFilter === t.key
                      ? "bg-teal text-white"
                      : "bg-white border border-cream text-slate hover:border-gold/30 hover:text-gold"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {pubLoading ? (
              <div className="text-center py-20 text-warm-gray font-body">Loading publications...</div>
            ) : filteredPublications.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray text-sm mb-4">No publications yet. Check back soon.</p>
                <p className="font-body text-warm-gray/60 text-xs">Publications can be added via the admin dashboard.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPublications.map((pub) => (
                  <article
                    key={pub.id}
                    className="bg-white rounded-2xl p-6 border border-cream hover:border-gold/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-body font-semibold uppercase tracking-wider rounded-full">
                            {getTypeLabel(pub.type)}
                          </span>
                          <span className="text-warm-gray font-body text-xs">{pub.year}</span>
                          {pub.publisher && (
                            <span className="text-warm-gray font-body text-xs italic">{pub.publisher}</span>
                          )}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-teal mb-2">{pub.title}</h3>
                        {pub.description && (
                          <p className="font-body text-slate text-sm leading-relaxed">{pub.description}</p>
                        )}
                        {pub.tags && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {pub.tags.split(",").map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-cream text-warm-gray text-xs font-body rounded-full">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {pub.link && (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-4 py-2 border border-gold text-gold font-body text-sm font-medium rounded-full hover:bg-gold hover:text-white transition-all duration-200"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Media Tab ── */}
      {tab === "media" && (
        <section className="bg-cream-lightest py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {mediaLoading ? (
              <div className="text-center py-20 text-warm-gray font-body">Loading media...</div>
            ) : media.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray text-sm mb-4">No media items yet. Check back soon.</p>
                <p className="font-body text-warm-gray/60 text-xs">Media can be added via the admin dashboard.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(MEDIA_CATEGORIES).map(([catKey, catLabel]) => {
                  const items = groupedMedia[catKey] || [];
                  if (items.length === 0) return null;

                  // ── Photo Gallery: album cards grouped by context/event ──
                  if (catKey === "PHOTO") {
                    // Group by source (context/event); photos with no source each get their own album
                    const albumMap = new Map<string, { source: string | null; date: string | null; photos: MediaItem[] }>();
                    items.forEach((photo) => {
                      const key = photo.source || `__solo__${photo.id}`;
                      if (!albumMap.has(key)) {
                        albumMap.set(key, { source: photo.source, date: photo.date, photos: [] });
                      }
                      albumMap.get(key)!.photos.push(photo);
                    });
                    const albums = Array.from(albumMap.values());

                    return (
                      <div key={catKey}>
                        <div className="flex items-end justify-between mb-6">
                          <div>
                            <h2 className="font-heading text-2xl font-bold text-teal">{catLabel}</h2>
                            <p className="font-body text-sm text-warm-gray mt-1">
                              {items.length} photo{items.length !== 1 ? "s" : ""} across {albums.length} album{albums.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {albums.map((album, i) => (
                            <PhotoAlbumCard
                              key={i}
                              albumName={album.source}
                              date={album.date}
                              photos={album.photos}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── Other categories: existing card layout ──
                  return (
                    <div key={catKey}>
                      <h2 className="font-heading text-2xl font-bold text-teal mb-6">{catLabel}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {items.map((item) => {
                          const thumbnail = (catKey === "INTERVIEW" || catKey === "VIDEO") ? getYouTubeThumbnail(item.url) : null;
                          return (
                            <article
                              key={item.id}
                              className="bg-white rounded-2xl overflow-hidden border border-cream hover:border-gold/30 hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                              {thumbnail && (
                                <a
                                  href={item.url!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative block aspect-video bg-slate/10 overflow-hidden group"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                      <svg className="w-6 h-6 text-teal ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </a>
                              )}
                              <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-4 flex-1">
                                  <div className="flex-1">
                                    <h3 className="font-heading text-base font-bold text-teal mb-2">{item.title}</h3>
                                    {item.description && (
                                      <p className="font-body text-slate text-sm leading-relaxed mb-2 line-clamp-2">{item.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                      {item.source && (
                                        <span className="text-warm-gray font-body text-xs">{item.source}</span>
                                      )}
                                      {item.date && (
                                        <span className="text-warm-gray font-body text-xs">{item.date}</span>
                                      )}
                                    </div>
                                  </div>
                                  {item.url && !thumbnail && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="shrink-0 px-3 py-1.5 border border-gold text-gold font-body text-xs font-medium rounded-full hover:bg-gold hover:text-white transition-all duration-200"
                                    >
                                      View →
                                    </a>
                                  )}
                                </div>
                                {item.url && thumbnail && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-1.5 text-gold font-body text-xs font-medium hover:underline"
                                  >
                                    {catKey === "VIDEO" ? "Watch Video →" : "Watch Interview →"}
                                  </a>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Spiritual Coaching Tab ── */}
      {tab === "spiritual-coaching" && (
        <section className="bg-cream-lightest py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-teal mb-4">
                Spiritual Coaching
              </h2>
              <div className="section-divider mx-auto mb-6" />
              <p className="font-body text-slate max-w-2xl mx-auto">
                Holistic coaching offerings that integrate spiritual practice, disability justice, and personal transformation.
              </p>
            </div>

            {coachingLoading ? (
              <div className="text-center py-20 text-warm-gray font-body">Loading offerings...</div>
            ) : coachingItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray text-sm mb-4">Spiritual coaching offerings coming soon.</p>
                <p className="font-body text-warm-gray/60 text-xs">In the meantime, explore coaching sessions in the Shop.</p>
                <Link
                  href="/shop"
                  className="inline-block mt-6 px-6 py-3 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
                >
                  Visit Shop
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coachingItems.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl p-8 border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-teal mb-3">{item.title}</h3>
                    {item.description && (
                      <p className="font-body text-slate text-sm leading-relaxed mb-4 flex-1">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-cream mt-auto">
                      <div>
                        {item.duration && (
                          <p className="font-body text-xs text-warm-gray">{item.duration}</p>
                        )}
                        {item.price && (
                          <p className="font-heading text-lg font-bold text-teal">{item.price}</p>
                        )}
                      </div>
                      <Link
                        href="/contact"
                        className="px-4 py-2 bg-gold text-white font-body text-sm font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
                      >
                        Inquire
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Want to Collaborate or Commission Research?
          </h2>
          <p className="font-body text-cream/70 mb-8">
            For research partnerships, commissioned work, or custom engagements, reach out directly.
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

export default function KnowledgeProductionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-lightest" />}>
      <KnowledgeProductionContent />
    </Suspense>
  );
}
