import LandTransferCalculator from "@/components/LandTransferCalculator";

export const metadata = {
  title: "Land Transfer Tax Calculator",
};

export default function LandTransferTaxCalculatorPage() {
  return (
    <div className="min-h-screen pt-10">
      <LandTransferCalculator />
    </div>
  );
}
