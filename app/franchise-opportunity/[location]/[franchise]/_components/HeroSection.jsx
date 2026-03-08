"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const QUICK_CITIES = [
  { label: "Ontario", slug: "ontario" },
  { label: "Toronto", slug: "toronto" },
  { label: "Ottawa", slug: "ottawa" },
  { label: "Hamilton", slug: "hamilton" },
  { label: "Mississauga", slug: "mississauga" },
  { label: "Brampton", slug: "brampton" },
  { label: "London", slug: "london" },
  { label: "Kitchener", slug: "kitchener" },
  { label: "Burlington", slug: "burlington" },
  { label: "Oakville", slug: "oakville" },
];

const HeroSection = ({ franchiseData, location }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const locationText = location
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(
        `/franchise-opportunity/${location}?q=${encodeURIComponent(q)}`,
      );
    } else {
      router.push(`/franchise-opportunity/${location}`);
    }
  };

  return (
    <div className="relative overflow-hidden">


      {/* Breadcrumb */}
      <div className="relative pt-6 pb-6">
        <nav
          className="flex items-center gap-2 text-sm text-slate-600"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/franchise-opportunity/ontario"
            className="hover:text-slate-900 transition-colors"
          >
            Franchises
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/franchise-opportunity/${location.replaceAll(" ", "-")}`}
            className="hover:text-slate-900 transition-colors"
          >
            {location === "ontario" ? "Ontario" : locationText}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-900 font-medium">
            {franchiseData.name}
          </span>
        </nav>
      </div>

      {/* Franchise intro card */}
      <div className="relative pb-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:min-h-[340px]">
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 open-sans leading-tight">
                {franchiseData.name} — Franchise in {locationText}
              </h2>
              <div className="relative h-48 rounded-xl overflow-hidden block md:hidden mb-4">
                {franchiseData.image && (
                  <img
                    src={franchiseData.image}
                    alt={franchiseData.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {franchiseData.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Learn More
                </Link>
                {franchiseData.brochure && (
                  <a
                    href={franchiseData.brochure}
                    download
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 text-slate-800 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Download Brochure
                  </a>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 hidden md:block relative min-h-[280px] order-1 md:order-2">
              {franchiseData.image && (
                <img
                  src={franchiseData.image}
                  alt={franchiseData.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Content sections */}
          <div className="p-4 md:p-8 pt-0 md:pt-0 space-y-10">
            <section className="flex flex-col items-start text-left py-6 md:py-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Why Choose {franchiseData?.name}
              </h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 max-w-2xl text-left">
                {franchiseData.specialities?.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-slate-600 text-sm"
                  >
                    <span className="text-blue-600 mt-0.5 shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-slate-50/80 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 text-left">
                Investment Details
              </h3>
              <div className="flex flex-col sm:flex-row sm:justify-start gap-4 sm:gap-16 text-left">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Investment Range
                  </p>
                  <p className="font-semibold text-slate-900">
                    {franchiseData.investment}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Type
                  </p>
                  <p className="font-semibold text-slate-900">
                    {franchiseData.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Location
                  </p>
                  <p className="font-semibold text-slate-900">
                    {franchiseData.locations}
                  </p>
                </div>
              </div>
            </section>

            {franchiseData.financing && (
              <section className="pt-4">
                <h3 className="text-left uppercase text-lg font-bold text-slate-800 mb-4">
                  Financial Requirements
                </h3>
                <div className="flex flex-wrap justify-start gap-4 sm:gap-6">
                  {Object.entries(franchiseData.financing).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col items-center min-w-[120px] py-3 px-4 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-left">
                          {key}
                        </p>
                        <p className="text-sm font-medium text-slate-900 text-left mt-1">
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {franchiseData.stats && (
              <section className="py-6 border-t border-slate-100">
                <h3 className="text-left uppercase text-lg font-bold text-slate-800 mb-4">
                  Key Stats
                </h3>
                <div className="flex flex-col sm:flex-row flex-wrap justify-start gap-6 sm:gap-12">
                  {franchiseData.stats.map((stat, index) => (
                    <div key={index} className="text-left">
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {franchiseData?.storeModels && (
              <section className="pt-4">
                <h3 className="text-left uppercase text-lg font-bold text-slate-800 mb-4">
                  Available store models
                </h3>
                <div className="space-y-4">
                  {franchiseData.storeModels.map((model) => (
                    <div
                      key={model.type}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors"
                    >
                      {model.image && (
                        <img
                          height={200}
                          width={300}
                          src={model.image}
                          alt={model.type}
                          className="rounded-lg object-cover w-full sm:w-48 h-40 sm:h-auto shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {model.type}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {model.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-start pt-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
              >
                Request Information
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
