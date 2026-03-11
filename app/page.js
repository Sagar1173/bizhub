import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { fetchMedia, fetchProperties } from "@/lib/api";
import RegisterNowModal from "@/components/RegisterNowModal";
import { pickPropertyMainImage } from "@/lib/media";

export const metadata = {
  title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
  description:
    "Looking for a business in Greater Toronto Area? Bizmonk is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
  keywords: "Restaurants, Convenience Stores, Businesses for Sale, Ontario",
  openGraph: {
    title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
    description:
      "Looking for a business in Greater Toronto Area? Bizmonk is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
    images: "/office.jpeg",
  },
};

export default async function Home() {
  const sectionsToFetch = [
    {
      title: "Restaurants for Sale",
      businessType: "Restaurant",
      href: "/toronto/restaurant-for-sale",
    },
    {
      title: "Convenience Stores for Sale",
      businessType: "Convenience/Variety",
      href: "/toronto/convenience-store-for-sale",
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
      href: "/brampton/restaurant-for-sale",
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
              name: "Bizmonk",
              url: "https://www.bizmonk.ca",
              logo: "https://www.bizmonk.ca/office.jpeg",
              description:
                "Bizmonk connects buyers and sellers of restaurants, convenience stores, and other businesses for sale across Ontario.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1065 Canadian Place #207",
                addressLocality: "Mississauga",
                addressRegion: "ON",
                postalCode: "L4W 0C2",
                addressCountry: "CA",
              },
              email: "mailto:info@ravigodara.com",
              telephone: ["+1-905-226-7284"],
            }),
          }}
        />
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
        <ContactSection header="Couldn't find what you are looking for?" />
        <RegisterNowModal />
      </main>
    </div>
  );
}
