import React from "react";
import Link from "next/link";

const RelatedFranchises = ({ franchiseData, locationData, location }) => {
  return (
    <div className="py-12 md:max-w-6xl mx-auto">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-3xl font-bold mb-12 text-left">
          Other Franchise Opportunities in{" "}
          {location.charAt(0).toUpperCase() + location.slice(1)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locationData.franchises
            .filter((f) => f.name !== franchiseData.name)
            .map((franchise) => (
              <Link
                key={franchise.name}
                href={`/franchise-opportunity/${location}/${franchise.name
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replaceAll("'", "")}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  {franchise.image && (
                    <img
                      src={franchise.image}
                      alt={franchise.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/20 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-5 text-left">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold mb-1 text-black">
                      {franchise?.name}
                    </h3>
                    <p className="text-sm text-black inline-block px-3 py-1 rounded-full mb-3 bg-slate-50 border border-slate-100">
                      {franchise?.type}
                    </p>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-xs line-clamp-2">
                    {franchise?.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-start">
                    <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors font-medium text-xs">
                      Learn More
                    </button>
                    <button className="px-4 py-1 border-2 border-black text-black rounded-full hover:bg-black/5 transition-colors font-medium text-xs">
                      Contact
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedFranchises;
