import React from "react";

function SkeletonBlock({ className }) {
  return <div className={`bg-gray-200/80 animate-pulse ${className}`} />;
}

function PropertyCardSkeleton() {
  return (
    <div className="group w-full bg-white rounded-xl overflow-hidden shadow-xs border border-gray-100">
      <SkeletonBlock className="h-56 w-full" />
      <div className="px-3.5 pt-2 pb-4 space-y-2">
        <SkeletonBlock className="h-7 w-1/2 rounded" />
        <SkeletonBlock className="h-4 w-5/6 rounded" />
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <SkeletonBlock className="h-3 w-10 rounded" />
          <SkeletonBlock className="h-3 w-10 rounded" />
          <SkeletonBlock className="h-3 w-16 rounded" />
        </div>
        <div className="flex items-center gap-4 pt-1">
          <SkeletonBlock className="h-3 w-24 rounded" />
          <SkeletonBlock className="h-3 w-20 rounded" />
        </div>
        <SkeletonBlock className="h-3 w-2/3 rounded pt-1" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Title + meta */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="mb-3 md:mb-4">
          <SkeletonBlock className="h-10 w-[520px] max-w-full rounded" />
          <SkeletonBlock className="h-4 w-[420px] max-w-[85%] mt-2 rounded" />
        </div>
      </div>

      {/* Filter bar (sticky) */}
      <div className="sticky top-0 z-40 -mt-px bg-white w-full py-2">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <SkeletonBlock className="h-9 w-28 rounded-full" />
              <SkeletonBlock className="h-9 w-32 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
              <SkeletonBlock className="h-9 w-28 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
            </div>
            <div className="lg:hidden">
              <SkeletonBlock className="h-10 w-28 rounded-full" />
            </div>
          </div>

          <SkeletonBlock className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Grid */}
      <main className="w-full px-4 sm:px-6 lg:px-8 pb-20 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 mb-20 w-full">
          <SkeletonBlock className="h-9 w-16 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-9 rounded" />
          ))}
          <SkeletonBlock className="h-9 w-16 rounded" />
        </div>
      </main>
    </div>
  );
}
