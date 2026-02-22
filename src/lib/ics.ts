/**
 * RFC 5545 iCalendar generator — no npm dependency.
 * Produces a single .ics with one VEVENT per session.
 */

interface ICSSession {
  sessionNumber?: number;
  title?: string | null;
  startTime: Date | string;
  endTime?: Date | string | null;
  timezone?: string;
  description?: string;
  location?: string;
  url?: string;
}

function formatDT(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  // RFC 5545: lines > 75 octets should be folded
  const result: string[] = [];
  let remaining = line;
  while (remaining.length > 75) {
    result.push(remaining.slice(0, 75));
    remaining = " " + remaining.slice(75);
  }
  result.push(remaining);
  return result.join("\r\n");
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@faithnjahira.com`;
}

export function generateICS(
  eventTitle: string,
  sessions: ICSSession[],
  organizer?: string
): string {
  const now = formatDT(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Faith Njahira//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(eventTitle)}`,
    "X-WR-TIMEZONE:UTC",
  ];

  for (const session of sessions) {
    const start = new Date(session.startTime);
    const end = session.endTime
      ? new Date(session.endTime)
      : new Date(start.getTime() + 60 * 60 * 1000); // default 1hr

    const summary = session.title
      ? escapeText(`${eventTitle}: ${session.title}`)
      : escapeText(
          sessions.length > 1
            ? `${eventTitle} — Session ${session.sessionNumber ?? 1}`
            : eventTitle
        );

    const descParts: string[] = [];
    if (session.description) descParts.push(session.description);
    if (session.url) descParts.push(`Join: ${session.url}`);
    const description = descParts.map(escapeText).join("\\n\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid()}`);
    lines.push(`DTSTAMP:${now}Z`);
    lines.push(`DTSTART:${formatDT(start)}Z`);
    lines.push(`DTEND:${formatDT(end)}Z`);
    lines.push(foldLine(`SUMMARY:${summary}`));
    if (description) lines.push(foldLine(`DESCRIPTION:${description}`));
    if (session.location) lines.push(foldLine(`LOCATION:${escapeText(session.location)}`));
    if (session.url) lines.push(foldLine(`URL:${session.url}`));
    if (organizer) lines.push(foldLine(`ORGANIZER;CN=${escapeText(organizer)}:mailto:noreply@faithnjahira.com`));
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function generateICSBase64(
  eventTitle: string,
  sessions: ICSSession[],
  organizer?: string
): string {
  const icsContent = generateICS(eventTitle, sessions, organizer);
  return Buffer.from(icsContent, "utf-8").toString("base64");
}
