import { ChevronRight, Shield, CheckCircle2, Star } from "lucide-react";

export const metadata = {
  title: "Sold Prices In Your Neighbourhood | Ravi Singh Godara",
  description: "Get a free report of recent sold prices in your neighbourhood from local expert Ravi Singh Godara.",
};

const features = [
  "Accurate, up-to-date sold listings",
  "Side-by-side property comparisons",
  "Delivered straight to your inbox",
];

export default function SoldPricesInYourNeighbourhoodPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1800ad" }}>Market Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Sold Prices In Your Neighbourhood
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Stop guessing. Get real recent sold prices and comparables for homes just like yours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <div className="space-y-8">
            <div className="flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img src="/profile2.jpg" alt="Ravi Singh Godara" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Ravi Singh Godara</p>
                <p className="text-sm font-medium" style={{ color: "#1800ad" }}>Market Expert · Real Estate Sales Person</p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-slate-500 ml-1">5.0 · 50+ reviews</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#1800ad" }} />
                  <p className="text-slate-700">{f}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-8">
              <p className="text-slate-500 text-sm leading-relaxed italic border-l-2 pl-4" style={{ borderColor: "#c4b8f5" }}>
                &ldquo;Ravi sent me a detailed sold report for my street. It gave me the confidence to price our home right.&rdquo;
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-3 pl-4">— Mark T., Scarborough</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Get Your Neighbourhood Report</h2>
            <p className="text-sm text-slate-500 mb-7">Ravi will send you real, localised sold data.</p>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1800ad] transition text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="(555) 123-4567"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1800ad] transition text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1800ad] transition text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="homeAddress" className="text-sm font-semibold text-slate-700">Your Neighbourhood</label>
                <input
                  id="homeAddress"
                  type="text"
                  name="homeAddress"
                  placeholder="e.g. 123 Main St, Toronto"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1800ad] transition text-sm"
                  required
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="group w-full h-13 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-sm"
                  style={{ background: "#1800ad" }}
                >
                  Send Me Sold Prices
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  No spam. Just highly relevant market data.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
