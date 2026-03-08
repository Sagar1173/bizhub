export const metadata = {
  title: "How Your Credit Score Affects You | Ravi Singh Godara",
  description: "Learn how your credit score impacts your mortgage, interest rate, and home buying power.",
};

const factors = [
  {
    number: "01",
    title: "Defaulting on a Loan",
    body: "Defaulting on a loan has the most severe negative impact on your credit score. It means you have failed to repay the loan as agreed, and it can stay on your credit report for up to seven years.",
  },
  {
    number: "02",
    title: "Late Payments",
    body: "Payment history is the most significant factor determining your credit score. Late and missed payments significantly reduce your score. Even one late payment can have a considerable impact.",
  },
  {
    number: "03",
    title: "Credit Utilization",
    body: "Credit utilization is the ratio of outstanding credit card balances to credit limits. Keeping your utilization ratio below 30% is ideal for maintaining a good credit score.",
  },
  {
    number: "04",
    title: "Credit Applications",
    body: "When you apply for credit, the lender performs a hard inquiry on your credit report. Too many hard inquiries in a short period can lower your credit score.",
  },
  {
    number: "05",
    title: "Closing Credit Accounts",
    body: "Closing credit accounts can negatively impact your credit score, especially if you have a long credit history. It reduces the average age of your accounts, which can lower your score.",
  },
];

const tips = [
  "Pay your bills on time every month.",
  "Keep credit card balances below 30% of your credit limit.",
  "Only apply for credit when you truly need it.",
  "Check your credit report regularly and dispute any errors.",
  "Build your credit history with a secured credit card if new to credit.",
];

const steps = [
  {
    number: "01",
    title: "Get a copy of your credit report",
    body: "Request a free copy from Equifax or TransUnion. Review it carefully for errors or inaccuracies and dispute anything that negatively impacts your score.",
  },
  {
    number: "02",
    title: "Pay down your debts",
    body: "The less debt you have, the better your credit utilization ratio will be. Paying off debt on time directly builds your credit score.",
  },
  {
    number: "03",
    title: "Budget to pay bills on time",
    body: "Make on-time payments your #1 monthly priority. Use a budgeting app or a simple spreadsheet to keep your finances in check.",
  },
  {
    number: "04",
    title: "Seek professional help",
    body: "If you're struggling, a credit counsellor or financial advisor can help you develop a plan to improve your score and manage debts.",
  },
];

export default function CreditScoresAffectsYouPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">

        <header className="mb-12 pb-10 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1800ad" }}>Financial Guide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">
            How Your Credit Score Affects You
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Your credit score determines how much you can borrow, what interest rate you pay, and whether lenders will approve your mortgage at all.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
              <img src="/profile2.jpg" alt="Ravi Singh Godara" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ravi Singh Godara</p>
              <p className="text-xs text-slate-500">Broker</p>
            </div>
          </div>
        </header>

        <section className="mb-12 space-y-4 text-slate-600 text-base leading-relaxed">
          <p>In Canada and the U.S., most lenders use the FICO credit score system, ranging from 300 to 900. The higher your score, the more likely you are to be approved — and on far better terms.</p>
          <p>With a score of 750+, you can access low interest rates and small down payments. Below 600, you may be denied a mortgage or face significantly higher costs.</p>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-7">Significant Factors Impacting Your Credit Score</h2>
          <div className="space-y-6">
            {factors.map((f) => (
              <div key={f.number} className="flex gap-5">
                <span className="text-2xl font-bold text-slate-200 shrink-0 pt-0.5 leading-none select-none">{f.number}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-slate-100 mb-14" />

        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Maintaining a Healthy Credit Score</h2>
          <ul className="space-y-3">
            {tips.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#1800ad" }} />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-slate-100 mb-14" />

        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-7">Building Up Your Credit Score</h2>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.number} className="flex gap-5">
                <span className="text-2xl font-bold text-slate-200 shrink-0 pt-0.5 leading-none select-none">{s.number}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>



      </div>
    </main>
  );
}
