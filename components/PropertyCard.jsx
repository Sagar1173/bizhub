import Link from "next/link";
import { Home, Heart } from "lucide-react";
import { cityToSlug, generatePropertySlug } from "@/lib/slug";
import { BUSINESS_TYPE_DISPLAY_MAP } from "@/constants/cities";

function getTimeAgo(dateString) {
  if (!dateString) return "New";
  const now = new Date();
  const listed = new Date(dateString);
  const diff = now - listed;

  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365.25);
  return `${years}y ago`;
}

function formatBedroomDisplay(aboveGrade, belowGrade, total) {
  const aboveNum = Number(aboveGrade);
  const belowNum = Number(belowGrade);
  const totalNum = Number(total);

  if (Number.isFinite(aboveNum) && Number.isFinite(belowNum)) {
    if (aboveNum === 0 && belowNum === 0) return "0";
    if (belowNum === 0) return String(aboveNum);
    if (aboveNum === 0) return String(belowNum);
    return `${aboveNum}+${belowNum}`;
  }

  if (
    Number.isFinite(aboveNum) &&
    Number.isFinite(totalNum) &&
    totalNum >= aboveNum
  ) {
    const belowFromTotal = totalNum - aboveNum;
    if (aboveNum === 0 && belowFromTotal === 0) return "0";
    if (belowFromTotal === 0) return String(aboveNum);
    if (aboveNum === 0) return String(belowFromTotal);
    return `${aboveNum}+${belowFromTotal}`;
  }

  if (
    Number.isFinite(belowNum) &&
    Number.isFinite(totalNum) &&
    totalNum >= belowNum
  ) {
    const aboveFromTotal = totalNum - belowNum;
    if (aboveFromTotal === 0 && belowNum === 0) return "0";
    if (belowNum === 0) return String(aboveFromTotal);
    if (aboveFromTotal === 0) return String(belowNum);
    return `${aboveFromTotal}+${belowNum}`;
  }

  if (Number.isFinite(totalNum)) return String(totalNum);
  if (Number.isFinite(aboveNum)) return String(aboveNum);
  if (Number.isFinite(belowNum)) return String(belowNum);
  return "-";
}

export default function PropertyCard({ property }) {
  // Price Formatting
  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(property.ListPrice || 0);

  const sqft = property.BuildingAreaTotal || property.LivingAreaRange || null;
  const businessType = Array.isArray(property.BusinessType) 
    ? property.BusinessType[0] 
    : property.BusinessType;
  const propertyType = BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType || property.PropertySubType || "Property";
  const fullAddress =
    property.UnparsedAddress ||
    `${property.StreetNumber} ${property.StreetName}`;
  const city = property.City || "";
  const mls = property.ListingKey;
  const thumbnail = property.thumbnail || property.Media?.[0]?.MediaURL || null;
  const listedDate = property.OriginalEntryTimestamp;
  const agency = property.ListOfficeName || "Real Estate Professionals Inc.";
  const timeAgoLabel = getTimeAgo(listedDate);
  const href = `/${cityToSlug(city)}/${generatePropertySlug(property)}`;

  return (
    <Link
      href={href}
      scroll={true}
      className="group block w-full bg-white rounded-xl overflow-hidden cursor-pointer shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
    >
      {/* Image Section */}
      <div className="relative h-52 sm:h-56 w-full bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={fullAddress}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Home size={40} strokeWidth={1} />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              No Photo
            </span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            {timeAgoLabel}
          </div>
          {propertyType && (
            <div className="bg-white text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{propertyType}</span>
            </div>
          )}
        </div>

        <span className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors">
          <Heart size={18} className="text-white" />
        </span>
      </div>

      {/* Content Section */}
      <div className="px-3.5 pt-2 pb-4 space-y-1">
        <div>
          <h3 
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "lab(13 29.78 -57.75)" }}
          >
            {formattedPrice}
          </h3>
          <p className="text-sm text-gray-700 truncate font-medium">
            {fullAddress}
          </p>
        </div>

        {/* Property Specs */}
        <div className="space-y-1.5 text-gray-700 mt-2">
          {/* Area and MLS Line */}
          <div className="flex items-center justify-start gap-3">
            <p className="flex items-center text-xs text-gray-700 font-medium uppercase tracking-tighter">
              <span>MLS® {mls}</span>
              {property.TransactionType && (
                <>
                  <span className="mx-2 h-1 w-1 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span>{property.TransactionType.replace("For ", "")}</span>
                </>
              )}
            </p>
          </div>
          
          <p className="text-xs text-gray-700 truncate font-medium">
            Listing Brokerage : {agency}
          </p>
        </div>
      </div>
    </Link>
  );
}
