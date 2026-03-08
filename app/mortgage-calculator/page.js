import MortgageCalculatorTool from "@/components/MortgageCalculatorTool";

export const metadata = {
  title: "Mortgage Calculator",
};

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen pt-10">
      <MortgageCalculatorTool />
    </div>
  );
}
