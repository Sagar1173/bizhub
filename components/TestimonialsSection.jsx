import React from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael Chen",
      date: "2024-10-09",
      text: "Ravi is amazing! We had the best experience with him. He was extremely patient, kind and professional and was able to find the perfect place for my family. He is the best.",
      initial: "M",
    },
    {
      name: "Sarah Miller",
      date: "2024-10-08",
      text: "We had the absolute pleasure of working with Ravi, and we couldn't be more grateful for his outstanding service. From the very beginning, he demonstrated remarkable market knowledge.",
      initial: "S",
    },
    {
      name: "Priya Roy",
      date: "2024-09-28",
      text: "Since three months we were trying to find a unit in GTA and I worked with multiple brokers but there was no luck. Ravi has been super efficient and smart in helping me find a home.",
      initial: "P",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Header - High End Style */}
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2 uppercase">
            What our clients are saying
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#f8f9fa] p-6 sm:p-8 rounded-xl border border-slate-100 flex flex-col h-full shadow-sm"
            >
              {/* Profile Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{t.date}</p>
                  </div>
                </div>
                <div className="w-5 h-5 opacity-100">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-slate-600 text-[14px] leading-relaxed grow italic">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
