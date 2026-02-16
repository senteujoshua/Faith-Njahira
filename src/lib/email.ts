import { Resend } from "resend";

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
