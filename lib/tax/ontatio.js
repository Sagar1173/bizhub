function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateTaxByBrackets(price, isSingleFamilyResidential = true) {
  const taxable = Math.max(0, toNumber(price));
  let tax = 0;

  tax += Math.min(taxable, 55000) * 0.005;
  tax += Math.max(0, Math.min(taxable, 250000) - 55000) * 0.01;
  tax += Math.max(0, Math.min(taxable, 400000) - 250000) * 0.015;

  if (isSingleFamilyResidential) {
    tax += Math.max(0, Math.min(taxable, 2000000) - 400000) * 0.02;
    tax += Math.max(0, taxable - 2000000) * 0.025;
  } else {
    tax += Math.max(0, taxable - 400000) * 0.02;
  }

  return tax;
}

// Ontario Provincial LTT
export function calculateOntarioTax(price, options = {}) {
  const { isSingleFamilyResidential = true } = options;
  return calculateTaxByBrackets(price, isSingleFamilyResidential);
}

// Toronto Municipal LTT (same bracket base as provincial)
export function calculateTorontoTax(price, options = {}) {
  const { isSingleFamilyResidential = true } = options;
  return calculateTaxByBrackets(price, isSingleFamilyResidential);
}

// First-time home buyer rebate (Ontario max $4,000)
export function calculateOntarioRebate(tax, isFirstTimeBuyer, eligibleShare = 1) {
  if (!isFirstTimeBuyer) return 0;
  const share = Math.max(0, Math.min(1, toNumber(eligibleShare)));
  return Math.min(Math.max(0, toNumber(tax)) * share, 4000 * share);
}

// First-time home buyer rebate (Toronto municipal max $4,475)
export function calculateTorontoRebate(tax, isFirstTimeBuyer, eligibleShare = 1) {
  if (!isFirstTimeBuyer) return 0;
  const share = Math.max(0, Math.min(1, toNumber(eligibleShare)));
  return Math.min(Math.max(0, toNumber(tax)) * share, 4475 * share);
}
