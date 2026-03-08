import React from "react";
import {
  Utensils,
  Store,
  Building2,
  LineChart,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About BizMonk | Your Premier Commercial Real Estate Destination",
  description:
    "Learn more about BizMonk, your premier destination for finding the perfect commercial space in the Greater Toronto Area. We specialize in restaurant, retail, and franchise locations across Ontario.",
};

const AboutPage = () => {
  const whatWeDo = [
    {
      title: "Restaurant Spaces",
      description: "Prime locations for restaurants, cafes, and food service businesses",
      icon: <Utensils className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Retail Solutions",
      description: "Ideal spaces for convenience stores and retail businesses",
      icon: <Store className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Franchise Opportunities",
      description: "Strategic locations for franchise expansion and growth",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Market Analysis",
      description: "Comprehensive insights into Ontario's commercial real estate market",
      icon: <LineChart className="h-6 w-6 text-blue-600" />,
    },
  ];

  const whyChooseUs = [
    "Extensive network of premium commercial spaces in GTA",
    "Specialized expertise in restaurant and retail locations",
    "Tailored solutions for franchises and business owners",
  ];

  return (
    <main className="bg-white text-gray-900 pb-20">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-serif text-4xl font-bold sm:text-6xl text-slate-900 leading-tight">
              About BizMonk
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Welcome to BizMonk, your premier destination for finding the perfect commercial space in the Greater Toronto Area. We specialize in connecting business owners with ideal locations for restaurants, convenience stores, franchises, and various commercial ventures across Ontario. Our platform makes it simple to discover and secure the business space that matches your vision.
            </p>
          </div>
          <div className="mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white/50">
              <img
                src="/profile2.jpg"
                alt="Ravi Singh Godara - BizMonk"
                className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vision & Mission */}
        <section className="py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Our Vision</h2>
              <div className="h-1 w-12 bg-blue-600 mt-4 mb-6 rounded-full" />
              <p className="text-slate-600 leading-relaxed text-lg">
                Our vision is to become Ontario's most trusted platform for commercial real estate and business space solutions. We are committed to empowering entrepreneurs and business owners by providing them with access to premium commercial spaces and comprehensive market insights.
              </p>
            </div>
            <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Our Mission</h2>
              <div className="h-1 w-12 bg-blue-600 mt-4 mb-6 rounded-full" />
              <p className="text-slate-600 leading-relaxed text-lg">
                Our mission is to simplify the process of finding and securing the perfect business location in the GTA and beyond. We aim to be the bridge between visionary business owners and their next successful location.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 border-y border-slate-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-slate-900 text-center mb-10">Why Choose BizMonk?</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {whyChooseUs.map((text, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="bg-blue-600/10 p-3 rounded-full mb-4">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-800 leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-slate-900">What We Do</h2>
            <p className="mt-4 text-slate-600 text-lg">Specialized solutions for every business need</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whatWeDo.map((item, index) => (
              <div key={index} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 group">
                <div className="bg-slate-50 p-4 rounded-2xl w-fit group-hover:bg-blue-50 transition-colors mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
