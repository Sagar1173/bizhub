"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BUSINESS_TYPES, BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";

// Beds and Baths removed for business listings focus

const SORT_MAP = {
  newest: "Newest",
  oldest: "Oldest",
  price_asc: "Lowest Price",
  price_desc: "Highest Price",
};



const LISTING_TYPE_MAP = {
  sale: "Sale",
  lease: "Lease",
};

const PRICE_MIN = 200000;
const PRICE_MAX = 5000000;
const PRICE_STEP = 50000;
const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatPrice = (value) => moneyFormatter.format(value);

const toPriceValue = (value, fallback) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.max(PRICE_MIN, Math.min(PRICE_MAX, num));
};

const summarizePriceRange = (min, max) => {
  const minNum = toPriceValue(min, PRICE_MIN);
  const maxNum = toPriceValue(max, PRICE_MAX);
  if (minNum === PRICE_MIN && maxNum === PRICE_MAX) return null;
  return `${formatPrice(minNum)} - ${formatPrice(maxNum)}`;
};

function useUrlFilters(onNavigate, city, pathFilter) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const get = (key) => searchParams.get(key);
  const legacyPriceMax = get("priceMax");
  const initial = {
    sortKey: get("sort") || "newest",
    listingType: pathFilter?.listingType || get("listingType") || "sale",
    businessType: pathFilter?.businessType || get("businessType") || null,
    minPrice: get("minPrice") || null,
    maxPrice: get("maxPrice") || legacyPriceMax || null,
  };
  const [local, setLocal] = useState(initial);

  useEffect(() => {
    setLocal({
      sortKey: get("sort") || "newest",
      listingType: pathFilter?.listingType || get("listingType") || "sale",
      businessType: pathFilter?.businessType || get("businessType") || null,
      minPrice: get("minPrice") || null,
      maxPrice: get("maxPrice") || get("priceMax") || null,
    });
  }, [searchParams.toString(), JSON.stringify(pathFilter)]);

  const push = (url, options) => {
    if (onNavigate) onNavigate(url, options);
    else router.push(url, options);
  };

  const getTargetUrl = (updates) => {
    const next = { ...local, ...updates };
    const hasExtraFilters =
      next.minPrice || next.maxPrice || next.sortKey !== "newest";

    // If it's a simple businessType + listingType filter, use SEO path
    if (next.businessType && !hasExtraFilters) {
      const businessTypeSlugMap = {
        "Convenience/Variety": "convenience-store",
      };
      const baseSlug =
        businessTypeSlugMap[next.businessType] ||
        next.businessType
          .toLowerCase()
          .replace(/\//g, "-")
          .replace(/ /g, "-");
      const slug = `${baseSlug}-for-${next.listingType}`;
      return `/${city}/${slug}`;
    }

    // Otherwise use query params on base city page
    const params = new URLSearchParams();
    if (next.sortKey !== "newest") params.set("sort", next.sortKey);
    if (next.listingType !== "sale") params.set("listingType", next.listingType);
    if (next.businessType) params.set("businessType", next.businessType);
    if (next.minPrice) params.set("minPrice", next.minPrice);
    if (next.maxPrice) params.set("maxPrice", next.maxPrice);

    const queryString = params.toString();
    return `/${city}${queryString ? `?${queryString}` : ""}`;
  };

  const setMany = (updates) => {
    setLocal((prev) => ({ ...prev, ...updates }));
    const targetUrl = getTargetUrl(updates);
    push(targetUrl, { scroll: false });
  };
  const set = (key, value) => setMany({ [key]: value });

  const setPriceRange = (minValue, maxValue) => {
    const min = toPriceValue(minValue, PRICE_MIN);
    const max = toPriceValue(maxValue, PRICE_MAX);
    const normalizedMin = Math.min(min, max);
    const normalizedMax = Math.max(min, max);
    setMany({
      minPrice: normalizedMin <= PRICE_MIN ? null : String(normalizedMin),
      maxPrice: normalizedMax >= PRICE_MAX ? null : String(normalizedMax),
    });
  };

  const clearAll = () => {
    setLocal({
      sortKey: "newest",
      listingType: "sale",
      businessType: null,
      minPrice: null,
      maxPrice: null,
    });
    push(`/${city}`, { scroll: false });
  };

  return {
    businessType: local.businessType,
    minPrice: local.minPrice,
    maxPrice: local.maxPrice,
    listingType: local.listingType,
    sortKey: local.sortKey,
    sortLabel: SORT_MAP[local.sortKey],
    set,
    setPriceRange,
    clearAll,
  };
}

export default function FilterBar({ onNavigate, city, pathFilter }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const {
    businessType,
    minPrice,
    maxPrice,
    listingType,
    sortKey,
    sortLabel,
    set,
    setPriceRange,
    clearAll,
  } = useUrlFilters(onNavigate, city, pathFilter);
  const hasActiveFilters = Boolean(
    listingType !== "sale" || businessType || minPrice || maxPrice,
  );

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 -mt-px bg-white w-full py-2">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Filters */}
          <div className="flex items-center gap-3 w-full min-w-0">
            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <DesktopDropdown
                label="Listing"
                value={LISTING_TYPE_MAP[listingType] || "Sale"}
              >
                {(close) =>
                  Object.entries(LISTING_TYPE_MAP).map(([key, label]) => (
                    <DropdownItem
                      key={key}
                      active={listingType === key}
                      onClick={() => {
                        set("listingType", key);
                        close();
                      }}
                    >
                      {label}
                    </DropdownItem>
                  ))
                }
              </DesktopDropdown>

              <PricePopover
                minPrice={minPrice}
                maxPrice={maxPrice}
                setPriceRange={setPriceRange}
              />
            </div>

            <div className="hidden lg:flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    set("businessType", businessType === type ? null : type)
                  }
                  className={`flex items-center shrink-0 gap-1.5 px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    businessType === type
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold"
                      : "border-gray-300 text-gray-700 hover:border-gray-800"
                  }`}
                >
                  {BUSINESS_TYPE_DISPLAY_MAP[type] || type}
                  {businessType === type && <X size={14} className="text-blue-500" />}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="text-sm shrink-0 underline font-medium text-red-600 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ml-2"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Mobile (we'll also show the quick business type pills here inline) */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
              <button
                onClick={() => setPanelOpen(true)}
                className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 hover:border-gray-800 transition-colors rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    set("businessType", businessType === type ? null : type)
                  }
                  className={`flex shrink-0 items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    businessType === type
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold"
                      : "border-gray-300 text-gray-700 hover:border-gray-800"
                  }`}
                >
                  {BUSINESS_TYPE_DISPLAY_MAP[type] || type}
                  {businessType === type && <X size={14} className="text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort((p) => !p)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {sortLabel}
              {openSort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 z-50">
                {Object.entries(SORT_MAP).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      set("sort", key);
                      setOpenSort(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                      sortKey === key
                        ? "bg-[#38003c] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {label}
                    {sortKey === key && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>


      {/* Mobile Slide-over */}
      <div
        className="fixed inset-0 z-50"
        style={{ pointerEvents: panelOpen ? "auto" : "none" }}
      >
        <div
          className={`fixed inset-0 bg-black transition-opacity ${
            panelOpen ? "opacity-30" : "opacity-0"
          }`}
          onClick={() => setPanelOpen(false)}
        />

        <div
          className={`relative bg-white w-[85vw] max-w-sm p-6 h-full transform transition-transform ${
            panelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setPanelOpen(false)}
            className="absolute top-4 right-4"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <h3 className="font-medium mb-2">Listing</h3>
          <DesktopDropdown
            label="Listing"
            value={LISTING_TYPE_MAP[listingType] || "Sale"}
            isMobile={true}
          >
            {(close) =>
              Object.entries(LISTING_TYPE_MAP).map(([key, label]) => (
                <DropdownItem
                  key={key}
                  active={listingType === key}
                  onClick={() => {
                    set("listingType", key);
                    close();
                  }}
                >
                  {label}
                </DropdownItem>
              ))
            }
          </DesktopDropdown>

          <h3 className="font-medium mt-4 mb-2">Price</h3>
          <PriceRangeSlider
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCommit={setPriceRange}
          />


          {hasActiveFilters && (
            <div className="mt-6">
              <button
                onClick={clearAll}
                className="w-full py-2 rounded-lg bg-red-50 text-red-600 font-medium inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <X size={12} />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DesktopDropdown({ label, value, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-800 transition-colors rounded-full text-sm cursor-pointer"
      >
        <span className="text-gray-700">{label}</span>
        {value && <span className="font-semibold">: {value}</span>}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-2 z-50">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function PricePopover({ minPrice, maxPrice, setPriceRange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const priceSummary = summarizePriceRange(minPrice, maxPrice);

  useEffect(() => {
    const handler = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-800 transition-colors rounded-full text-sm cursor-pointer"
      >
        <span className="text-gray-700">Price</span>
        {priceSummary && (
          <span className="font-semibold">: {priceSummary}</span>
        )}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-[360px] bg-white border rounded-xl shadow-lg p-4 z-50">
          <PriceRangeSlider
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCommit={setPriceRange}
          />
        </div>
      )}
    </div>
  );
}

function PriceRangeSlider({ minPrice, maxPrice, onCommit }) {
  const [minDraft, setMinDraft] = useState(toPriceValue(minPrice, PRICE_MIN));
  const [maxDraft, setMaxDraft] = useState(toPriceValue(maxPrice, PRICE_MAX));

  useEffect(() => {
    setMinDraft(toPriceValue(minPrice, PRICE_MIN));
    setMaxDraft(toPriceValue(maxPrice, PRICE_MAX));
  }, [minPrice, maxPrice]);

  const toPercent = (value) =>
    ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const minPercent = toPercent(minDraft);
  const maxPercent = toPercent(maxDraft);

  const commit = (nextMin, nextMax) => {
    onCommit(nextMin, nextMax);
  };

  const handleMin = (value) => {
    const raw = Number(value);
    const next = Math.min(raw, maxDraft - PRICE_STEP);
    setMinDraft(next);
  };

  const handleMax = (value) => {
    const raw = Number(value);
    const next = Math.max(raw, minDraft + PRICE_STEP);
    setMaxDraft(next);
  };

  const trackStyle = {
    background: `linear-gradient(to right, #e5e7eb ${minPercent}%, #1d4ed8 ${minPercent}%, #1d4ed8 ${maxPercent}%, #e5e7eb ${maxPercent}%)`,
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-800">
        <span>{formatPrice(minDraft)}</span>
        <span>{formatPrice(maxDraft)}</span>
      </div>

      <div className="relative h-7">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full"
          style={trackStyle}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={minDraft}
          onChange={(e) => handleMin(e.target.value)}
          onMouseUp={() => commit(minDraft, maxDraft)}
          onTouchEnd={() => commit(minDraft, maxDraft)}
          className="price-range-input absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={maxDraft}
          onChange={(e) => handleMax(e.target.value)}
          onMouseUp={() => commit(minDraft, maxDraft)}
          onTouchEnd={() => commit(minDraft, maxDraft)}
          className="price-range-input absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Min: {formatPrice(PRICE_MIN)}
        </span>
        <button
          onClick={() => {
            setMinDraft(PRICE_MIN);
            setMaxDraft(PRICE_MAX);
            commit(PRICE_MIN, PRICE_MAX);
          }}
          className="text-xs font-semibold text-blue-700 hover:text-blue-800"
        >
          Reset
        </button>
        <span className="text-xs text-gray-500">
          Max: {formatPrice(PRICE_MAX)}
        </span>
      </div>
      <style jsx>{`
        .price-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 999px;
          background: #1d4ed8;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          pointer-events: auto;
          margin-top: -6px;
        }
        .price-range-input::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }
        .price-range-input::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 999px;
          background: #1d4ed8;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          pointer-events: auto;
        }
        .price-range-input::-moz-range-track {
          height: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function DropdownItem({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
        active ? "bg-[#38003c] text-white" : "hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({ title, options, value, onChange }) {
  return (
    <div className="mb-5">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              value === o ? "bg-[#38003c] text-white" : "hover:bg-gray-100"
            }`}
          >
            {o}+
          </button>
        ))}
      </div>
    </div>
  );
}
