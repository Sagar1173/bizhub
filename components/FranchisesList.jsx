"use client";

import Link from "next/link";
import { franchiseLocations } from "@/constants/franchise-data";
import AllListingsSection from "./AllListingsSection";

const FranchisesList = () => {
  const franchises = franchiseLocations.ontario.franchises ?? [];
  const totalCount = franchises.length;

  return (
    <div className="w-full">
      <AllListingsSection
        franchises={franchises}
        title="Franchise Opportunities in Ontario"
        seeAllHref="/franchise-opportunity/ontario"
        totalCount={totalCount}
        locationSlug="ontario"
      />
      <div className="flex w-full justify-start mt-8 pb-12">
        <Link
          href="#contact"
          className="inline-flex items-center justify-center px-10 py-4 bg-black text-white rounded-full font-bold text-base hover:bg-gray-800 transition-all active:scale-95"
        >
          Request Portfolio
        </Link>
      </div>
    </div>
  );
};

export default FranchisesList;
