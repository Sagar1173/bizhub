import Link from "next/link";

import { franchiseLocations } from "@/data/franchise-data";

export default function FeaturedFranchises() {
  const franchises = franchiseLocations.ontario.franchises.slice(0, 8);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {franchises.map((franchise) => (
          <Link
            key={franchise.name}
            href={`/franchise-opportunity/ontario/${franchise.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")}`}
            className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src={franchise.image}
                alt={franchise.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Verified
              </span>
            </div>

            {/* Content */}
            <div className="px-3 py-3 md:px-4 md:py-3 flex flex-col flex-1 min-h-0">
              <h3 className="text-base font-bold text-gray-900 mb-0.5 line-clamp-1 transition-colors">
                {franchise.name}
              </h3>
              <h4 className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                {franchise.investment}
              </h4>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                {franchise.type}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
