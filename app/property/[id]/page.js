import { fetchProperty } from "@/lib/api";
import RegisterNowModal from "@/components/RegisterNowModal";

export default async function PropertyPage({ params }) {
  const { id } = params;
  const property = await fetchProperty(id);

  return (
    <div className="relative">
      <div className="p-6">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(property, null, 2)}
        </pre>
      </div>

      <RegisterNowModal />

      <section
        id="book-showing-form"
        className="mt-10 border-t border-slate-200 bg-slate-50 px-6 py-8"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Book a Showing
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Share your details and we&apos;ll follow up to schedule a viewing.
        </p>

        <form className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-800"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="Your full name"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-800"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="Optional"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="message"
              className="text-sm font-medium text-slate-800"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="Share your preferred dates and any questions."
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-150 hover:scale-[1.02] active:scale-95"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
