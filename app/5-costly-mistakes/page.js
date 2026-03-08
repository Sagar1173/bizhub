export const metadata = {
  title: "5 Costly Mistakes Home Buyers Keep Repeating | Ravi Singh Godara",
  description: "Avoid these 5 expensive home buying mistakes that trip up first-time buyers every time.",
};

const mistakes = [
  {
    number: "01",
    title: "Skipping Mortgage Pre-Approval",
    body: "Pre-approval is essential before placing any offer — or even before you start house-hunting. Most sellers won't accept offers without a pre-approval letter. Be aware: even after approval, your loan can fall through if you alter your credit score, like financing a car purchase.",
  },
  {
    number: "02",
    title: "Not Getting a Home Inspection",
    body: "A home inspection can uncover hidden problems not apparent during a walkthrough. Skipping it to save money or speed up the process can cost far more in the long run. A professional inspector identifies issues with structure, plumbing, electrical, and HVAC systems.",
  },
  {
    number: "03",
    title: "Assuming a Fixer-Upper Is Always a Good Deal",
    body: "A fixer-upper sounds ideal until you start fixing it. If you're on a tight budget, look for homes with unrealised potential. Consult your agent on which improvements add the most value — don't overestimate what you can handle.",
  },
  {
    number: "04",
    title: "Overbidding Out of Fear",
    body: "Acting too fast or too slow when placing an offer both carry risk. An experienced real estate agent knows how much above or below asking price properties in an area sell for, and can help you craft an effective, rational offer strategy.",
  },
  {
    number: "05",
    title: "Not Shopping Around for Your Mortgage",
    body: "Many buyers take a mortgage with their current bank without comparing options. Using a mortgage broker gives you visibility into multiple lenders. Always get a breakdown of the full cost of each option, including penalties for breaking the mortgage early.",
  },
];

export default function FiveCostlyMistakesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">

        <header className="mb-12 pb-10 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1800ad" }}>Buyer&apos;s Guide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">
            5 Costly Mistakes Home Buyers Keep Repeating
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Buying a home is probably the largest investment you&apos;ll ever make. These are the five most avoidable — yet most common — mistakes buyers make, and how to sidestep each one.
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

        <section className="mb-12 text-slate-600 text-base leading-relaxed">
          <p>Especially for first-time buyers, purchasing a home can feel overwhelming. The key is to stay rational — no matter how personal the purchase feels. Knowing what problems to expect helps you avoid costly errors and buy with confidence.</p>
        </section>

        <section className="mb-14 space-y-10">
          {mistakes.map((m) => (
            <div key={m.number} className="flex gap-5">
              <span className="text-2xl font-bold text-slate-200 shrink-0 pt-0.5 leading-none select-none">{m.number}</span>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-2">{m.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{m.body}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="border-t border-slate-100 mb-12" />



      </div>
    </main>
  );
}
