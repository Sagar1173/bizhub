"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import {
  calculateOntarioRebate,
  calculateTorontoRebate,
  calculateTorontoTax,
  calculateOntarioTax,
} from "@/lib/tax/ontatio";

const ONTARIO_CITIES = [
  "Toronto",
  "Ottawa",
  "Mississauga",
  "Brampton",
  "Hamilton",
  "London",
  "Markham",
  "Vaughan",
  "Kitchener",
];

export default function LandTransferCalculator({ defaultPrice = 500000 }) {
  const [priceInput, setPriceInput] = useState(String(defaultPrice));
  const [city, setCity] = useState("Toronto");
  const [firstTime, setFirstTime] = useState(false);

  const result = useMemo(() => {
    const price = parseInput(priceInput);

    if (price <= 0) {
      return { valid: false, message: "Enter a purchase price greater than 0.", provincialTax: 0, municipalTax: 0, provincialRebate: 0, municipalRebate: 0, totalRebate: 0, totalTax: 0 };
    }

    const provincialTax = calculateOntarioTax(price, { isSingleFamilyResidential: true });
    const municipalTax = city === "Toronto" ? calculateTorontoTax(price, { isSingleFamilyResidential: true }) : 0;
    const provincialRebate = calculateOntarioRebate(provincialTax, firstTime);
    const municipalRebate = city === "Toronto" ? calculateTorontoRebate(municipalTax, firstTime) : 0;
    const totalRebate = provincialRebate + municipalRebate;

    return { valid: true, message: "", provincialTax, municipalTax, provincialRebate, municipalRebate, totalRebate, totalTax: provincialTax + municipalTax - totalRebate };
  }, [priceInput, city, firstTime]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1800ad" }}>Calculator</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Land Transfer Tax Calculator</h1>
        <p className="text-slate-500 text-sm">Estimate your Ontario land transfer tax and any first-time buyer rebates.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Purchase Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-7 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1800ad]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">City</label>
            <LocationSearch cities={ONTARIO_CITIES} value={city} onSelect={setCity} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={firstTime}
              onChange={(e) => setFirstTime(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-[#1800ad]"
            />
            <span className="text-sm font-medium text-slate-700">I&apos;m a first-time home buyer</span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result.valid ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {result.message}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
                <ResultRow label="Provincial Tax" value={formatCurrency(result.provincialTax)} />
                <ResultRow label="Municipal Tax (Toronto)" value={formatCurrency(result.municipalTax)} />
                <ResultRow label="Provincial Rebate" value={`-${formatCurrency(result.provincialRebate)}`} accent={result.provincialRebate > 0} />
                <ResultRow label="Municipal Rebate" value={`-${formatCurrency(result.municipalRebate)}`} accent={result.municipalRebate > 0} />
                <ResultRow label="Total Rebate" value={`-${formatCurrency(result.totalRebate)}`} accent={result.totalRebate > 0} />
              </div>

              <div className="rounded-2xl border-2 p-6" style={{ borderColor: "#1800ad", background: "#f8f5ff" }}>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Land Transfer Tax</p>
                <p className="text-5xl font-bold tracking-tight" style={{ color: "#1800ad" }}>
                  {formatCurrency(result.totalTax)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-10 text-xs text-slate-400 text-center">
        Estimate only. Ontario and Toronto eligibility requirements can affect rebates.
      </p>
    </div>
  );
}

function LocationSearch({ cities, value, onSelect }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const filtered = cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setQuery(value); }, [value]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#1800ad]"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((c) => (
            <div
              key={c}
              onMouseDown={(e) => { e.preventDefault(); setQuery(c); onSelect(c); setOpen(false); }}
              className="cursor-pointer px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-50 transition"
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, value, bold = false, accent = false }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span
        className={`text-sm ${bold ? "font-bold" : "font-semibold"}`}
        style={accent ? { color: "#1800ad" } : { color: "#0f172a" }}
      >
        {value}
      </span>
    </div>
  );
}

function parseInput(value) {
  if (value === "" || value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
