"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { franchiseLocations } from "@/constants/franchise-data";


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
      name: "Ali Pirzada",
      location: "Hamilton, ON",
      service: "Sold Store (March 2026)",
      text: "Grateful for support during a complex, 9-month franchise deal for a Mary Brown’s store.",
      initial: "A",
      bgColor: "bg-blue-100 text-blue-700",
    },
    {
      name: "Saravdeep Sethi",
      location: "North York, ON",
      service: "Rent Commercial (Feb 2026)",
      text: "Excellent experience securing the right commercial space; noted Ravi was patient and knowledgeable.",
      initial: "S",
      bgColor: "bg-rose-100 text-rose-700",
    },
    {
      name: "Asha Patel",
      location: "Lindsay, ON",
      service: "Buy Home (May 2025)",
      text: "Very familiar and helpful in finding a \"dream home\" and assisting with upgrades.",
      initial: "A",
      bgColor: "bg-amber-100 text-amber-700",
    },
    {
      name: "Mahmed Vazifdar",
      location: "Scarborough, ON",
      service: "Buy Home (July 2025)",
      text: "Highly rated service (5 stars).",
      initial: "M",
      bgColor: "bg-emerald-100 text-emerald-700",
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

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="flex h-full flex-col rounded-xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm backdrop-blur sm:rounded-2xl sm:p-6"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${t.bgColor} text-base font-bold shadow-sm transition-transform hover:scale-105`}
                    >
                      {t.initial}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[15px] font-bold text-slate-900 leading-none mb-1.5">
                        {t.name}
                      </h4>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        {t.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5" aria-hidden>
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {t.service}
                  </p>
                </div>

                <blockquote className="flex-1 text-sm leading-relaxed text-slate-600 italic">
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
