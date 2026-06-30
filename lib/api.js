// Environment variables are intentionally NOT read at module scope.
// Reading them at the top level causes Vercel build failures because
// Next.js evaluates module-scope code during static analysis / prerendering
// before env vars from the Vercel dashboard are injected.
// Always read process.env inside the function body so the value is
// resolved at call time (runtime / request time), not at import time.

/**
 * Returns the required MLS environment config, throwing a descriptive error
 * if any variable is missing. This surfaces a clear message instead of
 * the cryptic "TypeError: Failed to parse URL from undefined/Property".
 */
function getMlsConfig() {
  const baseUrl = process.env.MLS_BASE_URL;
  const token = process.env.MLS_TOKEN;
  const mediaCdnBase = process.env.MLS_MEDIA_CDN_BASE;

  if (!baseUrl) {
    throw new Error(
      "[MLS] Missing required environment variable: MLS_BASE_URL. " +
        "Add it to your .env.local file (local) or Vercel Environment Variables (production)."
    );
  }
  if (!token) {
    throw new Error(
      "[MLS] Missing required environment variable: MLS_TOKEN. " +
        "Add it to your .env.local file (local) or Vercel Environment Variables (production)."
    );
  }
  if (!mediaCdnBase) {
    throw new Error(
      "[MLS] Missing required environment variable: MLS_MEDIA_CDN_BASE. " +
        "Add it to your .env.local file (local) or Vercel Environment Variables (production)."
    );
  }

  return { baseUrl, token, mediaCdnBase };
}

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

const buildMediaUrl = (listingKey, mediaKey, mediaType, mediaCdnBase) => {
  if (!listingKey || !mediaKey) return null;
  const ext = mediaTypeToExtension(mediaType);
  if (!ext) return null;
  return `${mediaCdnBase}/${listingKey}/${mediaKey}.${ext}`;
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
  officeName,
  excludeOfficeName,
}) {
  const { baseUrl, token } = getMlsConfig();

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
    if (formattedCity.toLowerCase() === "gta") {
      const gtaCities = [
        "Toronto",
        "Mississauga",
        "Brampton",
        "Markham",
        "Vaughan",
        "Richmond Hill",
        "Oakville",
        "Burlington",
        "Milton",
        "Oshawa",
        "Pickering",
        "Ajax",
        "Whitby",
      ];
      const cityFilters = gtaCities
        .map((c) => `contains(City, '${c}')`)
        .join(" or ");
      filters.push(`(${cityFilters})`);
    } else {
      filters.push(`contains(City, '${formattedCity}')`);
    }
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
  if (officeName) filters.push(`ListOfficeName eq '${officeName}'`);
  if (excludeOfficeName) filters.push(`ListOfficeName ne '${excludeOfficeName}'`);

  if (filters.length > 0) {
    params.push(`$filter=${encodeURIComponent(filters.join(" and "))}`);
  }

  const url = `${baseUrl}/Property?${params.join("&")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const { baseUrl, token } = getMlsConfig();

  const url = `${baseUrl}/Property('${encodeURIComponent(listingKey)}')?$select=${encodeURIComponent(PROPERTY_DETAIL_SELECT_FIELDS.join(","))}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data || null;
}

export async function fetchMedia(listingKey, top = 25) {
  if (!listingKey) return [];
  const { baseUrl, token, mediaCdnBase } = getMlsConfig();

  const params = [`$select=MediaKey,MediaType`, `$top=${top}`];
  const filter =
    "ImageSizeDescription eq 'Medium' and MediaStatus eq 'Active' and ResourceRecordKey eq '" +
    listingKey +
    "'";
  params.push(`$filter=${encodeURIComponent(filter)}`);
  params.push(`$orderby=${encodeURIComponent("Order asc")}`);
  const url = `${baseUrl}/Media?${params.join("&")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  const media = data.value || [];
  return media.map((item) => ({
    ...item,
    MediaURL: buildMediaUrl(listingKey, item.MediaKey, item.MediaType, mediaCdnBase),
  }));
}
