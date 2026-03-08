"use client";

import React from "react";
import { Home, Heart } from "lucide-react";
import Link from "next/link";

function franchiseToSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function FranchiseCard({ franchise, locationSlug = "ontario" }) {
  const thumbnail = franchise.image || null;
  const [imageLoadError, setImageLoadError] = React.useState(false);
  const franchiseSlug = franchiseToSlug(franchise.name);
  const href = `/franchise-opportunity/${locationSlug}/${franchiseSlug}`;

  React.useEffect(() => {
    setImageLoadError(false);
  }, [thumbnail]);

  const investment = franchise.investment || "—";
  const franchiseType = franchise.type || "Franchise";
  const locations = franchise.locations || "";
  const name = franchise.name || "Franchise";

  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      }}
      className="group w-full bg-white rounded-xl overflow-hidden cursor-pointer shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 block border border-transparent"
    >
      {/* Image Section */}
      <div className="relative h-52 sm:h-56 w-full bg-gray-100">
        {thumbnail && !imageLoadError ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageLoadError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Home size={40} strokeWidth={1} />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {thumbnail ? "Image not found" : "No Photo"}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 right-3 bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded">
          Verified
        </div>

        <button
          type="button"
          className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart size={18} className="text-white" />
        </button>
      </div>

      {/* Content Section */}
      <div className="px-3.5 pt-2 pb-4 space-y-1">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-950">
            {investment}
          </h3>
          <p className="text-sm text-gray-700 truncate font-medium">{name}</p>
        </div>

        {/* Specs */}
        <div className="space-y-1 text-gray-700">
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center gap-1.5">
              <Home size={14} className="text-gray-700" />
              <span className="text-xs font-medium text-gray-700 truncate">
                {franchiseType}
              </span>
            </div>
          </div>
          {locations ? (
            <p className="text-xs text-gray-700 truncate font-medium">
              {locations}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
