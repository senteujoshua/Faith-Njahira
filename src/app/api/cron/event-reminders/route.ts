import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEventReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hrs from now
  const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);   // 25 hrs from now

  // Find sessions starting in the 23–25hr window
  const upcomingSessions = await prisma.eventSession.findMany({
    where: {
      startTime: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      event: true,
    },
  });

  if (upcomingSessions.length === 0) {
    return NextResponse.json({ sent: 0, message: "No sessions in window" });
  }

  const eventIds = [...new Set(upcomingSessions.map((s) => s.eventId))];

  // Find registrations that haven't received a reminder yet, for PAID orders
  const registrations = await prisma.eventRegistration.findMany({
    where: {
      eventId: { in: eventIds },
      reminderSent: false,
      order: { status: "PAID" },
    },
    include: {
      order: { select: { id: true, email: true, name: true } },
      event: { select: { title: true, meetingLink: true } },
    },
  });

  let sentCount = 0;
  const errors: string[] = [];

  for (const reg of registrations) {
    // Find the specific session(s) for this event
    const eventSessions = upcomingSessions.filter((s) => s.eventId === reg.eventId);
    if (eventSessions.length === 0) continue;

    // Send one reminder per session
    for (const session of eventSessions) {
      try {
        await sendEventReminderEmail({
          to: reg.order.email,
          name: reg.order.name,
          eventTitle: reg.event.title,
          session: {
            sessionNumber: session.sessionNumber,
            title: session.title,
            startTime: session.startTime,
            endTime: session.endTime,
            timezone: session.timezone,
          },
          meetingLink: reg.event.meetingLink,
          orderId: reg.orderId,
        });
        sentCount++;
      } catch (err) {
        errors.push(`Failed for ${reg.order.email}: ${err}`);
      }
    }

    // Mark reminder as sent
    await prisma.eventRegistration.update({
      where: { id: reg.id },
      data: { reminderSent: true, reminderSentAt: now },
    });
  }

  return NextResponse.json({
    sent: sentCount,
    registrations: registrations.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
