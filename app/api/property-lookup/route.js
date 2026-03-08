import { NextResponse } from "next/server";

const MLS_BASE_URL = process.env.MLS_BASE_URL;
const MLS_TOKEN = process.env.MLS_TOKEN;

const escapeODataString = (value) => value.replace(/'/g, "''");

const readJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

async function lookupByListingKey(input) {
  const url =
    `${MLS_BASE_URL}/Property('${encodeURIComponent(input)}')` +
    `?$select=${encodeURIComponent("ListingKey,City")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_TOKEN}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await readJsonSafe(res);
  if (!data?.ListingKey || !data?.City) return null;

  return { listingKey: data.ListingKey, city: data.City };
}

async function lookupByField(fieldName, input) {
  const filter = `${fieldName} eq '${escapeODataString(input)}'`;
  const params = [
    "$top=1",
    `$select=${encodeURIComponent("ListingKey,City")}`,
    `$filter=${encodeURIComponent(filter)}`,
  ];

  const url = `${MLS_BASE_URL}/Property?${params.join("&")}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_TOKEN}`,
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

  if (!MLS_BASE_URL || !MLS_TOKEN) {
    return NextResponse.json(
      { found: false, error: "MLS environment is not configured" },
      { status: 500 },
    );
  }

  const byKey = await lookupByListingKey(q);
  if (byKey) {
    return NextResponse.json({ found: true, ...byKey }, { status: 200 });
  }

  // Try common MLS id fields when user enters MLS number instead of ListingKey.
  const fieldCandidates = ["ListingId", "ListingNumber", "MlsNumber"];
  for (const fieldName of fieldCandidates) {
    const byField = await lookupByField(fieldName, q);
    if (byField) {
      return NextResponse.json({ found: true, ...byField }, { status: 200 });
    }
  }

  return NextResponse.json({ found: false }, { status: 200 });
}
