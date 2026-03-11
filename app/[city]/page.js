import CityComponent from "@/components/CityComponent";
import { fetchProperties, fetchMedia } from "@/lib/api";
import { slugToCity, generatePropertySlug } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";
import RegisterNowModal from "@/components/RegisterNowModal";
import { getPropertyImageCandidates, pickPropertyMainImage } from "@/lib/media";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://bizmonk.ca";

const toOgImage = (url, alt) => {
  if (!url) return null;
  return { url, alt: alt || "Bizmonk listing" };
};

export async function generateMetadata({ params, searchParams }) {
  const { city } = await params;
  const sParams = await searchParams;
  const cityName = slugToCity(city);

  const businessType = sParams.businessType || undefined;
  const listingType = sParams.listingType || "sale";

  const hasNonCanonicalParams =
    Boolean(businessType) ||
    listingType !== "sale" ||
    (Number(sParams.page) || 1) > 1 ||
    (sParams.sort && sParams.sort !== "newest") ||
    Boolean(sParams.minPrice) ||
    Boolean(sParams.maxPrice) ||
    Boolean(sParams.priceMax) ||
    Boolean(sParams.beds) ||
    Boolean(sParams.baths);

  const data = await fetchProperties({
    cityToPass: cityName,
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

  const canonicalPath = `/${city}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();

  const title = businessType
    ? `${businessLabel} ${listingLabel} in ${cityName} | Bizmonk`
    : `Business Opportunities in ${cityName} | Bizmonk`;

  const description = businessType
    ? `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizmonk.`
    : `${cityName} businesses for sale. Book a showing for gas stations, restaurants, motels, convenience stores and lands. Prices from $1 to $5,000,000. Open houses available.`;

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
    robots: hasNonCanonicalParams
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Bizmonk",
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

export default async function CityPage({ params, searchParams }) {
  const { city } = await params;

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
  const cityToPass = slugToCity(city);
  const data = await fetchProperties({
    cityToPass,
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

      // Keep the old safety check, but fall back to another candidate if the first breaks.
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

  const baseListUrl = new URL(`/${city}`, SITE_URL).toString();

  const cityName = slugToCity(city);
  const listingLabel = listingType === "lease" ? "for Lease" : "for Sale";
  const businessLabel = businessType
    ? BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType
    : "Business Opportunities";
  const countStr = data.totalCount > 0 ? `${data.totalCount}+ ` : "";
  const headingTitle = businessType
    ? `${businessLabel} ${listingLabel} in ${cityName}`
    : `Business Opportunities ${listingLabel} in ${cityName}`;
  const headingDescription = `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on bizmonk.`;

  const products = itemsWithMedia.map((property) => {
    const href = `/${city}/${generatePropertySlug(property)}`;
    const url = new URL(href, SITE_URL).toString();
    const thumbnail = property.mainImage || pickPropertyMainImage(property);
    const businessType = Array.isArray(property.BusinessType)
      ? property.BusinessType[0]
      : property.BusinessType;
    const propertyType =
      BUSINESS_TYPE_DISPLAY_MAP[businessType] ||
      businessType ||
      property.PropertySubType ||
      "Property";
    const fullAddress =
      property.UnparsedAddress ||
      [property.StreetNumber, property.StreetName, property.City]
        .filter(Boolean)
        .join(" ");
    const agency = property.ListOfficeName || "Real Estate Professionals Inc.";

    return {
      "@type": "Product",
      "@id": url,
      name: fullAddress || `${propertyType} in ${slugToCity(city)}`,
      description:
        property.PublicRemarks ||
        `${propertyType || "Business opportunity"} in ${slugToCity(city)}`,
      image: thumbnail ? [thumbnail] : undefined,
      sku: property.ListingKey,
      category: "BusinessProperty",
      brand: agency
        ? {
            "@type": "Organization",
            name: agency,
          }
        : undefined,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "CAD",
        price: property.ListPrice || 0,
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: agency,
        },
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
          city={city}
          basePath={`/${city}`}
          searchParams={sParams}
          filter={{ businessType, listingType }}
          properties={itemsWithMedia}
          pagination={{
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          }}
          showHeader={false}
        />
      </main>
      <RegisterNowModal />
    </>
  );
}
