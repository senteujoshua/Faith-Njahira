"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal";

type Book = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceKES: number;
  coverImage: string;
  publisher: string;
  year: string;
  format: string;
};

const books: Book[] = [
  {
    id: "crip-genealogies",
    title: "Can I Call My Kenyan Education Inclusive?",
    description:
      "A chapter in Crip Genealogies, exploring the intersections of disability and education in Kenya through personal narrative and critical analysis. This work interrogates what inclusion means in Kenyan educational contexts and challenges dominant narratives of disability.",
    price: 15.0,
    priceKES: 2000,
    coverImage: "/book-cover-crip-genealogies.jpg",
    publisher: "Duke University Press",
    year: "2023",
    format: "Digital PDF",
  },
  {
    id: "ngano-cia-marimbu",
    title: "Ng\u2019ano cia marim\u016b\u2026",
    description:
      "A chapter in Activating Arts to Understand Disability in Africa, examining disability through arts-based methodologies and cultural storytelling traditions. Explores the power of narrative and creative expression in disability scholarship.",
    price: 18.0,
    priceKES: 2400,
    coverImage: "/book-cover-ngano.jpg",
    publisher: "Routledge",
    year: "2025",
    format: "Digital PDF",
  },
];

export default function ShopPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCheckout = (book: Book) => {
    setSelectedBook(book);
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-slate pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Bookshop
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Books &amp; Publications
          </h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">
            Digital editions of published works on disability justice,
            intersectionality, and inclusive futures in Africa.
          </p>
        </div>
      </section>

      {/* Book Grid */}
      <section className="bg-cream-lightest py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {books.map((book) => (
              <article
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden border border-cream hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="aspect-[3/2] bg-gradient-to-br from-teal/10 to-cream relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-teal/10 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-teal/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                      <p className="font-body text-sm text-teal/50">
                        {book.publisher}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-cream-lightest text-gold text-xs font-body font-semibold uppercase tracking-wider rounded-full">
                      {book.format}
                    </span>
                    <span className="text-warm-gray font-body text-xs">
                      {book.year}
                    </span>
                  </div>

                  <h2 className="font-heading text-xl font-bold text-teal mb-3">
                    {book.title}
                  </h2>

                  <p className="font-body text-slate text-sm leading-relaxed mb-2">
                    {book.description}
                  </p>

                  <p className="font-body text-warm-gray text-sm italic mb-6">
                    {book.publisher}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-2xl font-bold text-teal">
                        ${book.price.toFixed(2)}
                      </p>
                      <p className="font-body text-xs text-warm-gray">
                        KES {book.priceKES.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => openCheckout(book)}
                      className="px-6 py-3 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-teal mb-2">
                Instant Download
              </h3>
              <p className="font-body text-sm text-slate">
                Receive your digital copy immediately after payment via email.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-teal mb-2">
                Flexible Payments
              </h3>
              <p className="font-body text-sm text-slate">
                Pay with card (global) or M-Pesa (Kenya). No account needed.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-teal mb-2">
                Secure & Private
              </h3>
              <p className="font-body text-sm text-slate">
                Payments processed securely through Stripe and IntaSend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Looking for Coaching?
          </h2>
          <p className="font-body text-cream/70 mb-8">
            Book a one-on-one coaching session — free discovery calls and paid
            deep-dive sessions available.
          </p>
          <Link
            href="/coaching"
            className="inline-block px-8 py-4 bg-gold text-white font-body font-semibold rounded-full hover:bg-gold-dark transition-all duration-300"
          >
            View Coaching Sessions
          </Link>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedBook && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => {
            setCheckoutOpen(false);
            setSelectedBook(null);
          }}
          product={{
            name: selectedBook.title,
            price: selectedBook.price,
            priceKES: selectedBook.priceKES,
            type: "BOOK",
          }}
        />
      )}
    </>
  );
}
