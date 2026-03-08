export const cityToSlug = (city) => {
  if (!city) return "";
  return city.trim().toLowerCase().replace(/\s+/g, "-");
};

export const slugToCity = (slug) => {
  if (!slug) return "";

  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
