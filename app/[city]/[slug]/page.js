import { notFound } from "next/navigation";
import Link from "next/link";
import { Square, Car, ChevronRight, Home } from "lucide-react";
import GoSeeThisHome from "@/components/GoSeeThisHome";
import ScheduleViewing from "@/components/ScheduleViewing";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import { fetchMedia, fetchProperties, fetchProperty } from "@/lib/api";
import {
  slugToCity,
  extractListingKeyFromSlug,
  generatePropertySlug,
  toCategorySlug,
} from "@/lib/slug";
import PropertyMediaGallery from "@/components/PropertyMediaGallery";
import ScrollToTop from "@/components/ScrollToTop";
import ShareButton from "@/components/ShareButton";
import HomeDetailsTabs from "@/components/HomeDetailsTabs";
import CityComponent from "@/components/CityComponent";
import CategorySeoContent from "@/components/CategorySeoContent";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";
import { pickPropertyMainImage } from "@/lib/media";
import RegisterNowModal from "@/components/RegisterNowModal";
import RequestInfoModal from "@/components/RequestInfoModal";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://bizhub.ca";

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return num.toLocaleString();
};

const formatAddress = (p) => {
  if (!p) return "Address unavailable";
  if (p.UnparsedAddress) return p.UnparsedAddress;
  const parts = [
    [p.StreetNumber, p.StreetName, p.StreetSuffix].filter(Boolean).join(" "),
    p.UnitNumber ? `#${p.UnitNumber}` : null,
    p.City,
    p.StateOrProvince,
    p.PostalCode,
  ].filter(Boolean);
  return parts.join(", ");
};

const formatBreadcrumbAddress = (p) => {
  if (!p) return "Listing";
  const street = [p.StreetNumber, p.StreetName, p.StreetSuffix]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (street) return street;
  if (p.UnparsedAddress) return String(p.UnparsedAddress).split(",")[0].trim();
  return "Listing";
};

const formatList = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "-";

const fallbackText = (value, fallback = "-") =>
  value === null || value === undefined || value === "" ? fallback : value;

const pluralizeBusinessType = (type) => {
  if (!type) return "";
  const mapping = {
    Restaurant: "Restaurants",
    Office: "Offices",
    "Professional Office": "Offices",
    Retail: "Retail Units",
    "Convenience/Variety": "Convenience Stores",
    "Medical/Dental": "Medical/Dental Practices",
  };
  return mapping[type] || `${type} Businesses`;
};

const getTimeAgo = (dateString) => {
  if (!dateString) return "New";
  const now = new Date();
  const listed = new Date(dateString);
  const diff = now - listed;
  if (!Number.isFinite(diff) || diff < 0) return "New";

  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months}mo ago`;

  return `${Math.floor(days / 365.25)}y ago`;
};

const parseSlug = (slug) => {
  const normalized = String(slug || "")
    .trim()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const match = normalized.match(/^(.+)-for-(sale|lease)$/);
  if (!match) return null;
  const businessTypeRaw = match[1];

  const mapping = {
    "medical-dental": "Medical/Dental",
    "convenience-variety": "Convenience/Variety",
    "convenience-store": "Convenience/Variety",
    "fast-food-takeout": "Fast Food/Takeout",
    "dry-cleaning-laundry": "Dry Cleaning/Laundry",
    office: "Professional Office",
  };

  const mapped = mapping[businessTypeRaw];
  if (mapped) return { businessType: mapped, listingType: match[2] };

  const businessType = businessTypeRaw
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    businessType,
    listingType: match[2],
  };
};

export async function generateMetadata({ params }) {
  const { city, slug } = await params;
  const filter = parseSlug(slug);
  const cityName = slugToCity(city);

  if (filter) {
    const data = await fetchProperties({
      cityToPass: cityName,
      businessType: filter.businessType,
      listingType: filter.listingType,
      top: 1,
    });
    const count = data.totalCount || 0;
    const countStr = count > 0 ? `${count}+ ` : "";
    const typeLabel = filter.businessType;
    const listingLabel =
      filter.listingType === "lease" ? "for lease" : "for sale";
    const businessLabel = BUSINESS_TYPE_DISPLAY_MAP[typeLabel] || typeLabel;

    let ogImageUrl = null;
    const first = data.items?.[0];
    if (first?.ListingKey) {
      const media = await fetchMedia(first.ListingKey, 1);
      ogImageUrl = media?.[0]?.MediaURL || null;
    }
    const fallbackImage = "/office.jpeg";
    const finalOgImage = ogImageUrl || fallbackImage;

    return {
      title: `${pluralizeBusinessType(typeLabel)} ${listingLabel} in ${cityName} | Bizhub`,
      description: `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizhub.`,
      openGraph: {
        title: `${pluralizeBusinessType(typeLabel)} ${listingLabel} in ${cityName} | Bizhub`,
        description: `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizhub.`,
        images: finalOgImage ? [{ url: finalOgImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${pluralizeBusinessType(typeLabel)} ${listingLabel} in ${cityName} | Bizhub`,
        description: `${countStr}${businessLabel} ${listingLabel} in ${cityName}. Browse updated daily listings on Bizhub.`,
        images: finalOgImage ? [finalOgImage] : undefined,
      },
    };
  }

  const extractedSlug = extractListingKeyFromSlug(slug);
  const data = await fetchProperty(extractedSlug);
  if (!data) {
    return {
      title: "Property Not Found | Bizhub",
      description: "The property you are looking for is no longer available.",
    };
  }
  const address = formatAddress(data);
  const price = data.ListPrice
    ? `$${Number(data.ListPrice).toLocaleString()}`
    : "Property";

  let ogImageUrl = null;
  const media = await fetchMedia(extractedSlug, 1);
  ogImageUrl = media?.[0]?.MediaURL || null;
  const fallbackImage = "/office.jpeg";
  const finalOgImage = ogImageUrl || fallbackImage;

  return {
    title: `${address} · ${price}  | Bizhub`,
    description: `View details, photos, and amenities for this ${data.PropertySubType || "business"} in ${cityName}.`,
    openGraph: {
      title: `${price} · ${address} | Bizhub`,
      description: `View details, photos, and amenities for this ${data.PropertySubType || "business"} in ${cityName}.`,
      images: finalOgImage ? [{ url: finalOgImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${price} · ${address} | Bizhub`,
      description: `View details, photos, and amenities for this ${data.PropertySubType || "business"} in ${cityName}.`,
      images: finalOgImage ? [finalOgImage] : undefined,
    },
  };
}

export default async function SlugPage({ params, searchParams }) {
  const { city, slug } = await params;
  const sParams = await searchParams;
  const filter = parseSlug(slug);

  if (filter) {
    const currentPage = Number(sParams.page) || 1;
    const limit = 20;
    const skip = (currentPage - 1) * limit;

    const data = await fetchProperties({
      cityToPass: slugToCity(city),
      businessType: filter.businessType,
      listingType: filter.listingType,
      top: limit,
      skip,
      sort: sParams.sort || "newest",
      minPrice: sParams.minPrice ? Number(sParams.minPrice) : undefined,
      maxPrice: sParams.maxPrice ? Number(sParams.maxPrice) : undefined,
    });

    const itemsWithMedia = await Promise.all(
      (data.items || []).map(async (property) => {
        const media = await fetchMedia(property.ListingKey, 5);
        const withMedia = { ...property, Media: media };
        const mainImage = pickPropertyMainImage(withMedia);
        return { ...withMedia, mainImage };
      }),
    );

    const baseListUrl = new URL(`/${city}/${slug}`, SITE_URL).toString();

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
      const agency =
        property.ListOfficeName || "Real Estate Professionals Inc.";

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
        <CityComponent
          city={city}
          filter={filter}
          basePath={`/${city}/${slug}`}
          searchParams={sParams}
          properties={itemsWithMedia}
          pagination={{
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          }}
        />
        <CategorySeoContent
          cityName={slugToCity(city)}
          slug={slug}
          businessType={filter.businessType}
          listingType={filter.listingType}
          categoryLabel={
            BUSINESS_TYPE_DISPLAY_MAP[filter.businessType] ||
            pluralizeBusinessType(filter.businessType)
          }
        />
        <RegisterNowModal />
      </>
    );
  }

  // Property Detail View (Existing Logic)
  const extractedSlug = extractListingKeyFromSlug(slug);
  const data = await fetchProperty(extractedSlug);
  const media = await fetchMedia(extractedSlug, 25);

  if (!data) return notFound();

  const businessTypeRaw = Array.isArray(data.BusinessType)
    ? data.BusinessType[0]
    : data.BusinessType;
  const businessType = businessTypeRaw || data.PropertySubType;
  console.log(
    "DEBUG: businessType =>",
    businessType,
    "from data.BusinessType:",
    data.BusinessType,
    "PropertySubType:",
    data.PropertySubType,
  );

  const property = {
    price: data.ListPrice,
    address: formatAddress(data),
    neighborhood: fallbackText(data.CityRegion, data.City),
    city: data.City,
    businessType,
    sqft: data.LivingAreaRange || data.BuildingAreaTotal,
    parking: data.ParkingTotal ?? data.ParkingSpaces,
    description: data.PublicRemarks,
    images: media.map((item) => item.MediaURL).filter(Boolean),
  };

  const listingType = data.TransactionType === "For Lease" ? "lease" : "sale";
  const nearbyData = await fetchProperties({
    cityToPass: data.City || slugToCity(city),
    top: 14,
    skip: 0,
    listingType,
    sort: "newest",
  });
  const nearbyCandidates = (nearbyData.items || [])
    .filter((item) => item.ListingKey !== slug)
    .slice(0, 7);
  const nearbyProperties = await Promise.all(
    nearbyCandidates.map(async (item) => {
      const itemMedia = await fetchMedia(item.ListingKey, 1);
      return { ...item, Media: itemMedia };
    }),
  );
  const flooringValue =
    Array.isArray(data.Flooring) && data.Flooring.length > 0
      ? data.Flooring.join(", ")
      : fallbackText(data.Flooring);

  const overview = [
    {
      label: "Status",
      value: fallbackText(data.StandardStatus || data.MlsStatus),
    },
    { label: "Property Type", value: fallbackText(data.PropertyType) },
    { label: "Property Sub Type", value: fallbackText(data.PropertySubType) },
    { label: "Style", value: formatList(data.ArchitecturalStyle) },
    {
      label: "Building Area",
      value:
        fallbackText(data.LivingAreaRange || data.BuildingAreaTotal) +
        (data.BuildingAreaUnits ? ` ${data.BuildingAreaUnits}` : " sq. ft."),
    },
    {
      label: "Zoning",
      value: fallbackText(data.ZoningDescription || data.Zoning),
    },
    {
      label: "Lot Size",
      value:
        data.LotWidth && data.LotDepth
          ? `${data.LotWidth} x ${data.LotDepth} ${data.LotSizeUnits || ""}`.trim()
          : "-",
    },
    { label: "Lot Shape", value: fallbackText(data.LotShape) },
    { label: "Exposure", value: fallbackText(data.DirectionFaces) },
    { label: "Occupancy", value: fallbackText(data.OccupantType) },
  ];

  const financial = [
    {
      label: "List Price",
      value: property.price ? `$${formatMoney(property.price)}` : "-",
    },
    { label: "Transaction Type", value: fallbackText(data.TransactionType) },
    data.GrossRevenue && {
      label: "Gross Revenue",
      value: `$${formatMoney(data.GrossRevenue)}`,
    },
    data.NetOperatingIncome && {
      label: "Net Operating Income",
      value: `$${formatMoney(data.NetOperatingIncome)}`,
    },
    data.TaxAnnualAmount && {
      label: "Annual Taxes",
      value: `$${formatMoney(data.TaxAnnualAmount)}`,
    },
    data.TaxYear && { label: "Tax Year", value: String(data.TaxYear) },
    data.AssociationFee && {
      label: "Maintenance Fee",
      value: `$${formatMoney(data.AssociationFee)}`,
    },
    data.LeaseAmount && {
      label: "Lease Amount",
      value: `$${formatMoney(data.LeaseAmount)}`,
    },
    data.LeaseTerm && { label: "Lease Term", value: data.LeaseTerm },
    data.EstimatedInventoryValueAtCost && {
      label: "Est. Inventory Value",
      value: `$${formatMoney(data.EstimatedInventoryValueAtCost)}`,
    },
  ].filter(Boolean);

  const business = [
    {
      label: "Business Type",
      value: formatList(
        (data.BusinessType || []).map((t) => BUSINESS_TYPE_DISPLAY_MAP[t] || t),
      ),
    },
    data.YearsInBusiness && {
      label: "Years in Business",
      value: data.YearsInBusiness,
    },
    data.FranchiseYN ? { label: "Franchise", value: "Yes" } : null,
    data.NumberOfFullTimeEmployees && {
      label: "Full Time Employees",
      value: data.NumberOfFullTimeEmployees,
    },
    (data.HoursDaysOfOperationDescription ||
      formatList(data.HoursDaysOfOperation)) && {
      label: "Hours of Operation",
      value:
        data.HoursDaysOfOperationDescription ||
        formatList(data.HoursDaysOfOperation),
    },
    data.SeatingCapacity && {
      label: "Seating Capacity",
      value: data.SeatingCapacity,
    },
    data.ChattelsYN ? { label: "Chattels Included", value: "Yes" } : null,
    { label: "Last Updated", value: getTimeAgo(data.ModificationTimestamp) },
  ].filter(Boolean);

  const locationTab = [
    { label: "Address", value: property.address },
    { label: "City", value: fallbackText(data.City) },
    { label: "Municipality", value: fallbackText(data.CountyOrParish) },
    { label: "State / Province", value: fallbackText(data.StateOrProvince) },
    { label: "Postal Code", value: fallbackText(data.PostalCode) },
    { label: "Cross Street", value: fallbackText(data.CrossStreet) },
  ];

  const descriptionSections = [
    data.PublicRemarks,
    data.Directions ? `Directions: ${data.Directions}` : null,
    data.CrossStreet ? `Cross Street: ${data.CrossStreet}` : null,
  ].filter(Boolean);
  const virtualTourUrl = data.VirtualTourURLUnbranded;
  const timeAgoLabel = getTimeAgo(data.OriginalEntryTimestamp);
  const shareTitle = property.price
    ? `$${formatMoney(property.price)} · ${property.address}`
    : property.address;
  const shareText = `${property.neighborhood} · ${fallbackText(
    data.CountyOrParish,
  )} · ${fallbackText(data.StateOrProvince)}`;

  const canonicalUrl = new URL(`/${city}/${slug}`, SITE_URL).toString();

  const ratingValue = data.AverageRating || 4.5;
  const ratingCount = data.ReviewCount || 1;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": canonicalUrl,
    name: shareTitle,
    description: descriptionSections.join(" "),
    image: property.images,
    sku: data.ListingKey || slug,
    category: "BusinessProperty",
    brand: data.ListOfficeName
      ? {
          "@type": "Organization",
          name: data.ListOfficeName,
        }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
      ratingCount,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "CAD",
      price: property.price || 0,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: data.ListOfficeName || "Bizhub",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ScrollToTop />
      <div className="w-full mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              className="font-medium hover:text-gray-900 cursor-pointer"
            >
              Home
            </Link>
            <ChevronRight
              aria-hidden="true"
              size={14}
              className="text-gray-400"
            />
            <Link
              href={`/${city}`}
              className="font-medium hover:text-gray-900 cursor-pointer"
            >
              {slugToCity(city)}
            </Link>
            <ChevronRight
              aria-hidden="true"
              size={14}
              className="text-gray-400"
            />
            <Link
              className="hover:text-gray-900 cursor-pointer"
              href={(() => {
                const businessTypeSlugMap = {
                  "Convenience/Variety": "convenience-store",
                };
                const baseSlug = property.businessType
                  ? businessTypeSlugMap[property.businessType] ||
                    toCategorySlug(property.businessType)
                  : null;
                return baseSlug
                  ? `/${city}/${baseSlug}-for-${listingType}`
                  : `/${city}`;
              })()}
            >
              {(BUSINESS_TYPE_DISPLAY_MAP[property.businessType] ||
                property.businessType ||
                "Businesses") + ` for ${listingType}`}
            </Link>
            <ChevronRight
              aria-hidden="true"
              size={14}
              className="text-gray-400"
            />
            <span className="text-gray-900 font-medium truncate max-w-[220px] md:max-w-none">
              {formatBreadcrumbAddress(data)}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8">
        <PropertyMediaGallery images={property.images} />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8   ">
            <div className="mb-2">
              <span className="inline-block rounded-sm bg-gray-500 px-2 py-1 text-xs font-semibold text-white">
                {timeAgoLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <h1
                className="text-3xl md:text-5xl font-bold tracking-tight"
                style={{ color: "lab(13 29.78 -57.75)" }}
              >
                ${formatMoney(property.price)}
                <span className="ml-2 text-sm md:text-base font-semibold text-teal-700">
                  {data.TransactionType || "For Sale"}
                </span>
              </h1>
              <ShareButton title={shareTitle} text={shareText} />
            </div>
            <p className="text-lg md:text-xl font-medium text-slate-900">
              {property.address}
            </p>
            <p className="text-sm md:text-base font-medium text-slate-900 mb-1">
              {property.neighborhood} · {fallbackText(data.CountyOrParish)} ·{" "}
              {fallbackText(data.StateOrProvince)}
            </p>

            <div className="  ">
              <p className="font-medium text-sm md:text-base text-slate-900 mb-1">
                <span>MLS&reg; Number:</span>{" "}
                {fallbackText(data.ListingKey, slug)}
              </p>
              <p className="font-medium text-sm md:text-base text-slate-900">
                <span>Listing Brokerage:</span>{" "}
                {fallbackText(data.ListOfficeName)}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-3">
              <div className="flex min-h-[50px] items-center gap-1.5 rounded-lg bg-white px-2 py-2 sm:min-h-[56px] sm:gap-2.5 sm:px-4 sm:py-3 border border-slate-100 shadow-sm">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 sm:h-9 sm:w-9">
                  <Square className="text-emerald-600" size={16} />
                </span>
                <span className="whitespace-nowrap text-[10px] font-semibold leading-tight text-slate-900 sm:text-sm">
                  {fallbackText(property.sqft)}
                  &nbsp;
                  {data.LivingAreaUnits || "sq. ft."}
                </span>
              </div>
              <div className="flex min-h-[50px] items-center gap-1.5 rounded-lg bg-white px-2 py-2 sm:min-h-[56px] sm:gap-2.5 sm:px-4 sm:py-3 border border-slate-100 shadow-sm">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 sm:h-9 sm:w-9">
                  <Home className="text-sky-600" size={16} />
                </span>
                <span className="whitespace-nowrap text-[10px] font-semibold leading-tight text-slate-900 sm:text-sm">
                  {property.businessType}
                </span>
              </div>
              <div className="flex min-h-[50px] items-center gap-1.5 rounded-lg bg-white px-2 py-2 sm:min-h-[56px] sm:gap-2.5 sm:px-4 sm:py-3 border border-slate-100 shadow-sm">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 sm:h-9 sm:w-9">
                  <Car className="text-amber-600" size={16} />
                </span>
                <span className="whitespace-nowrap text-[10px] font-semibold leading-tight text-slate-900 sm:text-sm">
                  {fallbackText(property.parking)} Parking
                </span>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                Property Details
              </h2>
              <RequestInfoModal
                variant="pill"
                label="Request More Info"
                propertyTitle={shareTitle}
                propertyMls={data.ListingKey}
                propertyUrl={canonicalUrl}
              />
            </div>
            <div className="text-base md:text-lg text-gray-700 leading-7 md:leading-8 space-y-4">
              {descriptionSections.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {virtualTourUrl ? (
                <a
                  href={virtualTourUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-teal-600 px-4 py-2 text-base font-semibold text-teal-700 hover:bg-teal-50"
                >
                  Virtual Tour
                </a>
              ) : null}
            </div>
          </section>

          <section className="bg-white mb-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Business Details
              </h2>
              <RequestInfoModal
                variant="pill"
                label="Request More Info"
                propertyTitle={shareTitle}
                propertyMls={data.ListingKey}
                propertyUrl={canonicalUrl}
              />
            </div>
            <HomeDetailsTabs
              overview={overview}
              financial={financial}
              business={business}
              location={locationTab}
            />
          </section>

          <ScheduleViewing property={property} />

          {nearbyProperties.length > 0 ? (
            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-xl font-bold md:text-3xl">
                  Browse Similar {pluralizeBusinessType(businessType)} Nearby
                </h2>
                <RequestInfoModal
                  variant="pill"
                  label="Request More Info"
                  propertyTitle={shareTitle}
                  propertyMls={data.ListingKey}
                  propertyUrl={canonicalUrl}
                />
              </div>
              <FeaturedPropertiesSection
                cityName={data.City || slugToCity(city)}
                citySlug={city}
                properties={nearbyProperties}
                totalCount={nearbyProperties.length}
                hideHeader
              />
            </div>
          ) : null}
        </div>

        <div className="py-5">
          <div id="book-showing-form" className="sticky  top-32">
            <GoSeeThisHome />
          </div>
        </div>

        {/* Mobile fixed bottom "Schedule a viewing" button */}
        <div className="lg:hidden">
          <a
            href="#book-showing-form"
            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-500/40 hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Schedule a viewing
          </a>
        </div>
      </main>
    </div>
  );
}
