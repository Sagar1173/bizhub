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
    </div>
  );
};

export default FranchisesList;
