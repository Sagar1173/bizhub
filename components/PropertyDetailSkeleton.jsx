"use client";

import React from "react";

const SkeletonBlock = ({ className }) => (
  <div className={`bg-gray-200/80 animate-pulse ${className}`} />
);

export default function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-7 w-16 rounded-full" />
          <SkeletonBlock className="h-4 w-32 rounded" />
          <SkeletonBlock className="h-4 w-40 rounded" />
        </div>
      </div>

      <div className="w-full px-4 md:px-8">
        <SkeletonBlock className="h-[420px] sm:h-[500px] md:h-[620px] w-full rounded-lg" />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-6 space-y-3">
            <SkeletonBlock className="h-8 w-56 rounded" />
            <SkeletonBlock className="h-5 w-80 rounded" />
            <SkeletonBlock className="h-4 w-64 rounded" />
            <SkeletonBlock className="h-4 w-56 rounded" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 px-5 py-4 rounded-md flex items-center"
                >
                  <SkeletonBlock className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-8 border-b text-sm font-bold text-gray-300 mb-8 pt-3 sticky top-16 bg-white z-30">
            <SkeletonBlock className="h-4 w-20 rounded" />
          </div>

          <section className="mb-12 space-y-4">
            <SkeletonBlock className="h-6 w-40 rounded" />
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-11/12 rounded" />
            <SkeletonBlock className="h-4 w-5/6 rounded" />
          </section>

          <section className="bg-white mb-20">
            <SkeletonBlock className="h-6 w-40 rounded mb-6" />

            <div className="border rounded-lg p-6 mb-8">
              <SkeletonBlock className="h-4 w-28 rounded mb-4" />
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-4 w-28 rounded" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBlock className="h-4 w-28 rounded mb-4" />
                  <div className="space-y-3 text-xs">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <SkeletonBlock key={j} className="h-3 w-full rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBlock className="h-4 w-28 rounded mb-4" />
                  <div className="space-y-3 text-xs">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <SkeletonBlock key={j} className="h-3 w-full rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <SkeletonBlock className="h-7 w-44 rounded mb-4" />
            <div className="border rounded-xl p-4 space-y-3">
              <SkeletonBlock className="h-4 w-3/4 rounded" />
              <SkeletonBlock className="h-10 w-full rounded" />
              <SkeletonBlock className="h-10 w-full rounded" />
              <SkeletonBlock className="h-10 w-full rounded" />
              <SkeletonBlock className="h-10 w-40 rounded-full" />
            </div>
          </section>
        </div>

        <div className="py-5">
          <div className="sticky top-32">
            <div className="border rounded-xl p-4 space-y-3">
              <SkeletonBlock className="h-6 w-32 rounded" />
              <SkeletonBlock className="h-4 w-full rounded" />
              <SkeletonBlock className="h-10 w-full rounded" />
              <SkeletonBlock className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
