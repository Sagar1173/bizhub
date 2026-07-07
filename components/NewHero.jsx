"use client";

import { Search, MapPin, Check } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import nProgress from "nprogress";
import { cityToSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { ALL_ONTARIO_CITIES } from "@/constants/cities";

const POPULAR_CATEGORIES = [
  { label: "Restaurants", href: "/gta/restaurant-for-sale" },
  { label: "Convenience Stores", href: "/gta/convenience-store-for-sale" },
  { label: "Hotels", href: "/gta/hotel-for-sale" },
];

const NewHero = () => {
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
    <section
      id="top"
      className="relative w-full bg-white min-h-[calc(100vh-100px)] min-h-[calc(100dvh-100px)] flex items-center justify-center overflow-hidden py-16"
    >
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero.jpg")' }} // Generic background image placeholder
      />
      <div className="absolute inset-0 z-0 bg-white/60" />

      {/* Blurred Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#E35335] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.08] z-0 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gray-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.08] z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Headline */}
        <h1 className="font-display font-extrabold text-[32px] sm:text-[40px] md:text-[44px] lg:text-[56px] leading-[1.1] text-foreground mx-auto max-w-4xl tracking-tight">
          <span className="block mb-4">Find the Right Business</span>
          <span className="block text-[#E35335]">for Your Next Investment.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-[16px] sm:text-[18px] text-muted-foreground max-w-2xl mx-auto">
          Browse verified businesses for sale across Ontario.
        </p>

        {/* Search Container */}
        <div ref={containerRef} className="relative mt-10 sm:mt-12 mx-auto w-full max-w-[850px]">
          <div className="bg-white rounded-[32px] border border-border/80 shadow-md hover:shadow-lg transition-shadow p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 relative z-20">
            <div className="flex items-center gap-3 flex-1 px-4 sm:px-6">
              <Search className="cursor-pointer h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0" />
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
                className="w-full bg-transparent outline-none text-base sm:text-lg py-3 sm:py-4 placeholder:text-muted-foreground/70"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              aria-label="Search"
              className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-black text-white px-8 py-4 sm:py-4 text-base font-semibold hover:bg-black/80 transition-colors shrink-0 disabled:cursor-not-allowed disabled:opacity-70 w-full sm:w-auto"
            >
              {isSearching ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Autocomplete suggestions */}
          {isExpanded && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-72 overflow-auto rounded-2xl border border-border bg-white text-left shadow-xl">
              {suggestions.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className="flex w-full items-center gap-3 border-b border-border/60 px-5 py-3 text-left text-foreground transition hover:bg-muted/30 last:border-0"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[15px] font-medium">{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-3xl mx-auto">
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="rounded-full bg-white/80 border border-border/60 hover:border-foreground/30 hover:bg-white text-foreground hover:text-foreground text-[13px] sm:text-[14px] font-medium px-4 py-2 sm:px-5 sm:py-2.5 transition-colors shadow-sm"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Trust Line */}
        <div className="mt-7 sm:mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm sm:text-[15px] text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#E35335]" /> Verified Listings
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#E35335]" /> Updated Daily
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#E35335]" /> Across Ontario
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
