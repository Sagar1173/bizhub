const looksLikeThumbnailUrl = (url) => {
  if (!url) return false;
  const u = String(url).toLowerCase();
  return (
    u.includes("thumbnail") ||
    u.includes("thumb") ||
    u.includes("tmb") ||
    u.includes("/small") ||
    u.includes("size=small")
  );
};

const isValidHttpUrl = (value) => {
  if (!value) return false;
  try {
    const u = new URL(String(value));
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const getPropertyImageCandidates = (property) => {
  const candidates = [];

  if (property?.mainImage) candidates.push(property.mainImage);
  if (property?.thumbnail) candidates.push(property.thumbnail);

  if (Array.isArray(property?.Media)) {
    for (const item of property.Media) {
      if (item?.MediaURL) candidates.push(item.MediaURL);
    }
  }

  if (Array.isArray(property?.images)) {
    for (const url of property.images) {
      if (url) candidates.push(url);
    }
  }

  const seen = new Set();
  return candidates
    .map((u) => (typeof u === "string" ? u.trim() : u))
    .filter((u) => isValidHttpUrl(u))
    .filter((u) => {
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });
};

export const pickPropertyMainImage = (property, preferredIndexes = [1, 2, 0]) => {
  const mediaUrls = Array.isArray(property?.Media)
    ? property.Media.map((m) => m?.MediaURL).filter(Boolean)
    : [];

  const preferred = preferredIndexes
    .map((i) => mediaUrls[i])
    .filter(Boolean);

  const fallback = getPropertyImageCandidates(property);

  const combined = [...preferred, ...fallback];

  const nonThumb = combined.find((u) => u && !looksLikeThumbnailUrl(u));
  return nonThumb || combined.find(Boolean) || null;
};

