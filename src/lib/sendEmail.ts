import "server-only";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Faith Njahira <noreply@faithnjahira.com>";

export type EmailType =
  | "CONFIRMATION"
  | "DOWNLOAD"
  | "REMINDER"
  | "REFUND"
  | "INSTALLMENT_FAILED"
  | "COACHING";

// These types are sent at most once per order — duplicate sends are silently skipped.
const IDEMPOTENT_TYPES: EmailType[] = [
  "CONFIRMATION",
  "DOWNLOAD",
  "COACHING",
  "REFUND",
];

export interface EmailAttachment {
  filename: string;
  content: string; // base64
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  orderId?: string;
  emailType: EmailType;
}

/**
 * Send a transactional email via Resend and log the outcome in EmailLog.
 *
 * Idempotency: for CONFIRMATION / DOWNLOAD / COACHING / REFUND types, if a
 * SENT record already exists for the same (type, orderId), the call is a
 * no-op so webhook retries cannot trigger duplicate emails.
 *
 * Throws on Resend failure after recording the FAILED log so callers can
 * decide whether to surface the error.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const { to, subject, html, attachments, orderId, emailType } = opts;

  if (!to || !subject || !html) {
    throw new Error("[sendEmail] Missing required fields: to, subject, html");
  }

  // Idempotency guard
  if (orderId && IDEMPOTENT_TYPES.includes(emailType)) {
    const alreadySent = await prisma.emailLog.findFirst({
      where: { type: emailType, orderId, status: "SENT" },
      select: { id: true },
    });
    if (alreadySent) {
      console.log(
        `[email] Skipping duplicate ${emailType} for order ${orderId} — already sent (log ${alreadySent.id})`
      );
      return;
    }
  }

  // Create PENDING log before attempting send
  const log = await prisma.emailLog.create({
    data: {
      type: emailType,
      orderId: orderId ?? null,
      to,
      subject,
      status: "PENDING",
    },
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      attachments,
    });

    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "SENT",
        resendId: result.data?.id ?? null,
        sentAt: new Date(),
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(
      `[email] Failed to send ${emailType} to ${to} (order ${orderId ?? "none"}):`,
      errorMsg
    );
    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        error: errorMsg.slice(0, 500),
      },
    });
    throw err; // re-throw so calling webhook can log/handle
  }
}
