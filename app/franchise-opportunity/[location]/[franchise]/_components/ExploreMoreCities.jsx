import { franchiseCities } from "@/constants/franchiseCities";
import Link from "next/link";
import React from "react";

const ExploreMoreCities = ({ franchise, franchiseData }) => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-left">
          Explore {franchiseData.name} in Other Cities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {franchiseCities.map((city) => (
            <Link
              key={city}
              href={`/franchise-opportunity/${city
                .toLowerCase()
                .replaceAll(" ", "-")}/${franchise}`}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-primary/5 transition-colors"
            >
              <span className="text-gray-900">{city}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreCities;
