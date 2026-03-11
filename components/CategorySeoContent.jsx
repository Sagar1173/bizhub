import seoContent from "@/data/category-seo-content.json";

function interpolate(template, vars) {
  if (typeof template !== "string") return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] === undefined || vars[key] === null ? "" : String(vars[key]),
  );
}

function interpolateArray(arr, vars) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => interpolate(item, vars)).filter(Boolean);
}

export default function CategorySeoContent({
  cityName,
  slug,
  businessType,
  listingType,
  categoryLabel,
}) {
  const listingLabel = listingType === "lease" ? "for lease" : "for sale";
  const vars = {
    city: cityName,
    listingLabel,
    category: categoryLabel,
  };

  const override = slug ? seoContent.overridesBySlug?.[slug] : null;
  const template =
    seoContent.templatesByBusinessType?.[businessType] ||
    seoContent.templatesByBusinessType?.default;

  const title = interpolate(
    override?.title || template?.title || "{category} {listingLabel} in {city}",
    vars,
  );
  const intro = interpolateArray(override?.intro ?? template?.intro, vars);
  const sections = (override?.sections ?? template?.sections ?? []).map((s) => ({
    heading: interpolate(s.heading, vars),
    body: interpolateArray(s.body, vars),
    bullets: interpolateArray(s.bullets, vars),
  }));
  const faqs = (override?.faqs ?? template?.faqs ?? []).map((f) => ({
    q: interpolate(f.q, vars),
    a: interpolate(f.a, vars),
  }));

  if (!title && intro.length === 0 && sections.length === 0 && faqs.length === 0)
    return null;

  return (
    <section
      aria-labelledby="category-seo-content"
      className="mx-auto mt-12 max-w-7xl px-4 pb-16 md:px-8"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h2
          id="category-seo-content"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {title}
        </h2>

        {intro.length > 0 ? (
          <div className="mt-4 space-y-3 text-base leading-7 text-slate-700 md:text-[17px]">
            {intro.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        ) : null}

        {sections.length > 0 ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {sections.map((s, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 p-5 md:p-6">
                <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
                  {s.heading}
                </h3>
                {s.body?.length ? (
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700 md:text-base">
                    {s.body.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                ) : null}
                {s.bullets?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 md:text-base">
                    {s.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {faqs.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
              FAQs
            </h3>
            <dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {faqs.map((f, idx) => (
                <div key={idx} className="p-5 md:p-6">
                  <dt className="text-base font-semibold text-slate-900">
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-700 md:text-base">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}

