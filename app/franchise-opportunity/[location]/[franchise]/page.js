//franchise-opportunity > [location] > [franchise] > page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLocationContent,
  franchiseLocations,
} from "@/constants/franchise-data";
import HeroSection from "./_components/HeroSection";
import RelatedFranchises from "./_components/RelatedFranchises";
import ExploreMoreCities from "./_components/ExploreMoreCities";
import ContactForm from "./_components/ContactForm";
import FloatingFranchise from "./_components/FloatingFranchise";
import { Suspense } from "react";
import VideoSection from "./_components/VideoSection";

export default async function FranchiseDetailPage({ params }) {
  const { location, franchise } = await params;

  try {
    const locationData = getLocationContent(location);
    if (!locationData?.franchises?.length) {
      notFound();
    }
    const franchiseData = locationData.franchises.find(
      (f) =>
        f.name.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "") ===
        franchise,
    );

    if (!franchiseData) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        {/* Main Content Layout with Sticky Contact Form */}
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Hero and Video Section with Sticky Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 ">
            {/* Left Content Area */}
            <div className="lg:col-span-2 py-8 space-y-8">
              {/* Hero Section */}
              <HeroSection franchiseData={franchiseData} location={location} />

              {/* Video Section - Will only show for franchises with video */}
              <div className="mt-8">
                <VideoSection videoUrl={franchiseData.video} />
              </div>
            </div>

            {/* Right Sticky Contact Form - Only for Hero and Video sections */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 pt-10 ">
                <Suspense fallback={<div>Loading contact form...</div>}>
                  <ContactForm
                    contactImage={
                      franchiseData?.contactImage
                        ? franchiseData?.contactImage
                        : franchiseData?.image
                    }
                    pageName={franchiseData?.name}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Full Width Sections Below */}
          <div className="w-full space-y-12 py-8">
            {/* Related Franchises Section - Full Width */}
            <RelatedFranchises
              franchiseData={franchiseData}
              locationData={locationData}
              location={location}
            />

            {/* Explore More Cities Section - Full Width */}
            <ExploreMoreCities
              franchise={franchise}
              franchiseData={franchiseData}
            />
          </div>
        </div>

        {/* Floating Franchise Button */}
        <FloatingFranchise franchiseName={franchiseData.name} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return Object.entries(franchiseLocations).flatMap(([location, data]) =>
    (data?.franchises || [])
      .filter((f) => f && f.name) // skip undefined or missing name
      .map((franchise) => ({
        location,
        franchise: franchise.name.toLowerCase().replace(/['\s]+/g, "-"),
      })),
  );
}
export async function generateMetadata({ params }, parent) {
  const { location, franchise } = await params;
  try {
    const locationText = location
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const locationData = getLocationContent(location);
    const franchiseData = locationData.franchises.find(
      (f) =>
        f.name.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "") ===
        franchise,
    );

    const metadata = {
      title:
        franchiseData?.name +
        " Franchise Opportunity in " +
        locationText +
        " | Bizhub",
      description: `${franchiseData?.name} franchise opportunities now available in ${locationText}. Start your own successful business with expert guidance and a trusted brand.`,
    };
    return metadata;

    if (!franchiseData) {
      notFound();
    }
  } catch (err) {
    console.log(err);
  }
}
