export const cityToSlug = (city) => {
  if (!city) return "";
  if (city.toLowerCase() === "gta") return "gta";
  return city.trim().toLowerCase().replace(/\s+/g, "-");
};

export const slugToCity = (slug) => {
  if (!slug) return "";
  if (slug.toLowerCase() === "gta") return "GTA";

  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const generatePropertySlug = (property) => {
  if (!property || !property.ListingKey) return "";
  const address = property.UnparsedAddress || `${property.StreetNumber || ""} ${property.StreetName || ""}`;
  
  if (!address.trim()) {
    return property.ListingKey.toLowerCase();
  }

  const addressSlug = address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
    
  return `${addressSlug}-${property.ListingKey.toLowerCase()}`;
};

export const extractListingKeyFromSlug = (slug) => {
  if (!slug) return "";
  const parts = slug.split("-");
  return parts[parts.length - 1].toUpperCase();
};

export const toCategorySlug = (value) => {
  if (!value) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
