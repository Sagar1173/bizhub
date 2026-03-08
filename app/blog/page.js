import Link from "next/link";
import React from "react";

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      {/* --- 1. HERO SECTION --- */}
      <section className="bg-[#f2f9e9] py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">
              Reading room
            </h1>
            <p className="uppercase text-xs font-bold tracking-widest text-gray-500 mb-2">
              Buying, Financing
            </p>
            <h2 className="text-2xl font-bold mb-4">The homebuyer guide</h2>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Are you ready to buy a home? Answer a few quick questions to
              instantly find out your next step.
            </p>
            <button className="bg-[#addc33] hover:bg-[#9cc62e] text-black px-8 py-3 rounded-full font-bold transition">
              Read article
            </button>
          </div>
          <div className="flex-1 w-full">
            <img
              src="/blog.png"
              alt="Homebuyer Illustration"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* --- 2. POPULAR SECTION --- */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-8">Popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SmallCard
            title="A guide to buying a home in winter"
            category="Buying"
            img="https://picsum.photos/seed/pop1/400/300"
          />
          <SmallCard
            title="The First Home Savings Account (FHSA) turns one"
            category="Buying, Financing"
            img="https://picsum.photos/seed/pop2/400/300"
          />
          <SmallCard
            title="What are the benefits of living in a walkable neighbourhood?"
            category="Moving"
            img="https://picsum.photos/seed/pop3/400/300"
          />
          <SmallCard
            title="5 things to look for when buying your first home"
            category="Buying"
            img="https://picsum.photos/seed/pop4/400/300"
          />
        </div>
      </section>

      {/* --- 3. CTA BANNER --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 mb-16">
        <div className="bg-[#004d4d] rounded-xl py-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif mb-8">
            Find your new home
          </h2>
          <Link
            href={"/blog"}
            className="border-2 border-white px-10 py-3 rounded-full font-bold hover:bg-white hover:text-[#004d4d] transition"
          >
            Search listings
          </Link>
        </div>
      </section>

      {/* --- 4. QUICK LINKS (3 Boxes) --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLinkBox
          title="Recent"
          desc="Latest articles and resources"
          link="Browse all articles"
        />
        <QuickLinkBox
          title="Mortgage resources"
          desc="Financial tools and guidance"
          link="Learn more about Mortgage resources"
        />
        <QuickLinkBox
          title="Market trends"
          desc="No-nonsense real estate insights"
          link="Learn more about Market trends"
        />
      </section>

      {/* --- 5. BUYING SECTION --- */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20 border-t border-gray-100">
        <h2 className="text-3xl font-bold mb-10">Buying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LargeCard
            title="5 Vancouver neighbourhoods great for walkability"
            category="Buying, Moving"
            img="https://picsum.photos/seed/buy1/600/400"
            date="01/22/24"
            readTime="5 min"
          />
          <LargeCard
            title="Can immigrants buy a home in Canada?"
            category="Buying"
            img="https://picsum.photos/seed/buy2/600/400"
            date="01/20/24"
            readTime="8 min"
          />
          <LargeCard
            title="Here's what you should know as a single homebuyer"
            category="Buying"
            img="https://picsum.photos/seed/buy3/600/400"
            date="01/18/24"
            readTime="6 min"
          />
        </div>
        <button className="mt-10 border border-black px-8 py-2 rounded-full font-bold hover:bg-black hover:text-white transition">
          Explore buying
        </button>
      </section>

      {/* --- 6. SELLING SECTION --- */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20 border-t border-gray-100">
        <h2 className="text-3xl font-bold mb-10">Selling</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Featured Selling Card */}
          <div className="lg:col-span-4 group cursor-pointer">
            <img
              src="https://picsum.photos/seed/sellmain/800/500"
              alt="Tips for selling"
              className="w-full aspect-[16/10] object-cover rounded-xl mb-4"
            />
            <p className="text-xs uppercase font-bold text-gray-500 mb-2">
              Selling
            </p>
            <h3 className="text-2xl font-bold mb-3 group-hover:underline">
              Tips for selling your home
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Ensure you're making the most out of your home sale by following
              these simple tips for selling your home.
            </p>
            <div className="flex items-center text-xs text-gray-400 gap-4">
              <span>📅 05/25/25</span>
              <span>⏱ 5 min</span>
            </div>
          </div>

          {/* Side Grid of Selling Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <HorizontalCard
              title="What happens when a buyer backs out of an offer?"
              category="Selling"
              img="https://picsum.photos/seed/s1/300/200"
            />
            <HorizontalCard
              title="How to stage a home for success"
              category="Selling"
              img="https://picsum.photos/seed/s2/300/200"
            />
            <HorizontalCard
              title="The cost of selling a house in Canada"
              category="Selling"
              img="https://picsum.photos/seed/s3/300/200"
            />
            <HorizontalCard
              title="Can a seller back out of an offer in Canada?"
              category="Buying, Selling"
              img="https://picsum.photos/seed/s4/300/200"
            />
            <HorizontalCard
              title="How to hold an open house"
              category="Selling"
              img="https://picsum.photos/seed/s5/300/200"
            />
            <HorizontalCard
              title="5 ways to sell your home fast"
              category="Selling"
              img="https://picsum.photos/seed/s6/300/200"
            />
          </div>
        </div>
        <button className="mt-10 border border-black px-8 py-2 rounded-full font-bold hover:bg-black hover:text-white transition">
          Explore selling
        </button>
      </section>

      {/* --- 7. FOOTER COLUMNS (Financing, Owning, Moving) --- */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        {/* Financing Column */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Financing</h2>
          <div className="space-y-6">
            <HorizontalCard
              title="Mortgage tips 101"
              category="Financing"
              img="https://picsum.photos/seed/f1/200/150"
              smallTitle
            />
            <HorizontalCard
              title="Can your mortgage be denied after pre-approval?"
              category="Financing"
              img="https://picsum.photos/seed/f2/200/150"
              smallTitle
            />
            <HorizontalCard
              title="Top financial mistakes by first-time homebuyers"
              category="Financing"
              img="https://picsum.photos/seed/f3/200/150"
              smallTitle
            />
          </div>
          <button className="border border-black px-6 py-2 rounded-full text-sm font-bold hover:bg-black hover:text-white transition">
            Explore financing
          </button>
        </div>

        {/* Owning Column */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Owning</h2>
          <div className="space-y-6">
            <HorizontalCard
              title="Design tips for your kitchen, home and outdoor spaces"
              category="Owning"
              img="https://picsum.photos/seed/o1/200/150"
              smallTitle
            />
            <HorizontalCard
              title="What is a green home and can it reduce emissions?"
              category="Owning"
              img="https://picsum.photos/seed/o2/200/150"
              smallTitle
            />
            <HorizontalCard
              title="Home maintenance guide for homeowners"
              category="Owning"
              img="https://picsum.photos/seed/o3/200/150"
              smallTitle
            />
          </div>
          <button className="border border-black px-6 py-2 rounded-full text-sm font-bold hover:bg-black hover:text-white transition">
            Explore owning
          </button>
        </div>

        {/* Moving Column */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Moving</h2>
          <div className="space-y-6">
            <HorizontalCard
              title="5 Vancouver neighbourhoods great for walkability"
              category="Buying, Moving"
              img="https://picsum.photos/seed/m1/200/150"
              smallTitle
            />
            <HorizontalCard
              title="What to do after moving into a new home"
              category="Moving"
              img="https://picsum.photos/seed/m2/200/150"
              smallTitle
            />
            <HorizontalCard
              title="5 Toronto area neighbourhoods great for first-time buyers"
              category="Buying, Moving"
              img="https://picsum.photos/seed/m3/200/150"
              smallTitle
            />
          </div>
          <button className="border border-black px-6 py-2 rounded-full text-sm font-bold hover:bg-black hover:text-white transition">
            Explore moving
          </button>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

function SmallCard({ title, category, img }) {
  return (
    <div className="group cursor-pointer">
      <img
        src={img}
        alt={title}
        className="w-full aspect-[4/3] object-cover rounded-xl mb-3 transition group-hover:opacity-90"
      />
      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
        {category}
      </p>
      <h3 className="text-sm font-bold leading-tight group-hover:underline">
        {title}
      </h3>
    </div>
  );
}

function LargeCard({ title, category, img, date, readTime }) {
  return (
    <div className="group cursor-pointer">
      <img
        src={img}
        alt={title}
        className="w-full aspect-video object-cover rounded-xl mb-4"
      />
      <p className="text-xs uppercase font-bold text-gray-500 mb-2">
        {category}
      </p>
      <h3 className="text-lg font-bold mb-3 group-hover:underline leading-snug">
        {title}
      </h3>
      <div className="flex items-center text-xs text-gray-400 gap-4">
        <span>📅 {date}</span>
        <span>⏱ {readTime}</span>
      </div>
    </div>
  );
}

function HorizontalCard({ title, category, img, smallTitle = false }) {
  return (
    <div className="flex gap-4 group cursor-pointer items-start">
      <div className="flex-shrink-0 w-24 h-16 md:w-32 md:h-20 overflow-hidden rounded-lg">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
          {category}
        </p>
        <h3
          className={`${smallTitle ? "text-sm" : "text-md"} font-bold leading-tight group-hover:underline`}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

function QuickLinkBox({ title, desc, link }) {
  return (
    <div className="bg-[#e9f7f7] p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{desc}</p>
      </div>
      <a href="#" className="text-xs font-bold flex items-center gap-2 group">
        <span className="border-b border-black pb-0.5 group-hover:text-gray-600 group-hover:border-gray-600">
          {link}
        </span>
        <span className="text-lg">→</span>
      </a>
    </div>
  );
}
