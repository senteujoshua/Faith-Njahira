import { Resend } from "resend";
import { generateICSBase64 } from "./ics";

const resend = new Resend(process.env.RESEND_API_KEY);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const fromEmail = "Faith Njahira <noreply@faithnjahira.com>";

export async function sendDownloadEmail(
  to: string,
  name: string,
  productName: string,
  downloadToken: string
) {
  const downloadUrl = `${siteUrl}/api/download/${downloadToken}`;

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Your download: ${productName}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1B2A2A; font-size: 24px;">Thank you, ${name}!</h1>
        <p style="color: #3D4D55; font-size: 16px; line-height: 1.6;">
          Your purchase of <strong>${productName}</strong> is confirmed.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${downloadUrl}"
             style="background-color: #B58863; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
            Download Your Book
          </a>
        </div>
        <p style="color: #A79E9C; font-size: 14px;">
          This download link is valid for 72 hours. If it expires, visit our website to request a new link.
        </p>
        <hr style="border: none; border-top: 1px solid #EDE7E0; margin: 30px 0;" />
        <p style="color: #A79E9C; font-size: 12px;">
          Faith Njahira Wangar\u012b &mdash; faithnjahira.com
        </p>
      </div>
    `,
  });
}

export async function sendCoachingConfirmationEmail(
  to: string,
  name: string,
  sessionName: string,
  calendlyUrl: string
) {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Booking confirmed: ${sessionName}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1B2A2A; font-size: 24px;">Thank you, ${name}!</h1>
        <p style="color: #3D4D55; font-size: 16px; line-height: 1.6;">
          Your payment for <strong>${sessionName}</strong> has been confirmed.
          Please use the link below to schedule your session.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${calendlyUrl}"
             style="background-color: #B58863; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
            Schedule Your Session
          </a>
        </div>
        <p style="color: #A79E9C; font-size: 14px;">
          If you have any questions, feel free to reply to this email.
        </p>
        <hr style="border: none; border-top: 1px solid #EDE7E0; margin: 30px 0;" />
        <p style="color: #A79E9C; font-size: 12px;">
          Faith Njahira Wangar\u012b &mdash; faithnjahira.com
        </p>
      </div>
    `,
  });
}

interface EventSession {
  sessionNumber: number;
  title?: string | null;
  startTime: Date | string;
  endTime?: Date | string | null;
  timezone?: string;
}

export async function sendEventConfirmationEmail(params: {
  to: string;
  name: string;
  eventTitle: string;
  tierName: string;
  seatCount: number;
  orderRef: string;
  meetingLink?: string | null;
  meetingDetails?: string | null;
  sessions: EventSession[];
}) {
  const {
    to, name, eventTitle, tierName, seatCount, orderRef,
    meetingLink, meetingDetails, sessions,
  } = params;

  const icsBase64 = generateICSBase64(
    eventTitle,
    sessions.map((s) => ({
      sessionNumber: s.sessionNumber,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      description: meetingLink ? `Join: ${meetingLink}` : undefined,
      url: meetingLink || undefined,
    })),
    "Faith Njahira"
  );

  const sessionsHtml = sessions
    .map((s) => {
      const start = new Date(s.startTime);
      const label = s.title
        ? `Session ${s.sessionNumber}: ${s.title}`
        : sessions.length > 1
        ? `Session ${s.sessionNumber}`
        : eventTitle;
      return `<li style="margin-bottom:6px;color:#3D4D55;">${label} — ${start.toUTCString()}</li>`;
    })
    .join("");

  const meetingSection = meetingLink
    ? `<div style="margin:24px 0;padding:16px;background:#f0f7f7;border-radius:8px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#1B2A2A;">Meeting Link</p>
        <a href="${meetingLink}" style="color:#B58863;word-break:break-all;">${meetingLink}</a>
        ${meetingDetails ? `<p style="margin:8px 0 0;color:#3D4D55;font-size:14px;">${meetingDetails}</p>` : ""}
      </div>`
    : "";

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Registration confirmed: ${eventTitle}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#1B2A2A;font-size:24px;">You're registered, ${name}!</h1>
        <p style="color:#3D4D55;font-size:16px;line-height:1.6;">
          Your registration for <strong>${eventTitle}</strong> (${tierName}) is confirmed.
          ${seatCount > 1 ? `<br/>Seats: ${seatCount}` : ""}
        </p>
        ${meetingSection}
        <div style="margin:24px 0;">
          <p style="font-weight:bold;color:#1B2A2A;margin-bottom:8px;">Session Schedule</p>
          <ul style="padding-left:20px;">${sessionsHtml}</ul>
        </div>
        <p style="color:#A79E9C;font-size:13px;">Order reference: ${orderRef}</p>
        <p style="color:#A79E9C;font-size:13px;">A calendar invite is attached (.ics file).</p>
        <hr style="border:none;border-top:1px solid #EDE7E0;margin:30px 0;" />
        <p style="color:#A79E9C;font-size:12px;">Faith Njahira Wangar\u012b &mdash; faithnjahira.com</p>
      </div>
    `,
    attachments: [
      {
        filename: `${eventTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`,
        content: icsBase64,
      },
    ],
  });
}

export async function sendInstallmentFailedEmail(
  to: string,
  name: string,
  productName: string,
  paidCount: number,
  totalCount: number
) {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Payment failed: ${productName}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#1B2A2A;font-size:24px;">Payment Failed, ${name}</h1>
        <p style="color:#3D4D55;font-size:16px;line-height:1.6;">
          We were unable to process your installment payment for <strong>${productName}</strong>.
        </p>
        <p style="color:#3D4D55;font-size:15px;">
          You have paid <strong>${paidCount}</strong> of <strong>${totalCount}</strong> installments.
        </p>
        <p style="color:#3D4D55;font-size:15px;">
          Stripe will automatically retry the payment. Please ensure your payment method is up to date.
        </p>
        <p style="color:#A79E9C;font-size:14px;">
          If you have questions, reply to this email or contact us at contact@faithnjahira.com.
        </p>
        <hr style="border:none;border-top:1px solid #EDE7E0;margin:30px 0;" />
        <p style="color:#A79E9C;font-size:12px;">Faith Njahira Wangar\u012b &mdash; faithnjahira.com</p>
      </div>
    `,
  });
}

export async function sendRefundEmail(
  to: string,
  name: string,
  productName: string,
  amount: number,
  currency: string
) {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Refund processed: ${productName}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#1B2A2A;font-size:24px;">Refund Confirmed, ${name}</h1>
        <p style="color:#3D4D55;font-size:16px;line-height:1.6;">
          Your refund for <strong>${productName}</strong> has been processed.
        </p>
        <p style="color:#3D4D55;font-size:15px;">
          <strong>Refund amount:</strong> ${currency} ${amount.toFixed(2)}
        </p>
        <p style="color:#A79E9C;font-size:14px;">
          Please allow 5–10 business days for the refund to appear on your statement.
        </p>
        <hr style="border:none;border-top:1px solid #EDE7E0;margin:30px 0;" />
        <p style="color:#A79E9C;font-size:12px;">Faith Njahira Wangar\u012b &mdash; faithnjahira.com</p>
      </div>
    `,
  });
}

export async function sendEventReminderEmail(params: {
  to: string;
  name: string;
  eventTitle: string;
  session: EventSession;
  meetingLink?: string | null;
}) {
  const { to, name, eventTitle, session, meetingLink } = params;
  const start = new Date(session.startTime);
  const label = session.title
    ? `Session ${session.sessionNumber}: ${session.title}`
    : eventTitle;

  const meetingSection = meetingLink
    ? `<div style="margin:24px 0;padding:16px;background:#f0f7f7;border-radius:8px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#1B2A2A;">Join Link</p>
        <a href="${meetingLink}" style="color:#B58863;word-break:break-all;">${meetingLink}</a>
      </div>`
    : "";

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Reminder: ${eventTitle} starts tomorrow`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#1B2A2A;font-size:24px;">See you tomorrow, ${name}!</h1>
        <p style="color:#3D4D55;font-size:16px;line-height:1.6;">
          This is a reminder that <strong>${label}</strong> starts in approximately 24 hours.
        </p>
        <p style="color:#3D4D55;font-size:15px;"><strong>When:</strong> ${start.toUTCString()}</p>
        ${meetingSection}
        <hr style="border:none;border-top:1px solid #EDE7E0;margin:30px 0;" />
        <p style="color:#A79E9C;font-size:12px;">Faith Njahira Wangar\u012b &mdash; faithnjahira.com</p>
      </div>
    `,
  });
}
