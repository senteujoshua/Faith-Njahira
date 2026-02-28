import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type EventWithTiersAndSessions = Prisma.EventGetPayload<{
  include: {
    tiers: true;
    sessions: true;
  };
}>;

export const revalidate = 60;

export default async function EventsPage() {
  const events = (await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      tiers: { orderBy: { order: "asc" } },
      sessions: {
        orderBy: { sessionNumber: "asc" },
        take: 1,
      },
    },
  })) as EventWithTiersAndSessions[];

  return (
    <main className="min-h-screen bg-cream-lightest pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-teal mb-4">
            Coaching Sessions
          </h1>
          <p className="font-body text-lg text-warm-gray max-w-2xl">
            Join Faith Njahira for transformative coaching, workshops, and programmes.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 text-warm-gray font-body">
            No upcoming events at this time. Check back soon.
          </div>
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
                    <h2 className="font-heading text-xl font-bold text-teal mb-2 group-hover:text-gold transition-colors">
                      {event.title}
                    </h2>
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
    </main>
  );
}
