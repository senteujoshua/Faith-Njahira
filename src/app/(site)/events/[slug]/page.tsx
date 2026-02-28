import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type EventWithTiersAndSessions = Prisma.EventGetPayload<{
  include: {
    tiers: true;
    sessions: true;
  };
}>;
import EventDetailClient from "./EventDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug, isActive: true } });
  if (!event) return {};
  return { title: `${event.title} | Faith Njahira` };
}

export const revalidate = 60;

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const event = (await prisma.event.findUnique({
    where: { slug, isActive: true },
    include: {
      tiers: { orderBy: { order: "asc" } },
      sessions: { orderBy: { sessionNumber: "asc" } },
    },
  })) as EventWithTiersAndSessions | null;

  if (!event) notFound();

  const tiersWithSeats = event.tiers.map((tier) => ({
    ...tier,
    seatsRemaining:
      tier.quantityAvailable === 0
        ? null
        : Math.max(0, tier.quantityAvailable - tier.soldCount),
  }));

  // Exclude meetingLink from public page — only revealed after payment
  const { meetingLink: _meetingLink, meetingDetails: _meetingDetails, ...publicEvent } = event;

  return <EventDetailClient event={{ ...publicEvent, tiers: tiersWithSeats, hasMeetingLink: !!event.meetingLink }} />;
}
