import CityComponent from "@/components/CityComponent";
import { fetchProperties, fetchMedia } from "@/lib/api";
import { generatePropertySlug } from "@/lib/slug";
import RegisterNowModal from "@/components/RegisterNowModal";
import { getPropertyImageCandidates, pickPropertyMainImage } from "@/lib/media";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://bizhub.ca";

const toOgImage = (url, alt) => {
  if (!url) return null;
  return { url, alt: alt || "Bizhub featured listing" };
};

export async function generateMetadata({ searchParams }) {
  const sParams = await searchParams;
  const businessType = sParams.businessType || undefined;
  const listingType = sParams.listingType || "sale";

  const data = await fetchProperties({
    officeName: "BIZHUB REAL ESTATE INC.",
    businessType,
    listingType,
    top: 1,
  });

  const count = data.totalCount || 0;
  const countStr = count > 0 ? `${count}+ ` : "";
  const listingLabel = listingType === "lease" ? "for lease" : "for sale";
  const businessLabel = businessType
    ? BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType
    : "Business Opportunities";

  const canonicalPath = `/featured-listings`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();

  const title = `Featured ${businessLabel} ${listingLabel} | Bizhub`;
  const description = `${countStr}Featured ${businessLabel} ${listingLabel} presented by BIZHUB REAL ESTATE INC.. Browse updated daily listings on BizHub.`;

  let ogImageUrl = null;
  const first = data.items?.[0];
  if (first?.ListingKey) {
    const media = await fetchMedia(first.ListingKey, 1);
    ogImageUrl = media?.[0]?.MediaURL || null;
  }

  const fallbackImage = "/office.jpeg";
  const ogImage = toOgImage(ogImageUrl || fallbackImage, `${title}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Bizhub",
      type: "website",
      locale: "en_CA",
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage?.url ? [ogImage.url] : undefined,
    },
  };
}

export default async function FeaturedListingsPage({ searchParams }) {
  const sParams = await searchParams;

  const currentPage = Number(sParams.page) || 1;
  const limit = 20;
  const skip = (currentPage - 1) * limit;

  const beds = sParams.beds ? Number(sParams.beds) : undefined;
  const baths = sParams.baths ? Number(sParams.baths) : undefined;
  const businessType = sParams.businessType || undefined;
  const minPrice = sParams.minPrice ? Number(sParams.minPrice) : undefined;
  const maxPrice = sParams.maxPrice
    ? Number(sParams.maxPrice)
    : sParams.priceMax
      ? Number(sParams.priceMax)
      : undefined;
  const listingType = sParams.listingType || "sale";
  const sort = sParams.sort || "newest";

  const data = await fetchProperties({
    officeName: "BIZHUB REAL ESTATE INC.",
    top: limit,
    skip,
    beds,
    baths,
    businessType,
    minPrice,
    maxPrice,
    listingType,
    sort,
  });

  const itemsWithMedia = await Promise.all(
    (data.items || []).map(async (property) => {
      const media = await fetchMedia(property.ListingKey, 5);

      const withMedia = { ...property, Media: media };
      const candidates = getPropertyImageCandidates(withMedia);

      let mainImage = pickPropertyMainImage(withMedia);
      if (!mainImage) return { ...withMedia, mainImage: null };

      try {
        const res = await fetch(mainImage, { method: "HEAD" });
        if (!res.ok) {
          mainImage = candidates.find((u) => u && u !== mainImage) || null;
        }
      } catch {
        mainImage = candidates.find((u) => u && u !== mainImage) || null;
      }

      return { ...withMedia, mainImage };
    }),
  );

  const baseListUrl = new URL(`/featured-listings`, SITE_URL).toString();

  const listingLabel = listingType === "lease" ? "for Lease" : "for Sale";
  const businessLabel = businessType
    ? BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType
    : "Business Opportunities";
  const countStr = data.totalCount > 0 ? `${data.totalCount}+ ` : "";
  const headingTitle = `${businessLabel} ${listingLabel} by BIZHUB REAL ESTATE INC.`;
  const headingDescription = `${countStr}Featured ${businessLabel} ${listingLabel}. Browse updated daily listings on bizhub.`;

  const products = itemsWithMedia.map((property) => {
    const citySlug = property.City ? property.City.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "gta";
    const href = `/${citySlug}/${generatePropertySlug(property)}`;
    const url = new URL(href, SITE_URL).toString();
    const thumbnail = property.mainImage || pickPropertyMainImage(property);
    const businessTypeStr = Array.isArray(property.BusinessType)
      ? property.BusinessType[0]
      : property.BusinessType;
    const propertyTypeStr =
      BUSINESS_TYPE_DISPLAY_MAP[businessTypeStr] ||
      businessTypeStr ||
      property.PropertySubType ||
      "Property";
    const fullAddress =
      property.UnparsedAddress ||
      [property.StreetNumber, property.StreetName, property.City]
        .filter(Boolean)
        .join(" ");
    const agency = property.ListOfficeName || "BIZHUB REAL ESTATE INC.";

    return {
      "@type": "Product",
      "@id": url,
      name: fullAddress || `${propertyTypeStr} in Ontario`,
      description: property.PublicRemarks || `${propertyTypeStr || "Business opportunity"} in Ontario`,
      image: thumbnail ? [thumbnail] : undefined,
      sku: property.ListingKey,
      category: "BusinessProperty",
      brand: agency ? { "@type": "Organization", name: agency } : undefined,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "CAD",
        price: property.ListPrice || 0,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: agency },
      },
    };
  });

  const itemListSchema =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          url: baseListUrl,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: product,
          })),
        }
      : null;

  return (
    <>
      {itemListSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
      ) : null}
      <main>
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 capitalize leading-tight">
              {headingTitle}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              {headingDescription}
            </p>
          </div>
        </div>
        <CityComponent
          city="gta"
          basePath={`/featured-listings`}
          searchParams={sParams}
          filter={{ businessType, listingType }}
          properties={itemsWithMedia}
          pagination={{
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          }}
          showHeader={false}
          showFilters={false}
        />
      </main>
      <RegisterNowModal />
    </>
  );
}
