"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Njahira" },
  { href: "/knowledge-production", label: "Knowledge Production" },
  { href: "/my-work", label: "My Work" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream-lightest/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-heading text-xl lg:text-2xl font-bold text-teal tracking-tight">
              Faith Njah&icirc;ra
            </span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gold font-body font-medium mt-[-2px]">
              Scholar &middot; Consultant &middot; Researcher
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-gold"
                    : "text-slate hover:text-gold"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/my-work"
              className="ml-4 px-6 py-2.5 bg-gold text-white text-sm font-body font-medium tracking-wide rounded-full hover:bg-gold-dark transition-colors duration-200"
            >
              Work With Me
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-teal"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-cream-lightest/98 backdrop-blur-md border-t border-cream px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 text-base font-body font-medium rounded-lg transition-colors duration-200 ${
                pathname === link.href
                  ? "text-gold bg-cream/50"
                  : "text-slate hover:text-gold hover:bg-cream/30"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/my-work"
              className="block text-center px-6 py-3 bg-gold text-white font-body font-medium rounded-full hover:bg-gold-dark transition-colors duration-200"
            >
              Work With Me
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
