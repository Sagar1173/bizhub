import { NextResponse } from "next/server";

// Environment variables are read inside functions (not at module scope) to
// match the pattern in lib/api.js and avoid stale values during Vercel builds.

const escapeODataString = (value) => value.replace(/'/g, "''");

const readJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

async function lookupByListingKey(input, baseUrl, token) {
  const url =
    `${baseUrl}/Property('${encodeURIComponent(input)}')` +
    `?$select=${encodeURIComponent("ListingKey,City")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await readJsonSafe(res);
  if (!data?.ListingKey || !data?.City) return null;

  return { listingKey: data.ListingKey, city: data.City };
}

async function lookupByField(fieldName, input, baseUrl, token) {
  const filter = `${fieldName} eq '${escapeODataString(input)}'`;
  const params = [
    "$top=1",
    `$select=${encodeURIComponent("ListingKey,City")}`,
    `$filter=${encodeURIComponent(filter)}`,
  ];

  const url = `${baseUrl}/Property?${params.join("&")}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await readJsonSafe(res);
  const first = data?.value?.[0];
  if (!first?.ListingKey || !first?.City) return null;

  return { listingKey: first.ListingKey, city: first.City };
}

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ found: false }, { status: 200 });
  }

  const baseUrl = process.env.MLS_BASE_URL;
  const token = process.env.MLS_TOKEN;

  if (!baseUrl || !token) {
    return NextResponse.json(
      { found: false, error: "MLS environment is not configured" },
      { status: 500 },
    );
  }

  const byKey = await lookupByListingKey(q, baseUrl, token);
  if (byKey) {
    return NextResponse.json({ found: true, ...byKey }, { status: 200 });
  }

  // Try common MLS id fields when user enters MLS number instead of ListingKey.
  const fieldCandidates = ["ListingId", "ListingNumber", "MlsNumber"];
  for (const fieldName of fieldCandidates) {
    const byField = await lookupByField(fieldName, q, baseUrl, token);
    if (byField) {
      return NextResponse.json({ found: true, ...byField }, { status: 200 });
    }
  }

  return NextResponse.json({ found: false }, { status: 200 });
}
