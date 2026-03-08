"use client";

import { Search, MapPin } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { cityToSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";

const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  const cities = [
    "Toronto",
    "Richmond Hill",
    "Markham",
    "Bradford",
    "Vaughan",
    "Aurora",
    "Oakville",
    "Barrie",
    "Whitby",
  ];

  const suggestions =
    query.trim() === ""
      ? []
      : cities.filter((city) =>
          city.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setQuery(city);
    setIsExpanded(false);
    nProgress.start();
    router.push(`/${cityToSlug(city)}`);
  };

  const looksLikeListingInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (/\d/.test(trimmed)) return true;
    return /^[A-Za-z0-9-]{6,}$/.test(trimmed);
  };

  const handleSearch = async () => {
    const raw = query.trim();
    if (!raw || isSearching) return;

    const exactCity = cities.find(
      (city) => city.toLowerCase() === raw.toLowerCase(),
    );
    if (exactCity) {
      handleSelect(exactCity);
      return;
    }

    const firstPartialCity = cities.find((city) =>
      city.toLowerCase().includes(raw.toLowerCase()),
    );

    const shouldLookupListingFirst = looksLikeListingInput(raw);

    if (!shouldLookupListingFirst && firstPartialCity) {
      handleSelect(firstPartialCity);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(
        `/api/property-lookup?q=${encodeURIComponent(raw)}`,
      );
      const data = await res.json();

      if (res.ok && data?.found && data?.city && data?.listingKey) {
        setIsExpanded(false);
        nProgress.start();
        router.push(`/${cityToSlug(data.city)}/${data.listingKey}`);
        return;
      }
    } catch {
      // Swallow lookup errors and fallback to city-based behavior.
    } finally {
      setIsSearching(false);
    }

    if (firstPartialCity) {
      handleSelect(firstPartialCity);
      return;
    }

    if (!looksLikeListingInput(raw)) {
      setIsExpanded(false);
      nProgress.start();
      router.push(`/${cityToSlug(raw)}`);
    }
  };

  const quickCities = ["Toronto", "Richmond Hill", "Markham", "Bradford"];

  return (
    <section className="relative isolate w-full overflow-hidden bg-white pb-10 sm:pb-16 md:pb-20 min-h-[500px]">
      {/* Sweeping curve background from top-left to bottom-right, bulging outwards */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden mix-blend-multiply">
        <svg
          viewBox="200 0 1240 800"
          className="w-full h-full text-sky-100 fill-current"
          preserveAspectRatio="none"
        >
          {/* Perfect elliptical arc from top-left to bottom-right, bulging out towards bottom-left */}
          <path d="M0,0 A1440,600 0 0,0 1440,600 L1440,0 Z"></path>
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16 md:mt-20">
        <div className="flex flex-col items-center justify-center">
          {/* COPY + SEARCH */}
          <div className="w-full max-w-3xl text-center">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Explore businesses across the GTA
              </p>
              <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Find your next business here
              </h1>
              <p className="mx-auto text-sm leading-relaxed text-slate-600 sm:text-2xl">
                100+ Restaurants, Convenience Stores & Hotels for sale
              </p>
            </div>

            <div className="mt-8 flex max-w-xl mx-auto flex-col items-center gap-6">
              {/* SEARCH BAR */}
              <div ref={containerRef} className="relative w-full">
                <div
                  className={cn(
                    "relative flex items-center rounded-full border border-slate-200 bg-white/80 px-2 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-[0_22px_70px_rgba(15,23,42,0.15)] hover:-translate-y-0.5 focus-within:border-sky-500/80 focus-within:ring-2 focus-within:ring-sky-500/15",
                  )}
                >
                  <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400 sm:left-5 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search by MLS® Number or Address"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="h-12 w-full bg-transparent pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:h-14 sm:pl-14 sm:pr-16 sm:text-base"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    aria-label="Search"
                    className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-sky-600 to-blue-700 text-white shadow-md transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 sm:right-2 sm:h-10 sm:w-10"
                  >
                    {isSearching ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    ) : (
                      <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>

                {/* AUTOCOMPLETE SUGGESTIONS */}
                {isExpanded && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
                    {suggestions.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleSelect(city)}
                        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left text-slate-900 transition hover:bg-slate-50 last:border-0 sm:px-6 sm:py-3.5"
                      >
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium sm:text-base">
                          {city}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK CITY BUTTONS */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 sm:gap-3 sm:pt-2">
                {quickCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50 active:translate-y-0 sm:px-3.5 sm:text-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
