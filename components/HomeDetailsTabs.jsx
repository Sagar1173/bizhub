"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "interior", label: "Interior" },
  { key: "amenities", label: "Amenities & utilities" },
  { key: "structure", label: "Structure" },
  { key: "lease", label: "Lease details" },
  { key: "location", label: "Location" },
];

export default function HomeDetailsTabs({
  highlights = [],
  interior = [],
  utilities = [],
  structure = [],
  leaseInfo = [],
  location = [],
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const items = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return highlights;
      case "interior":
        return interior;
      case "amenities":
        return utilities;
      case "structure":
        return structure;
      case "lease":
        return leaseInfo;
      case "location":
        return location;
      default:
        return highlights;
    }
  }, [
    activeTab,
    highlights,
    interior,
    utilities,
    structure,
    leaseInfo,
    location,
  ]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = tabRefs.current[activeTab];
      if (!activeEl) return;
      setIndicator({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        ready: true,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <div>
      <div className="mb-5 overflow-x-auto scrollbar-hide border-b border-slate-200">
        <div className="relative flex min-w-max gap-3">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                ref={(el) => {
                  tabRefs.current[tab.key] = el;
                }}
                onClick={() => setActiveTab(tab.key)}
                className={`mb-2 cursor-pointer rounded-full px-3 py-1.5 text-base font-semibold transition-colors duration-300 md:text-lg ${
                  isActive
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <span
            className={`pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-blue-600 transition-all duration-300 ease-out ${
              indicator.ready ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="grid grid-cols-1 gap-y-4 text-sm md:grid-cols-2 md:gap-x-6 md:text-base">
          {items.map((item) => (
            <div
              key={`${activeTab}-${item.label}`}
              className="flex items-start "
            >
              <span className="text-slate-700 mr-1 whitespace-nowrap">
                {item.label} :{" "}
              </span>
              <span className="text-left text-slate-700 break-words">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
