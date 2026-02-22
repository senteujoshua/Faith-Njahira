"use client";

import { useEffect, useState } from "react";

interface Props {
  tierId: string;
  initialSeatsRemaining: number | null;
  initialSaleClosed: boolean;
}

export default function EventSeatCounter({
  tierId,
  initialSeatsRemaining,
  initialSaleClosed,
}: Props) {
  const [seatsRemaining, setSeatsRemaining] = useState(initialSeatsRemaining);
  const [isSaleClosed, setIsSaleClosed] = useState(initialSaleClosed);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/event/seats?tierId=${tierId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setSeatsRemaining(data.seatsRemaining);
          setIsSaleClosed(data.isSaleClosed);
        }
      } catch {
        // silent
      }
    };

    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [tierId]);

  if (isSaleClosed) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-red-100 text-red-700">
        Sold Out
      </span>
    );
  }

  if (seatsRemaining === null) {
    return null; // unlimited, show nothing
  }

  if (seatsRemaining <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-red-100 text-red-700">
        Sold Out
      </span>
    );
  }

  if (seatsRemaining <= 10) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-amber-100 text-amber-700">
        {seatsRemaining} seats left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-green-100 text-green-700">
      {seatsRemaining} seats available
    </span>
  );
}
