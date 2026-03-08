import Link from "next/link";
import { notFound } from "next/navigation";

import FranchisesList from "@/components/FranchisesList";
import { getLocationContent, franchiseLocations } from "@/constants/franchise-data";

const cities = Object.keys(franchiseLocations).map((key) => {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

export async function generateMetadata({ params }) {
  const { location } = await params;
  const locationData = getLocationContent(location);
  
  const title = locationData?.title ? `Franchise Opportunities in ${locationData.title} | Bizmonk` : `Franchise Opportunities in ${location} | Bizmonk`;
  const description = locationData?.title 
    ? `Explore franchise opportunities and business listings available in ${locationData.title}. Start your business journey today with Bizmonk.`
    : `Explore franchise opportunities and business listings available in ${location}. Start your business journey today with Bizmonk.`;
    
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    }
  };
}

export default async function FranchiseOpportunityPage({ params }) {
  const { location } = await params;

  try {
    const locationData = getLocationContent(location);
    if (!locationData?.franchises?.length) {
      notFound();
    }
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left max-w-5xl mx-auto mb-16">
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-5xl mb-3">
                <span className="text-black">{locationData?.title}</span>
              </h1>
              <p className="text-lg text-gray-600">
                {locationData?.description}
              </p>
            </div>

            {/* Franchise Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3 gap-2 max-w-6xl mx-auto">
              {locationData?.franchises.map((franchise) => (
                <Link
                  key={franchise.name}
                  href={`/franchise-opportunity/${location}/${franchise.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/'/g, "")}`}
                  className="px-3 py-2  text-white rounded-full font-medium text-xs"
                >
                  <div
                    key={franchise?.name}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image Section */}
                    <div className="relative h-64">
                      <img
                        src={franchise?.image}
                        alt={franchise?.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/20 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-4 text-left">
                      <div className=" text-left">
                        <h3 className="text-2xl font-bold mb-1 text-black">
                          {franchise?.name}
                        </h3>
                        <p className="text-sm text-black inline-block px-3 py-1 rounded-full mb-3">
                          {franchise?.type}
                        </p>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed text-xs ">
                        {franchise?.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-start">
                        <button className="px-3 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors font-medium text-xs">
                          Learn More
                        </button>
                        <button className="px-3 py-1 border-2 border-black text-black rounded-full hover:bg-black/5 transition-colors font-medium text-xs">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FranchisesList />

        {/* City Navigation Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left max-w-3xl mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Explore Business Opportunities
              </h2>
              <p className="text-gray-600">
                Discover franchise opportunities and other business listings
                across the Greater Toronto Area
              </p>
            </div>

            {/* Popular Cities */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-6 text-left">
                Popular Locations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/franchise-opportunity/${city
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    className={`${
                      location.toLowerCase() ===
                      city.toLowerCase().replaceAll(" ", "-")
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 hover:bg-primary/5"
                    } px-4 py-3 rounded-lg text-center transition-colors duration-300`}
                  >
                    <span className="text-sm font-medium">{city}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Business Opportunities */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link
                href={`/${location}/restaurant-for-sale`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                  Restaurants for Sale
                </h3>
                <p className="text-sm text-gray-600">
                  Find restaurant businesses available in {location}
                </p>
              </Link>

              <Link
                href={`/${location}/convenience-store-for-sale`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                  Convenience Stores
                </h3>
                <p className="text-sm text-gray-600">
                  Explore convenience store opportunities in {location}
                </p>
              </Link>

              <Link
                href={`/${location}/retail-lease`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                  Retail Leases
                </h3>
                <p className="text-sm text-gray-600">
                  Find available Retail Leases in {location}
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24  bg-gradient-to-r from-teal-500 to-blue-600">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-200 rounded-2xl p-12 text-left text-white max-w-5xl">
              <h2 className="text-3xl text-black font-bold mb-4">
                Ready to Start Your Franchise Journey?
              </h2>
              <p className="text-lg mb-8 max-w-2xl text-black">
                Our franchise experts are here to help you find the perfect
                opportunity and guide you through the entire process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  Schedule Consultation
                </Link>
                <Link
                  href="/franchise-guide"
                  className="px-8 py-3 bg-white text-black rounded-full hover:bg-white/20 transition-colors font-medium"
                >
                  Download Franchise Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Update static paths
export async function generateStaticParams() {
  return Object.keys(franchiseLocations).map((location) => ({
    location,
  }));
}
