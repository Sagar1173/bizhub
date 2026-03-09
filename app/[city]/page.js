import CityComponent from "@/components/CityComponent";
import { fetchProperties, fetchMedia } from "@/lib/api";
import { slugToCity } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://bizmonk.ca";

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
  const businessLabel = businessType ? (BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType) : "Business Opportunities";

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
      const media = await fetchMedia(property.ListingKey, 1);

      return { ...property, Media: media };
    }),
  );

  return (
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
    />
  );
}
