export const metadata = {
  title: "How to Avoid a Money Pit | Ravi Singh Godara",
  description: "6 warning signs of costly home defects to look for before you buy.",
};

const signs = [
  {
    number: "01",
    title: "Roof",
    body: "Leaks are the most common problem with roofs and are tough to detect from outside. From inside an attic, however, you can often spot water marks where a leak is present.",
  },
  {
    number: "02",
    title: "Plumbing System",
    body: "Make sure you are confident that both water systems — the one that brings fresh water in and the one that takes sewage out — are functioning well before signing on the dotted line.",
  },
  {
    number: "03",
    title: "Electrical Systems",
    body: "Before you agree to buy, ensure you can run all appliances and power tools simultaneously without a power failure. Also confirm the electrical system is safe and doesn't present a fire hazard.",
  },
  {
    number: "04",
    title: "Heating and Cooling Systems",
    body: "Thoroughly inspect the heating and air conditioning systems in any home you are considering. These systems are expensive to replace and their condition should be a priority.",
  },
  {
    number: "05",
    title: "Bad Paint and Signs of Rotting",
    body: "The paint inside and outside the house can reveal a lot about the underlying material. Check several walls using both your eyes and a screwdriver for soft or rotting spots.",
  },
  {
    number: "06",
    title: "Cracks and Foundation Issues",
    body: "Cracks in walls, doors that don't close properly, and uneven floors can all signal foundation problems. A bad foundation could be used to negotiate a lower price or require repairs before the sale.",
  },
];

export default function AvoidMoneyPitPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">

        <header className="mb-12 pb-10 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1800ad" }}>Buyer&apos;s Guide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">
            How to Avoid a Money Pit: 6 Warning Signs of Expensive Repairs
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Many people think serious defects in a home are easy to spot. In reality, the most costly problems require a very close inspection to detect.
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
          <p>When considering buying a home, look for these six telltale signs of serious problems. Catching them early can save you tens of thousands of dollars — or steer you away from a bad investment altogether.</p>
        </section>

        <section className="mb-14 space-y-8">
          {signs.map((s) => (
            <div key={s.number} className="flex gap-5">
              <span className="text-2xl font-bold text-slate-200 shrink-0 pt-0.5 leading-none select-none">{s.number}</span>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1.5">{s.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="border-t border-slate-100 mb-12" />



      </div>
    </main>
  );
}
