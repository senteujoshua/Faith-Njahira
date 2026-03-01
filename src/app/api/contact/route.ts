import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM_EMAIL } from "@/lib/sendEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const FAITH_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || process.env.EMAIL_REPLY_TO || "senteujoshua@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string;
      email?: string;
      org?: string;
      subject?: string;
      message?: string;
    };

    const { name, email, org, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const subjectLabels: Record<string, string> = {
      consulting: "Consulting Inquiry",
      speaking: "Speaking Engagement",
      academic: "Academic Collaboration",
      media: "Media / Press Request",
      mentorship: "Mentorship / Coaching",
      general: "General Inquiry",
    };

    const subjectLabel = subjectLabels[subject] ?? subject;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: FAITH_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subjectLabel} — ${name}`,
      html: `
        <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 20px;">
          <h2 style="color:#1B2A2A;font-size:20px;margin-bottom:4px;">New Contact Message</h2>
          <p style="color:#A79E9C;font-size:13px;margin-bottom:24px;">${subjectLabel}</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 12px;background:#f9f7f4;font-weight:bold;color:#1B2A2A;width:120px;border:1px solid #EDE7E0;">Name</td>
              <td style="padding:8px 12px;color:#3D4D55;border:1px solid #EDE7E0;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f9f7f4;font-weight:bold;color:#1B2A2A;border:1px solid #EDE7E0;">Email</td>
              <td style="padding:8px 12px;color:#3D4D55;border:1px solid #EDE7E0;"><a href="mailto:${email}" style="color:#B58863;">${email}</a></td>
            </tr>
            ${org ? `<tr>
              <td style="padding:8px 12px;background:#f9f7f4;font-weight:bold;color:#1B2A2A;border:1px solid #EDE7E0;">Organization</td>
              <td style="padding:8px 12px;color:#3D4D55;border:1px solid #EDE7E0;">${org}</td>
            </tr>` : ""}
          </table>
          <div style="background:#f9f7f4;border:1px solid #EDE7E0;border-radius:8px;padding:16px;">
            <p style="color:#1B2A2A;font-weight:bold;margin:0 0 8px;">Message</p>
            <p style="color:#3D4D55;margin:0;white-space:pre-line;">${message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #EDE7E0;margin:30px 0;" />
          <p style="color:#A79E9C;font-size:12px;">Sent via faithnjahira.com contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
