import Link from "next/link";

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/jasonbyunrealestate/";
const INSTAGRAM_HANDLE = "@jasonbyunrealestate";
const DEFAULT_LIMIT = 8;
const EMBED_POST_URLS = [
  "https://www.instagram.com/p/DVL08HJkbWQ/",
  "https://www.instagram.com/p/DU3wH8_Es0G/",
  "https://www.instagram.com/p/DOv5M4okTUm/",
  "https://www.instagram.com/p/DOs66HXkR_E/",
];

const toInstagramEmbedUrl = (postUrl) => {
  try {
    const url = new URL(postUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const type = parts[0]; // p | reel | tv
    const shortcode = parts[1];
    if (!type || !shortcode) return null;
    if (!["p", "reel", "tv"].includes(type)) return null;
    return `https://www.instagram.com/${type}/${shortcode}/embed/`;
  } catch {
    return null;
  }
};

const getTitleFromCaption = (caption) => {
  if (!caption) return "Instagram post";
  const firstLine = caption.split("\n").find(Boolean)?.trim();
  if (!firstLine) return "Instagram post";
  return firstLine.length > 64 ? `${firstLine.slice(0, 64)}…` : firstLine;
};

const getDescriptionSnippet = (caption) => {
  if (!caption) return "";
  const normalized = caption.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > 120 ? `${normalized.slice(0, 120)}…` : normalized;
};

async function fetchInstagramPosts({ limit = DEFAULT_LIMIT } = {}) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return { posts: [], configured: false, error: null };
  }

  const safeLimit = Math.max(1, Math.min(Number(limit) || DEFAULT_LIMIT, 20));
  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
  ].join(",");

  const url = `https://graph.instagram.com/me/media?fields=${encodeURIComponent(fields)}&limit=${safeLimit}&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const apiMessage =
        data?.error?.message || `Instagram API request failed (${res.status})`;
      return { posts: [], configured: true, error: apiMessage };
    }

    const rawPosts = Array.isArray(data?.data) ? data.data : [];
    const posts = rawPosts
      .map((p) => {
        const mediaType = p?.media_type;
        const imageUrl = p?.thumbnail_url || p?.media_url;
        const permalink = p?.permalink;
        if (!imageUrl || !permalink) return null;

        return {
          id: p?.id || permalink,
          title: getTitleFromCaption(p?.caption),
          description: p?.caption || "",
          imageUrl,
          permalink,
          mediaType: mediaType || "IMAGE",
          timestamp: p?.timestamp || null,
        };
      })
      .filter(Boolean);

    return { posts, configured: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load Instagram posts";
    return { posts: [], configured: true, error: message };
  }
}

const MediaTypeBadge = ({ mediaType }) => {
  const label =
    mediaType === "VIDEO"
      ? "Video"
      : mediaType === "CAROUSEL_ALBUM"
        ? "Album"
        : null;

  if (!label) return null;

  return (
    <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
      {label}
    </div>
  );
};

const InstagramFeed = async () => {
  const { posts, configured, error } = await fetchInstagramPosts({
    limit: DEFAULT_LIMIT,
  });
  const embedUrls = EMBED_POST_URLS.map(toInstagramEmbedUrl).filter(Boolean);

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-linear-to-tr from-yellow-400 to-purple-600 rounded-2xl flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Follow me on Instagram
          </h2>
          <p className="text-gray-500 mt-2">{INSTAGRAM_HANDLE}</p>
          {configured && error ? (
            <p className="mt-3 text-sm text-rose-600">
              Couldn&apos;t load Instagram posts right now.
            </p>
          ) : null}
        </div>

        {/* Grid Section (no scrolling) */}
        {posts.length > 0 || embedUrls.length > 0 ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            aria-label="Instagram feed"
          >
            {posts.length > 0
              ? posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                    aria-label="View Instagram post"
                  >
                    <div className="relative aspect-4/5 bg-gray-100">
                      <MediaTypeBadge mediaType={post.mediaType} />

                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/55 p-3 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              : embedUrls.map((src, idx) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="aspect-4/5 bg-gray-100">
                      <iframe
                        src={src}
                        title={`Instagram embed ${idx + 1}`}
                        className="h-full w-full"
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </div>
                ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-gray-900">
              Instagram posts will appear here
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Once connected, we&apos;ll automatically show your latest posts from{" "}
              {INSTAGRAM_HANDLE}.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href={INSTAGRAM_PROFILE_URL}
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white border border-gray-300 px-8 py-3 rounded-full font-semibold  transition-colors shadow-sm"
            target="_blank"
            rel="noreferrer"
          >
            View More on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
