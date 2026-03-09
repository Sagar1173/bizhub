"use client";

import { useParams } from "next/navigation";
import CitySkeleton from "@/components/CitySkeleton";
import PropertyDetailSkeleton from "@/components/PropertyDetailSkeleton";

const isFilterSlug = (slug) => {
  if (!slug || typeof slug !== "string") return false;
  return /^(.+)-for-(sale|lease)$/.test(slug);
};

export default function Loading() {
  const params = useParams();
  const slug = params?.slug;

  if (isFilterSlug(slug)) {
    return <CitySkeleton />;
  }

  return <PropertyDetailSkeleton />;
}

