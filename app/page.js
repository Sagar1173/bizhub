import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { fetchMedia, fetchProperties } from "@/lib/api";
import RegisterNowModal from "@/components/RegisterNowModal";
import { pickPropertyMainImage } from "@/lib/media";

// Force server-side rendering on every request.
// The homepage fetches live MLS listings — prerendering at build time is
// incorrect (data would be stale) and causes Vercel build failures if
// MLS_BASE_URL / MLS_TOKEN are not available during the build phase.
// Individual fetch() calls in lib/api.js use { next: { revalidate: 60 } }
// which still caches responses at the CDN/data-cache layer.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
  description:
    "Looking for a business in Greater Toronto Area? Bizhub is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
  keywords: "Restaurants, Convenience Stores, Businesses for Sale, Ontario",
  openGraph: {
    title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
    description:
      "Looking for a business in Greater Toronto Area? Bizhub is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
    images: "/office.jpeg",
  },
};

export default async function Home() {
  const sectionsToFetch = [
    {
      title: "Featured Listings",
      businessType: undefined,
      cityToPass: undefined,
      officeName: "BIZHUB REAL ESTATE INC.",
      href: "/featured-listings",
      top: 10,
    },
    {
      title: "Restaurants for Sale in GTA",
      businessType: "Restaurant",
      cityToPass: "GTA",
      href: "/gta/restaurant-for-sale",
    },
    {
      title: "Convenience Stores for Sale in GTA",
      businessType: "Convenience/Variety",
      cityToPass: "GTA",
      href: "/gta/convenience-store-for-sale",
    },
    {
      title: "Offices for Sale in GTA",
      businessType: "Office",
      cityToPass: "GTA",
      href: "/gta/office-for-sale",
    },
    {
      title: "Retail Units for Sale in GTA",
      businessType: "Retail",
      cityToPass: "GTA",
      href: "/gta/retail-for-sale",
    },
    {
      title: "Businesses for Sale in GTA",
      businessType: undefined,
      cityToPass: "GTA",
      href: "/gta",
    },
  ];

  const featuredSections = await Promise.all(
    sectionsToFetch.map(async (sectionData) => {
      const data = await fetchProperties({
        listingType: "sale",
        businessType: sectionData.businessType,
        cityToPass: sectionData.cityToPass,
        officeName: sectionData.officeName,
        top: sectionData.top || 8,
        skip: 0,
      });

      const properties = await Promise.all(
        (data.items || []).map(async (property) => {
          const media = await fetchMedia(property.ListingKey, 5);
          const withMedia = { ...property, Media: media };
          return {
            ...withMedia,
            mainImage: pickPropertyMainImage(withMedia),
          };
        }),
      );

      return {
        title: sectionData.title,
        href: sectionData.href,
        properties,
        totalCount: Number(data.totalCount) || properties.length,
      };
    }),
  );

  const activeSections = featuredSections.filter(
    (section) => section.properties.length > 0,
  );

  return (
    <div className="min-h-screen bg-white">
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bizhub",
              url: "https://www.bizhub.ca",
              logo: "https://www.bizhub.ca/office.jpeg",
              description:
                "Bizhub connects buyers and sellers of restaurants, convenience stores, and other businesses for sale across Ontario.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1065 Canadian Place #207",
                addressLocality: "Mississauga",
                addressRegion: "ON",
                postalCode: "L4W 0C2",
                addressCountry: "CA",
              },
              email: "mailto:info@bizhub.ca",
              telephone: ["+1-905-226-7284"],
            }),
          }}
        />
        <Hero />
        {activeSections.map((section, index) => (
          <FeaturedPropertiesSection
            key={section.title}
            sectionId={index === 0 ? "listings" : undefined}
            title={section.title}
            href={section.href}
            properties={section.properties}
            totalCount={section.totalCount}
          />
        ))}

        {/* <InstagramFeed /> */}
        <TestimonialsSection />
        <ContactSection header="Couldn't find what you are looking for?" />
        <RegisterNowModal />
      </main>
    </div>
  );
}
