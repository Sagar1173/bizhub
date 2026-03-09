import React from 'react';
import Link from 'next/link';
import { ALL_ONTARIO_CITIES, BUSINESS_TYPES, BUSINESS_TYPE_DISPLAY_MAP } from '@/constants/cities';
import { cityToSlug, slugToCity } from '@/lib/slug';

const BusinessInterlinks = ({ city, filter }) => {
  const currentCityName = slugToCity(city);
  const businessType = filter?.businessType;
  const listingType = filter?.listingType || 'sale';

  let title = "";
  let links = [];

  const getSlug = (type, lType) => {
    const businessTypeSlugMap = {
      "Convenience/Variety": "convenience-store",
    };
    const baseSlug =
      businessTypeSlugMap[type] ||
      type.toLowerCase().replace(/\//g, "-").replace(/ /g, "-");
    return `${baseSlug}-for-${lType}`;
  };

  if (businessType) {
    // Case A: Specific Business Type Page
    const baseLabel = BUSINESS_TYPE_DISPLAY_MAP[businessType] || businessType;
    const pluralLabel = baseLabel.endsWith('s') ? baseLabel : `${baseLabel}s`;
    title = `Explore ${pluralLabel} for ${listingType === 'lease' ? 'Lease' : 'Sale'}`;
    links = ALL_ONTARIO_CITIES.map(cityName => ({
      label: `${baseLabel} for ${listingType} in ${cityName}`,
      href: `/${cityToSlug(cityName)}/${getSlug(businessType, listingType)}`
    }));
  } else {
    // Case B: General City Page
    title = `Explore ${currentCityName} Business Listings`;
    // Links to all business types in THIS city
    const typeLinks = BUSINESS_TYPES.map(type => {
      const labelType = BUSINESS_TYPE_DISPLAY_MAP[type] || type;
      return {
        label: `${labelType} for sale in ${currentCityName}`,
        href: `/${city}/${getSlug(type, 'sale')}`
      };
    });
    const leaseLinks = BUSINESS_TYPES.map(type => {
      const labelType = BUSINESS_TYPE_DISPLAY_MAP[type] || type;
      return {
        label: `${labelType} for lease in ${currentCityName}`,
        href: `/${city}/${getSlug(type, 'lease')}`
      };
    });
    
    // Also links to OTHER cities general pages
    const cityLinks = ALL_ONTARIO_CITIES.filter(c => c !== currentCityName).map(cityName => ({
      label: `Business listings in ${cityName}`,
      href: `/${cityToSlug(cityName)}`
    }));

    links = [...typeLinks, ...leaseLinks, ...cityLinks];
  }

  return (
    <section className="py-16 bg-white border-t border-gray-100 mt-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            Find the perfect business opportunity in your city
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
          {links.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="text-[14px] sm:text-[15px] text-gray-500 hover:text-blue-900 transition-colors leading-snug"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessInterlinks;
