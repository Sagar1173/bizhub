"use client";
import React, { useEffect, useTransition } from "react";
import PropertyCard from "./PropertyCard";
import FilterBar from "./FilterBar";
import { useRouter, useSearchParams } from "next/navigation";
import { slugToCity } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";
import CitySkeleton from "./CitySkeleton";
import BusinessInterlinks from "./BusinessInterlinks";

const pluralizeBusinessType = (type) => {
  if (!type) return "";
  const mapping = {
    Restaurant: "Restaurants",
    Office: "Offices",
    "Professional Office": "Professional Offices",
    Retail: "Retail Units",
    "Convenience/Variety": "Convenience Stores",
    "Medical/Dental": "Medical/Dental Offices",
  };
  return mapping[type] || `${type} Businesses`;
};

const CityComponent = ({ city, properties, pagination, filter }) => {
  const { currentPage, totalPages, totalCount } = pagination;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (url, options) =>
    startTransition(() => router.push(url, options));

  const cityName = slugToCity(city);
  const listingType =
    filter?.listingType || searchParams.get("listingType") || "sale";
  const businessType = filter?.businessType || searchParams.get("businessType");
  const countStr = totalCount > 0 ? `${totalCount}+ ` : "";

  const listingLabel = listingType === "lease" ? "for Lease" : "for Sale";

  const h1Title = businessType
    ? `${pluralizeBusinessType(businessType)} ${listingLabel} in ${cityName}`
    : `Business Opportunities ${listingLabel} in ${cityName}`;

  const businessLabel = businessType ? (BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType) : "Business Opportunities";
  const pageDescription = `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on bizmonk.`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [city]);

  const goToPage = (page) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    navigate(`/${city}?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 capitalize leading-tight">
            {h1Title}
          </h1>
          <h2 className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
            {pageDescription}
          </h2>
        </div>
      </div>

      <FilterBar onNavigate={navigate} city={city} pathFilter={filter} />

      <main className="w-full px-4 sm:px-6 lg:px-8 pb-20 pt-4 sm:pt-6">
        {isPending ? (
          <CitySkeleton contentOnly={true} showFilterBar={false} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <PropertyCard
                    key={property.ListingKey || property.id}
                    property={property}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No properties found in this area.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-12 mb-20 w-full">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none opacity-30"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Prev
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isNeighbor = Math.abs(currentPage - pageNum) <= 1;

                    if (pageNum === 1 || pageNum === totalPages || isNeighbor) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm flex items-center justify-center rounded border transition-colors ${
                            currentPage === pageNum
                              ? "bg-slate-800 text-white border-slate-800"
                              : "hover:bg-gray-50 text-slate-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="text-gray-400 text-xs sm:text-sm px-1"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-30"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BusinessInterlinks city={city} filter={filter} />
    </div>
  );
};

export default CityComponent;
