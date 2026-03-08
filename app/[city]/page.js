import CityComponent from "@/components/CityComponent";
import { fetchProperties, fetchMedia } from "@/lib/api";
import { slugToCity } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";

export async function generateMetadata({ params, searchParams }) {
  const { city } = await params;
  const sParams = await searchParams;
  const cityName = slugToCity(city);
  
  const businessType = sParams.businessType || undefined;
  const listingType = sParams.listingType || "sale";

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

  return {
    title: businessType ? `${businessLabel} ${listingLabel} in ${cityName} | Bizmonk` : `Business Opportunities in ${cityName} | Bizmonk`,
    description: businessType ? `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizmonk.` : `${cityName} businesses for sale. Book a showing for gas stations, restaurants, motels, convenience stores and lands. Prices from $1 to $5,000,000. Open houses available.`,
    openGraph: {
      title: businessType ? `${businessLabel} ${listingLabel} in ${cityName} | Bizmonk` : `Business Opportunities in ${cityName} | Bizmonk`,
      description: businessType ? `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizmonk.` : `${cityName} businesses for sale. Book a showing for gas stations, restaurants, motels, convenience stores and lands. Prices from $1 to $5,000,000. Open houses available.`,
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
      properties={itemsWithMedia}
      pagination={{
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalCount: data.totalCount,
      }}
    />
  );
}
