"use client";

import { Search, MapPin } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import nProgress from "nprogress";
import { cityToSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { ALL_ONTARIO_CITIES, TOP_ONTARIO_CITIES } from "@/constants/cities";

const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  const cities = ALL_ONTARIO_CITIES;

  const suggestions =
    query.trim() === ""
      ? ["Oakville", "Milton", "Burlington", "Mississauga"]
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

  return (
    <section className="relative isolate z-40 w-full pb-20 pt-20 sm:pb-40 sm:pt-20 min-h-[450px] flex items-center">
      {/* Background Image with Overlay and Clip Path */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden bg-slate-900"
        style={{
          clipPath: "url(#heroCurve)",
        }}
      >
        <img
          src="/hero.jpg"
          alt="Ontario Real Estate"
          className="h-full w-full object-cover object-center brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
      </div>

      {/* Defined SVG Clip Path */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heroCurve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V0.9 C0.7,1 0.3,0.7 0,0.8 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-left">
          <div className="space-y-4">
            <h1
              className="font-sans text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold tracking-tight text-white leading-[1.1]"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.5), 0px 0px 20px rgba(0,0,0,0.3)",
              }}
            >
              Find your next business in Ontario
            </h1>
            <h2
              className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 leading-relaxed"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
            >
              100+{" "}
              <Link
                href="/gta/restaurant-for-sale"
                className="text-white border-b-2 border-white/30 hover:border-white transition-colors"
              >
                Restaurants
              </Link>
              ,{" "}
              <Link
                href="/gta/convenience-store-for-sale"
                className="text-white border-b-2 border-white/30 hover:border-white transition-colors"
              >
                Convenience Stores
              </Link>{" "}
              &{" "}
              <Link
                href="/gta/hotel-for-sale"
                className="text-white border-b-2 border-white/30 hover:border-white transition-colors"
              >
                Hotels
              </Link>{" "}
              for sale
            </h2>
          </div>

          <div className="mt-10 flex w-full flex-col items-start gap-4">
            {/* SEARCH BAR */}
            <div ref={containerRef} className="relative w-full max-w-xl group">
              <div
                className={cn(
                  "relative flex items-center rounded-xl border border-slate-200 bg-white px-2 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.15)] focus-within:-translate-y-1 focus-within:ring-4 focus-within:ring-white/10",
                  isExpanded &&
                    "rounded-b-none translate-y-0 shadow-xl focus-within:translate-y-0 focus-within:shadow-xl hover:translate-y-0 hover:shadow-xl",
                )}
              >
                <input
                  type="text"
                  placeholder="Search by MLS®, address or city"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="h-14 w-full bg-transparent pl-4 pr-14 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none sm:h-16 sm:text-lg sm:pr-16"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  aria-label="Search"
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:w-12 bg-primary"
                >
                  {isSearching ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  ) : (
                    <Search className="h-5 w-5 stroke-[2.5px] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                  )}
                </button>
              </div>

              {/* AUTOCOMPLETE SUGGESTIONS */}
              {isExpanded && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[100] max-h-72 overflow-auto rounded-b-xl border border-t-0 border-slate-200 bg-white text-left shadow-2xl">
                  {suggestions.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelect(city)}
                      className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left text-slate-900 transition hover:bg-slate-50 last:border-0"
                    >
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-base font-medium">{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
