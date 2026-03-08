"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
];

const PREMIUM_TAX_BY_PROVINCE = {
  ON: 0.08,
  QC: 0.09975,
  SK: 0.06,
  MB: 0.07,
};

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

function formatPercent(value, digits = 2) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(digits)}%`;
}

function getMinimumDownPayment(price) {
  if (price <= 500000) return price * 0.05;
  if (price < 1500000) return 25000 + (price - 500000) * 0.1;
  return price * 0.2;
}

function getCmhcRateByDownPercent(downPercent) {
  if (downPercent < 5) return null;
  if (downPercent < 10) return 0.04;
  if (downPercent < 15) return 0.031;
  if (downPercent < 20) return 0.028;
  return 0;
}

export default function CMHCCalculatorTool() {
  const [priceInput, setPriceInput] = useState("750000");
  const [downPaymentInput, setDownPaymentInput] = useState("150000");
  const [province, setProvince] = useState("ON");

  const result = useMemo(() => {
    const price = parseInput(priceInput);
    const downPayment = parseInput(downPaymentInput);

    if (price <= 0) return { valid: false, message: "Enter an asking price greater than 0." };
    if (downPayment < 0) return { valid: false, message: "Down payment cannot be negative." };
    if (downPayment >= price) return { valid: false, message: "Down payment must be less than the asking price." };

    const minDownPayment = getMinimumDownPayment(price);
    const downPercent = (downPayment / price) * 100;

    if (downPayment < minDownPayment) {
      return {
        valid: false,
        message: `Minimum down payment is ${formatCurrency(minDownPayment)} (${formatPercent((minDownPayment / price) * 100)}).`,
      };
    }

    const highRatio = downPercent < 20;
    if (highRatio && price >= 1500000) {
      return { valid: false, message: "Insured mortgages are unavailable at $1.5M+. Increase down payment to 20%." };
    }

    const baseMortgage = price - downPayment;
    const premiumRate = getCmhcRateByDownPercent(downPercent) || 0;
    const cmhcInsurance = highRatio ? baseMortgage * premiumRate : 0;
    const totalMortgage = baseMortgage + cmhcInsurance;
    const premiumTaxRate = PREMIUM_TAX_BY_PROVINCE[province] || 0;
    const premiumTax = cmhcInsurance * premiumTaxRate;
    const cashNeeded = downPayment + premiumTax;

    return { valid: true, message: "", price, downPayment, downPercent, minDownPayment, premiumRate, cmhcInsurance, totalMortgage, premiumTax, premiumTaxRate, cashNeeded, highRatio };
  }, [priceInput, downPaymentInput, province]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1800ad" }}>Calculator</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">CMHC Insurance Calculator</h1>
        <p className="text-slate-500 text-sm">Estimate your mortgage default insurance premium based on your down payment.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <Field label="Asking Price" value={priceInput} onChange={setPriceInput} prefix="$" />
          <Field label="Down Payment" value={downPaymentInput} onChange={setDownPaymentInput} prefix="$" />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Province</label>
            <ProvinceDropdown value={province} options={PROVINCES} onChange={setProvince} />
          </div>
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
                <ResultRow label="Down Payment %" value={formatPercent(result.downPercent)} />
                <ResultRow label="Minimum Down Payment" value={formatCurrency(result.minDownPayment)} />
                <ResultRow label="Premium Rate" value={result.highRatio ? formatPercent(result.premiumRate * 100) : "0.00%"} />
                <ResultRow label="CMHC Insurance" value={formatCurrency(result.cmhcInsurance)} />
                <ResultRow label="Insurance Premium Tax" value={`${formatCurrency(result.premiumTax)} (${formatPercent(result.premiumTaxRate * 100)})`} />
              </div>

              <div className="rounded-2xl border-2 p-5" style={{ borderColor: "#1800ad", background: "#f8f5ff" }}>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Mortgage</p>
                <p className="text-4xl font-bold tracking-tight" style={{ color: "#1800ad" }}>
                  {formatCurrency(result.totalMortgage)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Cash Needed (down + premium tax)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(result.cashNeeded)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-10 text-xs text-slate-400 text-center">
        Estimate only. CMHC eligibility rules and lender-specific policies may affect final results.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, prefix }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition focus:border-[#1800ad] text-sm font-medium ${prefix ? "pl-7 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

function ResultRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function ProvinceDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selected = options.find((item) => item.code === value) || options[0];

  useEffect(() => {
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1800ad]"
      >
        <span>{selected.name}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((item) => (
            <button
              type="button"
              key={item.code}
              onMouseDown={(e) => { e.preventDefault(); onChange(item.code); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-50"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
