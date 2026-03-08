"use client";

import { useMemo, useState } from "react";

const PREMIUM_TAX_BY_PROVINCE = {
  ON: 0.08,
  QC: 0.09975,
  SK: 0.06,
  MB: 0.07,
};

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

function getInsuranceRateByDownPercent(downPercent) {
  if (downPercent < 5) return null;
  if (downPercent < 10) return 0.04;
  if (downPercent < 15) return 0.031;
  if (downPercent < 20) return 0.028;
  return 0;
}

function periodicRateFromCanadianNominal(annualRatePercent, periodsPerYear) {
  const nominal = annualRatePercent / 100;
  const effectiveAnnual = (1 + nominal / 2) ** 2 - 1;
  return (1 + effectiveAnnual) ** (1 / periodsPerYear) - 1;
}

function paymentForLoan(principal, ratePerPeriod, periods) {
  if (principal <= 0 || periods <= 0) return 0;
  if (ratePerPeriod === 0) return principal / periods;
  const growth = (1 + ratePerPeriod) ** periods;
  return (principal * ratePerPeriod * growth) / (growth - 1);
}

export default function MortgageCalculatorTool() {
  const [priceInput, setPriceInput] = useState("750000");
  const [downPaymentInput, setDownPaymentInput] = useState("150000");
  const [interestRateInput, setInterestRateInput] = useState("5");
  const [amortizationInput, setAmortizationInput] = useState("25");
  const [province, setProvince] = useState("ON");

  const price = parseInput(priceInput);

  const mortgageData = useMemo(() => {
    const downPayment = parseInput(downPaymentInput);
    const interestRate = parseInput(interestRateInput);
    const amortization = parseInput(amortizationInput);
    const fieldErrors = {};

    if (price <= 0) fieldErrors.price = "Enter a home price greater than 0.";
    if (downPayment < 0) fieldErrors.downPayment = "Down payment cannot be negative.";
    if (downPayment >= price && price > 0) fieldErrors.downPayment = "Down payment must be less than home price.";
    if (interestRate < 0) fieldErrors.interestRate = "Interest rate cannot be negative.";
    if (amortization <= 0) fieldErrors.amortization = "Amortization must be greater than 0.";
    if (amortization > 30) fieldErrors.amortization = "Max amortization is 30 years.";

    if (Object.keys(fieldErrors).length > 0) {
      return { valid: false, message: "Please fix highlighted fields.", fieldErrors };
    }

    const minDownPayment = getMinimumDownPayment(price);
    const downPercent = (downPayment / price) * 100;

    if (downPayment < minDownPayment) {
      return {
        valid: false,
        message: `Minimum down payment is ${formatCurrency(minDownPayment)} (${formatPercent((minDownPayment / price) * 100)}).`,
        fieldErrors: { downPayment: "Entered down payment is below required minimum." },
      };
    }

    const highRatio = downPercent < 20;
    if (highRatio && price >= 1500000) {
      return {
        valid: false,
        message: "Insured mortgages are generally unavailable at $1.5M and above unless down payment is at least 20%.",
        fieldErrors: { downPayment: "Increase down payment to at least 20% for this price." },
      };
    }

    const baseMortgage = price - downPayment;
    const insuranceRate = getInsuranceRateByDownPercent(downPercent) || 0;
    const insuranceAmount = highRatio ? baseMortgage * insuranceRate : 0;
    const totalLoan = baseMortgage + insuranceAmount;

    const monthlyRate = periodicRateFromCanadianNominal(interestRate, 12);
    const totalPayments = amortization * 12;
    const monthlyPayment = paymentForLoan(totalLoan, monthlyRate, totalPayments);

    const firstMonthInterest = totalLoan * monthlyRate;
    const firstMonthPrincipal = Math.max(0, monthlyPayment - firstMonthInterest);
    const totalPaid = monthlyPayment * totalPayments;
    const totalInterest = Math.max(0, totalPaid - totalLoan);
    const premiumTaxRate = PREMIUM_TAX_BY_PROVINCE[province] || 0;
    const premiumTax = insuranceAmount * premiumTaxRate;
    const cashNeeded = downPayment + premiumTax;

    return {
      valid: true, message: "", fieldErrors: {},
      price, downPayment, minDownPayment, downPercent,
      insuranceRate, insuranceAmount, baseMortgage, totalLoan,
      monthlyPayment, firstMonthInterest, firstMonthPrincipal,
      totalInterest, premiumTax, premiumTaxRate, cashNeeded,
    };
  }, [amortizationInput, downPaymentInput, interestRateInput, price, province]);

  const applyDownPreset = (percent) => {
    if (price <= 0) return;
    setDownPaymentInput(String(Math.round(price * (percent / 100))));
  };

  const resetDefaults = () => {
    setPriceInput("750000");
    setDownPaymentInput("150000");
    setInterestRateInput("5");
    setAmortizationInput("25");
    setProvince("ON");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1800ad" }}>Calculator</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Mortgage Calculator</h1>
          <p className="text-slate-500 text-sm">Estimate your monthly payment and total mortgage costs.</p>
        </div>
        <button
          type="button"
          onClick={resetDefaults}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-4 py-2 transition mt-1"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <Field
            label="Home Price"
            value={priceInput}
            onChange={setPriceInput}
            prefix="$"
            error={mortgageData.fieldErrors?.price}
          />

          <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <Field
              label="Down Payment"
              value={downPaymentInput}
              onChange={setDownPaymentInput}
              prefix="$"
              error={mortgageData.fieldErrors?.downPayment}
            />
            <div className="flex gap-2">
              {[5, 10, 20].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyDownPreset(p)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 transition"
                >
                  {p}%
                </button>
              ))}
            </div>
            <Field
              label="Interest Rate (%)"
              value={interestRateInput}
              onChange={setInterestRateInput}
              step="0.01"
              error={mortgageData.fieldErrors?.interestRate}
            />
            <Field
              label="Amortization (Years)"
              value={amortizationInput}
              onChange={setAmortizationInput}
              error={mortgageData.fieldErrors?.amortization}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#1800ad] transition"
            >
              {PROVINCES.map((item) => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!mortgageData.valid && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mortgageData.message}
            </div>
          )}

          {/* Monthly Payment Hero */}
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: "#1800ad", background: "#f8f5ff" }}>
            <p className="text-sm font-medium text-slate-600 mb-2">Estimated Monthly Payment</p>
            <p className="text-5xl font-bold tracking-tight" style={{ color: "#1800ad" }}>
              {mortgageData.valid ? formatCurrency(mortgageData.monthlyPayment) : "$0"}
            </p>
            {mortgageData.valid && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  Principal {formatCurrency(mortgageData.firstMonthPrincipal)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  Interest {formatCurrency(mortgageData.firstMonthInterest)}
                </div>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
            <ResultRow label="Down Payment" value={mortgageData.valid ? `${formatCurrency(mortgageData.downPayment)} (${formatPercent(mortgageData.downPercent)})` : "$0"} />
            <ResultRow label="Minimum Down Payment" value={mortgageData.valid ? formatCurrency(mortgageData.minDownPayment) : "$0"} />
            <ResultRow label="Base Mortgage" value={mortgageData.valid ? formatCurrency(mortgageData.baseMortgage) : "$0"} />
            <ResultRow label="Insurance Premium" value={mortgageData.valid ? `${formatCurrency(mortgageData.insuranceAmount)} (${formatPercent(mortgageData.insuranceRate * 100)})` : "$0"} />
            <ResultRow label="Premium Tax" value={mortgageData.valid ? `${formatCurrency(mortgageData.premiumTax)} (${formatPercent(mortgageData.premiumTaxRate * 100)})` : "$0"} />
            <ResultRow label="Total Mortgage" value={mortgageData.valid ? formatCurrency(mortgageData.totalLoan) : "$0"} bold />
            <ResultRow label="Total Interest" value={mortgageData.valid ? formatCurrency(mortgageData.totalInterest) : "$0"} />
            <ResultRow label="Cash Needed Now" value={mortgageData.valid ? formatCurrency(mortgageData.cashNeeded) : "$0"} bold />
          </div>
        </div>
      </div>

      <p className="mt-10 text-xs text-slate-400 text-center">
        Estimate only. Qualification, insurer policy, and lender terms can change actual outcomes.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, error, step = "1", prefix }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 w-full rounded-xl border bg-white text-slate-900 outline-none transition text-sm font-medium ${prefix ? "pl-7 pr-4" : "px-4"} ${error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#1800ad]"}`}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ResultRow({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm ${bold ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>{value}</span>
    </div>
  );
}
