import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Faith Njah\u0129ra Wangar\u01D0 \u2014 Disability Studies Scholar & Inclusion Specialist",
    template: "%s | Faith Njah\u0129ra Wangar\u01D0",
  },
  description:
    "Disability studies scholar, global disability consultant, and inclusion specialist. Founder of Zaidi ya Misuli Resource Centre. MSc Syracuse University.",
  keywords: [
    "disability studies",
    "disability inclusion",
    "disability consultant",
    "scholar",
    "muscular dystrophy",
    "disability rights",
    "Kenya",
    "Africa",
    "special needs education",
    "inclusive education",
  ],
  openGraph: {
    title: "Faith Njah\u0129ra Wangar\u01D0 \u2014 Disability Studies Scholar & Inclusion Specialist",
    description:
      "Disability studies scholar, global disability consultant, and inclusion specialist.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
