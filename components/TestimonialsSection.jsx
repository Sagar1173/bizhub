"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { franchiseLocations } from "@/constants/franchise-data";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function franchiseToSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael Chen",
      date: "2024-10-09",
      text: "Outstanding guidance through our franchise purchase. The team helped us evaluate multiple opportunities and find the right fit for our investment goals. Professional, knowledgeable, and genuinely invested in our success.",
      initial: "M",
    },
    {
      name: "Sarah Miller",
      date: "2024-10-08",
      text: "We were exploring business ownership for months. The market knowledge and connections here made all the difference. They matched us with the perfect franchise opportunity and supported us every step of the way.",
      initial: "S",
    },
    {
      name: "Priya Roy",
      date: "2024-09-28",
      text: "From initial consultation to closing, the experience was seamless. They understood our budget, timeline, and vision. We're now proud franchise owners thanks to their expertise and dedication.",
      initial: "P",
    },
  ];

  const franchises =
    franchiseLocations?.ontario?.franchises?.slice(0, 9) ?? [];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="mb-6 text-center sm:mb-10 md:mb-14">
            <h2 className="text-2xl font-serif text-slate-900 uppercase tracking-tight sm:text-3xl md:text-4xl">
              What our clients are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="flex h-full flex-col rounded-xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm backdrop-blur sm:rounded-2xl sm:p-6 md:p-8"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                      {t.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {t.name}
                      </h4>
                      <time
                        dateTime={t.date}
                        className="text-xs text-slate-500"
                      >
                        {formatDate(t.date)}
                      </time>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-0.5" aria-hidden>
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-slate-400 text-slate-400"
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </article>
            ))}
          </div>
        </div>

        {/* Franchise List - Image-on-top Cards */}
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between md:mb-8">
            <h2 className="text-xl font-serif text-slate-900 tracking-tight sm:text-2xl md:text-3xl">
              Featured franchise opportunities
            </h2>
            <Link
              href="/franchise-opportunity/ontario"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:self-auto"
            >
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
            {franchises.map((franchise) => {
              const slug = franchiseToSlug(franchise.name);
              const href = `/franchise-opportunity/ontario/${slug}`;

              return (
                <Link
                  key={franchise.name}
                  href={href}
                  className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 sm:rounded-2xl active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-200 md:hover:-translate-y-1"
                >
                  {/* Image - Bigger */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {franchise.image ? (
                      <img
                        src={franchise.image}
                        alt={franchise.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <span className="text-4xl font-bold">
                          {franchise.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Text below image */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-slate-700 line-clamp-2 text-base sm:text-lg">
                      {franchise.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {franchise.type}
                    </p>
                    {franchise.investment && (
                      <p className="mt-2 text-xs font-medium text-slate-700 sm:text-sm">
                        {franchise.investment}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
