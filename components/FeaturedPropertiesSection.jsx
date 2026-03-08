"use client";
import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import Link from "next/link";
import { cityToSlug } from "@/lib/slug";

const FeaturedPropertiesSection = ({
  properties = [],
  cityName = "Toronto",
  citySlug,
  sectionId,
  totalCount,
  hideHeader = false,
  title,
  href,
}) => {
  const scrollRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Function to check if scrolling is possible
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Show left arrow if we have scrolled more than 5px
      setShowLeftArrow(scrollLeft > 5);

      // Show right arrow only if the content is wider than the container
      // AND we haven't reached the end (with 5px buffer)
      setShowRightArrow(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 5,
      );
    }
  };

  // Check on mount
  useEffect(() => {
    checkScroll();
    // Re-check on window resize
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [properties]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const offset =
        direction === "left" ? -clientWidth * 0.7 : clientWidth * 0.7;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!properties?.length) return null;

  const targetCitySlug = citySlug || cityToSlug(cityName);
  const finalHref = href || `/${targetCitySlug}`;
  const listingCount = Number(totalCount) || properties.length;
  const formattedListingCount = new Intl.NumberFormat("en-CA").format(
    listingCount,
  );
  return (
    <section
      id={sectionId}
      className={`bg-white w-full ${hideHeader ? "pt-6 pb-10" : "py-8"}`}
    >
      <div className={!hideHeader ? "w-full px-4 sm:px-6 lg:px-8" : "w-full"}>
        {!hideHeader ? (
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <Link
              scroll={true}
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "auto" })
              }
              href={finalHref}
              className="text-xl font-serif text-slate-900 tracking-tight hover:underline sm:text-2xl md:text-3xl"
            >
              {title || `Businesses for sale in ${cityName}`}{" "}
              <span className="ml-1 text-sm font-medium text-slate-800 sm:text-base md:text-xl">
                ({formattedListingCount}+ listings)
              </span>
            </Link>
            <Link
              href={finalHref}
              scroll={true}
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "auto" })
              }
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-700 transition-colors hover:text-amber-700 sm:self-auto sm:text-base whitespace-nowrap"
            >
              See all
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : null}

        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-[27%] -translate-y-1/2 z-20 bg-white shadow-md border border-gray-200 p-2 rounded-full hidden md:flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-700 cursor-pointer sm:left-3 lg:left-4"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-proximity pb-4 pr-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {properties?.map((property) => (
              <div
                key={property.ListingKey || property.id}
                className="w-[90%] sm:w-[56%] md:w-[260px] lg:w-[285px] snap-start"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-[27%] -translate-y-1/2 z-20 bg-white shadow-md border border-gray-200 p-2 rounded-full hidden md:flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-700 cursor-pointer sm:right-3 lg:right-4"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
