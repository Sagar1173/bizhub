export const metadata = {
  title: "How to Save Thousands in Interest | Ravi Singh Godara",
  description: "Simple, proven strategies to pay your mortgage off faster and save thousands in interest.",
};

const strategies = [
  {
    number: "01",
    title: "Round Your Monthly Payment Up",
    body: "The results of this simple strategy can save you a fortune and drastically reduce the length of your mortgage. For example, if your monthly payment was $734, rounding it up to $800 per month could save you more than $48,000 in interest and cut 7.5 years off your mortgage.",
    highlight: "Save $48,000+ · Shorten by 7.5 years",
  },
  {
    number: "02",
    title: "Make One-Time Pre-Payments Using Tax Refunds",
    body: "Apply your annual income tax refund directly to your mortgage principal. On a $100,000 mortgage, a single $1,000 refund applied this way could save you over $8,600 in interest and shave more than a year off your mortgage.",
    highlight: "Save $8,600+ · 1+ year shorter",
  },
  {
    number: "03",
    title: "Choose a 15-Year Mortgage",
    body: "If you can afford it, a 15-year mortgage is far better than a 30-year. Monthly payments are only slightly higher, but the interest savings are incredible. On a $100,000 mortgage at 8%, you'd save $92,083 in interest over the life of the loan.",
    highlight: "Save $92,083 in interest",
  },
];

export default function SaveOnInterestPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">

        <header className="mb-12 pb-10 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1800ad" }}>Mortgage Strategy</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">
            How to Save Thousands in Interest &amp; Pay Your Mortgage Off Faster
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            A few simple strategies can make an enormous difference over the life of your mortgage. Here&apos;s how to put thousands back in your pocket.
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
          <p>There are a few easy ways to make extra principal payments that can save you a significant amount in interest and get you mortgage-free sooner than you thought possible.</p>
        </section>

        <section className="mb-14 space-y-10">
          {strategies.map((s) => (
            <div key={s.number} className="flex gap-5">
              <span className="text-2xl font-bold text-slate-200 shrink-0 pt-0.5 leading-none select-none">{s.number}</span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{s.body}</p>
                <span
                  className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ color: "#1800ad", background: "#f0eeff", border: "1px solid #ddd8ff" }}
                >
                  {s.highlight}
                </span>
              </div>
            </div>
          ))}
        </section>

        <div className="border-t border-slate-100 mb-12" />

        <section className="mb-12 text-slate-600 text-sm leading-relaxed">
          <p>Using these strategies is the easiest way to reduce your interest expenses and shorten your mortgage period. Even one applied consistently can have a dramatic impact.</p>
        </section>



      </div>
    </main>
  );
}
