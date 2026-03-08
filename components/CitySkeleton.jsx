"use client";
import React from "react";

const SkeletonBlock = ({ className }) => (
  <div className={`bg-gray-200/80 animate-pulse ${className}`} />
);

export default function CitySkeleton({
  showFilterBar = true,
  contentOnly = false,
}) {
  const content = (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-20 pt-5">
      <div className="mb-8">
        <SkeletonBlock className="h-10 w-80 max-w-full rounded" />
        <SkeletonBlock className="h-4 w-64 mt-2 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden bg-white">
            <SkeletonBlock className="h-48 w-full" />
            <div className="p-3.5 space-y-2">
              <SkeletonBlock className="h-6 w-1/2 rounded" />
              <SkeletonBlock className="h-4 w-5/6 rounded" />
              <div className="flex gap-3">
                <SkeletonBlock className="h-3 w-8 rounded" />
                <SkeletonBlock className="h-3 w-8 rounded" />
                <SkeletonBlock className="h-3 w-12 rounded" />
              </div>
              <SkeletonBlock className="h-3 w-20 rounded" />
              <SkeletonBlock className="h-2.5 w-24 rounded mt-2" />
              <SkeletonBlock className="h-2.5 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 mb-20 w-full">
        <SkeletonBlock className="h-8 w-12 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-8 rounded" />
        ))}
        <SkeletonBlock className="h-8 w-12 rounded" />
      </div>
    </div>
  );

  if (contentOnly) return content;

  return (
    <div className="min-h-screen bg-white">
      {showFilterBar ? (
        <div className="border-b">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-3">
              <SkeletonBlock className="h-9 w-28 rounded-full" />
              <SkeletonBlock className="h-9 w-32 rounded-full" />
              <SkeletonBlock className="h-9 w-36 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ) : null}
      {content}
    </div>
  );
}
