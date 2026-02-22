"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RegistrationData {
  order: {
    id: string;
    name: string;
    email: string;
    productName: string;
    amount: number;
    currency: string;
  };
  event: {
    title: string;
    meetingLink: string | null;
    meetingDetails: string | null;
    sessions: {
      sessionNumber: number;
      title: string | null;
      startTime: string;
      endTime: string | null;
      timezone: string;
    }[];
  };
  tier: { name: string };
  seatCount: number;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/events/registration?orderId=${ref}`);
        if (res.ok) setData(await res.json());
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ref]);

  if (loading) {
    return <div className="text-center font-body text-warm-gray">Loading your registration...</div>;
  }

  return (
    <div className="max-w-lg mx-auto px-6">
      <div className="bg-white rounded-2xl border border-cream p-8 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="font-heading text-2xl font-bold text-teal mb-2">
          You&apos;re registered!
        </h1>

        {data ? (
          <>
            <p className="font-body text-warm-gray mb-6">
              Thank you, <strong>{data.order.name}</strong>. Your spot for{" "}
              <strong>{data.event.title}</strong> ({data.tier.name}) is confirmed.
              A confirmation email with your calendar invite has been sent to{" "}
              <strong>{data.order.email}</strong>.
            </p>

            {/* Zoom link */}
            {data.event.meetingLink && (
              <div className="bg-teal/5 rounded-xl p-4 mb-6 text-left">
                <p className="font-body text-sm font-medium text-teal mb-1">Join Link</p>
                <a
                  href={data.event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-gold hover:underline break-all"
                >
                  {data.event.meetingLink}
                </a>
                {data.event.meetingDetails && (
                  <p className="font-body text-xs text-warm-gray mt-1">{data.event.meetingDetails}</p>
                )}
              </div>
            )}

            {/* Sessions */}
            {data.event.sessions.length > 0 && (
              <div className="text-left mb-6">
                <p className="font-body text-sm font-medium text-slate mb-2">Session Schedule</p>
                <ul className="space-y-2">
                  {data.event.sessions.map((s) => (
                    <li key={s.sessionNumber} className="font-body text-sm text-warm-gray flex gap-2">
                      <span className="text-teal font-medium">{s.sessionNumber}.</span>
                      <span>
                        {s.title ? `${s.title} — ` : ""}
                        {new Date(s.startTime).toLocaleString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })} UTC
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="font-body text-xs text-warm-gray mb-6">
              Order ref: {ref}
            </p>
          </>
        ) : (
          <p className="font-body text-warm-gray mb-6">
            Your payment has been received. Check your email for confirmation details.
            {ref && <span className="block mt-2 text-xs">Ref: {ref}</span>}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/events"
            className="px-6 py-3 bg-gold text-white font-body font-medium rounded-xl hover:bg-gold-dark transition-colors"
          >
            Browse More Events
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-200 text-slate font-body font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
