const MLS_BASE_URL = process.env.MLS_BASE_URL;
const MLS_TOKEN = process.env.MLS_TOKEN;
const MLS_MEDIA_CDN_BASE = process.env.MLS_MEDIA_CDN_BASE;

const formatCityName = (str) => {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SORT_MAP = {
  newest: "OriginalEntryTimestamp desc",
  oldest: "OriginalEntryTimestamp asc",
  price_asc: "ListPrice asc",
  price_desc: "ListPrice desc",
};

const PROPERTY_LIST_SELECT_FIELDS = [
  "ListingKey",
  "ListPrice",
  "BedroomsTotal",
  "BedroomsAboveGrade",
  "BedroomsBelowGrade",
  "BathroomsTotalInteger",
  "BuildingAreaTotal",
  "LivingAreaRange",
  "BusinessType",
  "PropertySubType",
  "UnparsedAddress",
  "StreetNumber",
  "StreetName",
  "City",
  "OriginalEntryTimestamp",
  "ListOfficeName",
  "TransactionType",
];

const PROPERTY_DETAIL_SELECT_FIELDS = [
  "ListingKey",
  "ListPrice",
  "BusinessType",
  "PropertySubType",
  "UnparsedAddress",
  "StreetNumber",
  "StreetName",
  "StreetSuffix",
  "UnitNumber",
  "City",
  "StateOrProvince",
  "PostalCode",
  "CityRegion",
  "ListOfficeName",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "WashroomsType1Pcs",
  "LivingAreaRange",
  "BuildingAreaTotal",
  "ParkingTotal",
  "ParkingSpaces",
  "PublicRemarks",
  "StandardStatus",
  "MlsStatus",
  "PropertyType",
  "ArchitecturalStyle",
  "KitchensTotal",
  "LotWidth",
  "LotDepth",
  "LotSizeUnits",
  "LotShape",
  "DirectionFaces",
  "OccupantType",
  "Cooling",
  "HeatType",
  "HeatSource",
  "Sewer",
  "Water",
  "LaundryFeatures",
  "Basement",
  "FoundationDetails",
  "Roof",
  "ConstructionMaterials",
  "InteriorFeatures",
  "TransactionType",
  "Furnished",
  "PossessionType",
  "PossessionDetails",
  "RentIncludes",
  "ParkingFeatures",
  "Directions",
  "CrossStreet",
  "VirtualTourURLUnbranded",
  "CountyOrParish",
  "LivingAreaUnits",
  "BedroomsAboveGrade",
  "BedroomsBelowGrade",
  "OriginalEntryTimestamp",
];

const mediaTypeToExtension = (mediaType) => {
  if (!mediaType) return "";
  const type = mediaType.toLowerCase();
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return type.split("/")[1] || "";
};

const buildMediaUrl = (listingKey, mediaKey, mediaType) => {
  if (!listingKey || !mediaKey) return null;
  const ext = mediaTypeToExtension(mediaType);
  if (!ext) return null;
  return `${MLS_MEDIA_CDN_BASE}/${listingKey}/${mediaKey}.${ext}`;
};

export async function fetchProperties({
  cityToPass,
  top = 20,
  skip = 0,
  beds,
  baths,
  businessType,
  minPrice,
  maxPrice,
  listingType,
  sort = "Newest",
}) {
  const params = [`$top=${top}`, `$skip=${skip}`, `$count=true`];
  params.push(
    `$select=${encodeURIComponent(PROPERTY_LIST_SELECT_FIELDS.join(","))}`,
  );

  // Sort
  const orderby = SORT_MAP[sort] || "OriginalEntryTimestamp desc";
  params.push(`$orderby=${encodeURIComponent(orderby)}`);

  // Filters
  const filters = ["PropertyType eq 'Commercial'"];

  if (cityToPass) {
    const formattedCity = formatCityName(cityToPass);
    filters.push(`contains(City, '${formattedCity}')`);
  }

  if (beds) filters.push(`BedroomsTotal ge ${beds}`);
  if (baths) filters.push(`BathroomsTotalInteger ge ${baths}`);
  if (businessType) {
    if (businessType === "Office") {
      filters.push(`BusinessType eq 'Professional Office'`);
    } else {
      filters.push(`BusinessType in ('${businessType}')`);
    }
  }
  if (Number.isFinite(minPrice)) filters.push(`ListPrice ge ${minPrice}`);
  if (Number.isFinite(maxPrice)) filters.push(`ListPrice le ${maxPrice}`);
  if (listingType === "sale") filters.push(`TransactionType eq 'For Sale'`);
  if (listingType === "lease") filters.push(`TransactionType eq 'For Lease'`);

  if (filters.length > 0) {
    params.push(`$filter=${encodeURIComponent(filters.join(" and "))}`);
  }

  const url = `${MLS_BASE_URL}/Property?${params.join("&")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  const totalCount = data["@odata.count"] || 0;

  return {
    items: data.value || [],
    totalCount,
    totalPages: Math.ceil(totalCount / top),
    currentPage: Math.floor(skip / top) + 1,
    top,
    skip,
  };
}

export async function fetchProperty(listingKey) {
  const url = `${MLS_BASE_URL}/Property('${encodeURIComponent(listingKey)}')?$select=${encodeURIComponent(PROPERTY_DETAIL_SELECT_FIELDS.join(","))}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data || null;
}

export async function fetchMedia(listingKey, top = 25) {
  if (!listingKey) return [];
  const params = [`$select=MediaKey,MediaType`, `$top=${top}`];
  const filter =
    "ImageSizeDescription eq 'Medium' and MediaStatus eq 'Active' and ResourceRecordKey eq '" +
    listingKey +
    "'";
  params.push(`$filter=${encodeURIComponent(filter)}`);
  params.push(`$orderby=${encodeURIComponent("Order asc")}`);
  const url = `${MLS_BASE_URL}/Media?${params.join("&")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  const media = data.value || [];
  return media.map((item) => ({
    ...item,
    MediaURL: buildMediaUrl(listingKey, item.MediaKey, item.MediaType),
  }));
}
