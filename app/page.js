import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { fetchMedia, fetchProperties } from "@/lib/api";

export const metadata = {
  title: "Bizmonk | Restaurants, Convenience Store, Franchise and Commercial Space in Ontario",
  description:
    "Looking for a business space in Greater Toronto Area? Bizmonk is the best place to find your business space.",
};

export default async function Home() {
  const sectionsToFetch = [
    {
      title: "Restaurants for Sale",
      businessType: "Restaurant",
      href: "/ontario?businessType=Restaurant",
    },
    {
      title: "Convenience Stores for Sale",
      businessType: "Convenience/Variety",
      href: "/ontario?businessType=Convenience%2FVariety",
    },
    {
      title: "Businesses for Sale in Toronto",
      businessType: undefined,
      cityToPass: "Toronto",
      href: "/toronto",
    },
    {
      title: "Restaurants in Brampton",
      businessType: "Restaurant",
      cityToPass: "Brampton",
      href: "/brampton?businessType=Restaurant",
    },
    {
      title: "Businesses for Sale in Ajax",
      businessType: undefined,
      cityToPass: "Ajax",
      href: "/ajax",
    },
  ];

  const featuredSections = await Promise.all(
    sectionsToFetch.map(async (sectionData) => {
      const data = await fetchProperties({
        listingType: "sale",
        businessType: sectionData.businessType,
        cityToPass: sectionData.cityToPass,
        top: 8,
        skip: 0,
      });

      const properties = await Promise.all(
        (data.items || []).map(async (property) => {
          const media = await fetchMedia(property.ListingKey, 1);
          return {
            ...property,
            Media: media,
            thumbnail: media?.[0]?.MediaURL || null,
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
        <Hero />
        <div className="py-5"></div>
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
        <ContactSection header="Let's Connect" />
      </main>
    </div>
  );
}
