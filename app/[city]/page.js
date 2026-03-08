import CityComponent from "@/components/CityComponent";
import { fetchProperties, fetchMedia } from "@/lib/api";
import { slugToCity } from "@/lib/slug";

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityName = slugToCity(city);
  const data = await fetchProperties({
    cityToPass: cityName,
    top: 1,
  });
  const count = data.totalCount || 0;
  const countStr = count > 0 ? `${count}+ ` : "";

  return {
    title: `Business Opportunities for Sale in ${cityName} | Ravi Singh Godara`,
    description: `Explore ${countStr}business listings for sale in ${cityName}. Find your next investment opportunity among our curated selection of properties.`,
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
