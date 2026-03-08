import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import InstagramFeed from "@/components/InstagramFeed";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { fetchMedia, fetchProperties } from "@/lib/api";
import { cityToSlug } from "@/lib/slug";

export const metadata = {
  title: "Bizmonk | Restaurants, Convenience Store, Franchise and Commercial Space in Ontario",
  description:
    "Looking for a business space in Greater Toronto Area? Bizmonk is the best place to find your business space.",
};

export default async function Home() {
  const communityCities = [
    "Toronto",
    "Richmond Hill",
    "Markham",
    "Vaughan",
    "Aurora",
    "Oakville",
  ];

  const featuredByCity = await Promise.all(
    communityCities.map(async (cityName) => {
      const data = await fetchProperties({
        cityToPass: cityName,
        listingType: "sale",
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
        cityName,
        citySlug: cityToSlug(cityName),
        properties,
        totalCount: Number(data.totalCount) || properties.length,
      };
    }),
  );

  const featuredSections = featuredByCity.filter(
    (section) => section.properties.length > 0,
  );

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        {featuredSections.map((section, index) => (
          <FeaturedPropertiesSection
            key={section.citySlug}
            sectionId={index === 0 ? "listings" : undefined}
            cityName={section.cityName}
            citySlug={section.citySlug}
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
