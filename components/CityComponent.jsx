import React from "react";
import PropertyCard from "./PropertyCard";
import FilterBar from "./FilterBar";
import Link from "next/link";
import { slugToCity } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";
import BusinessInterlinks from "./BusinessInterlinks";

const pluralizeBusinessType = (type) => {
  if (!type) return "";
  const mapping = {
    Restaurant: "Restaurants",
    Office: "Offices",
    "Professional Office": "Offices",
    Retail: "Retail Units",
    "Convenience/Variety": "Convenience Stores",
    "Medical/Dental": "Medical/Dental Offices",
  };
  return mapping[type] || `${type} Businesses`;
};

const CityComponent = ({
  city,
  properties,
  pagination,
  filter,
  basePath,
  searchParams,
  showHeader = true,
  showFilters = true,
}) => {
  const { currentPage, totalPages, totalCount } = pagination;

  const cityName = slugToCity(city);
  const listingType = filter?.listingType || "sale";
  const businessType = filter?.businessType || null;
  const countStr = totalCount > 0 ? `${totalCount}+ ` : "";

  const listingLabel = listingType === "lease" ? "for Lease" : "for Sale";

  const h1Title = businessType
    ? `${pluralizeBusinessType(businessType)} ${listingLabel} in ${cityName}`
    : `Business Opportunities ${listingLabel} in ${cityName}`;

  const businessLabel = businessType
    ? BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType
    : "Business Opportunities";
  const pageDescription = `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizhub.`;

  const buildPageHref = (page) => {
    const params = new URLSearchParams();
    const raw = searchParams || {};
    Object.entries(raw).forEach(([key, value]) => {
      if (key === "page") return;
      if (value == null) return;
      const v = Array.isArray(value) ? value[0] : value;
      if (typeof v !== "string" || v.length === 0) return;
      params.set(key, v);
    });
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return `${basePath || `/${city}`}${query ? `?${query}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {showHeader && (
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
      )}

      {showFilters && <FilterBar city={city} pathFilter={filter} />}

      <main className="w-full px-4 sm:px-6 lg:px-8 pb-20 pt-4 sm:pt-6">
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
            <nav
              aria-label="Pagination"
              className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-12 mb-20 w-full"
            >
              {currentPage === 1 ? (
                <span className="px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded opacity-30">
                  Prev
                </span>
              ) : (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className="px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded transition-colors hover:bg-gray-50"
                >
                  Prev
                </Link>
              )}

              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isNeighbor = Math.abs(currentPage - pageNum) <= 1;

                  if (pageNum === 1 || pageNum === totalPages || isNeighbor) {
                    const active = currentPage === pageNum;
                    return (
                      <Link
                        key={pageNum}
                        href={buildPageHref(pageNum)}
                        aria-current={active ? "page" : undefined}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm flex items-center justify-center rounded border transition-colors ${
                          active
                            ? "bg-slate-800 text-white border-slate-800"
                            : "hover:bg-gray-50 text-slate-600"
                        }`}
                      >
                        {pageNum}
                      </Link>
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

              {currentPage === totalPages ? (
                <span className="px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded opacity-30">
                  Next
                </span>
              ) : (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className="px-2 py-2 sm:px-4 text-xs sm:text-sm border rounded transition-colors hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      </main>

      <BusinessInterlinks city={city} filter={filter} />
    </div>
  );
};

export default CityComponent;
