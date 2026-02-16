"use client";

import { useEffect, useRef } from "react";

type CalendlyEmbedProps = {
  url: string;
};

export default function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget rounded-2xl overflow-hidden"
      data-url={url}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
