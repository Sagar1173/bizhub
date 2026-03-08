import CMHCCalculatorTool from "@/components/CMHCCalculatorTool";

export const metadata = {
  title: "CMHC Insurance Calculator",
};

export default function CmhcInsuranceCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-3 md:px-6">
      <CMHCCalculatorTool />
    </main>
  );
}
