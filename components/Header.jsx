"use client";

import {
  Menu,
  X,
  Phone,
  Instagram,
  ChevronDown,
  Search,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { cityToSlug, slugToCity } from "@/lib/slug";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import { cities as MAIN_CITIES, ALL_ONTARIO_CITIES } from "@/constants/cities";
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const nonCityRoots = new Set([
    "about",
    "api",
    "avoid-money-pit",
    "blog",
    "cmhc-insurance-calculator",
    "contact",
    "credit-scores-affects-you",
    "get-your-home-estimate",
    "land-transfer-tax-calculator",
    "mortgage-calculator",
    "property",
    "save-on-interest",
    "sold-prices-in-your-neighbourhood",
    "5-costly-mistakes",
  ]);
  const firstPathSegment = pathname.split("/").filter(Boolean)[0] || "";
  const isCityRoute =
    Boolean(firstPathSegment) && !nonCityRoots.has(firstPathSegment);
  const showHeaderSearch = pathname !== "/";
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileCommunitiesOpen, setIsMobileCommunitiesOpen] = useState(false);
  const [isMobileSellersOpen, setIsMobileSellersOpen] = useState(false);
  const [isMobileFranchiseOpen, setIsMobileFranchiseOpen] = useState(false);

  const communities = MAIN_CITIES.map(c => c.name);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const sellerLinks = [
    { name: "Get Your Home Estimate", href: "/get-your-home-estimate" },
    {
      name: "Sold Prices In Your Neighbourhood",
      href: "/sold-prices-in-your-neighbourhood",
    },
  ];

  const franchiseLinks = [
    {
      name: "Mary Brown's Chicken",
      href: "/franchise-opportunity/ontario/mary-browns-chicken",
    },
    {
      name: "Fat Bastard Burrito",
      href: "/franchise-opportunity/ontario/fat-bastard-burrito",
    },
    {
      name: "Wingsup",
      href: "/franchise-opportunity/ontario/wingsup",
    },
    {
      name: "Burger King",
      href: "/franchise-opportunity/ontario/burger-king",
    },
    {
      name: "Burrito Jax",
      href: "/franchise-opportunity/ontario/burrito-jax",
    },
    {
      name: "Boston Pizza",
      href: "/franchise-opportunity/ontario/boston-pizza",
    },
    {
      name: "Naturals2Go",
      href: "/franchise-opportunity/ontario/naturals2go",
    },
    {
      name: "Charleys Philly Steak",
      href: "/franchise-opportunity/ontario/charleys-philly-steak",
    },
    {
      name: "Potikki's",
      href: "/franchise-opportunity/ontario/potikkis",
    },
  ];

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsMobileCommunitiesOpen(false);
    setIsMobileSellersOpen(false);
    setIsMobileFranchiseOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  const suggestions =
    query.trim() === ""
      ? []
      : ALL_ONTARIO_CITIES.filter((city) =>
          city.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktop =
        desktopSearchRef.current &&
        desktopSearchRef.current.contains(event.target);
      const clickedMobile =
        mobileSearchRef.current &&
        mobileSearchRef.current.contains(event.target);
      if (!clickedDesktop && !clickedMobile) setIsExpanded(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0] || "";
    const secondSegment = segments[1] || "";
    const isCityPath = firstSegment && !nonCityRoots.has(firstSegment);
    const nextQuery = isCityPath ? slugToCity(firstSegment) : "";

    setQuery(nextQuery);
    setIsExpanded(false);
    setIsSearching(false);
  }, [pathname]);

  const handleSelect = (city) => {
    setQuery(city);
    setIsExpanded(false);
    nProgress.start();
    router.push(`/${cityToSlug(city)}`);
  };

  const looksLikeListingInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (/\d/.test(trimmed)) return true;
    return /^[A-Za-z0-9-]{6,}$/.test(trimmed);
  };

  const handleSearch = async () => {
    const raw = query.trim();
    if (!raw || isSearching) return;

    const exactCity = ALL_ONTARIO_CITIES.find(
      (city) => city.toLowerCase() === raw.toLowerCase(),
    );
    if (exactCity) {
      handleSelect(exactCity);
      return;
    }

    const firstPartialCity = ALL_ONTARIO_CITIES.find((city) =>
      city.toLowerCase().includes(raw.toLowerCase()),
    );
    const shouldLookupListingFirst = looksLikeListingInput(raw);

    if (!shouldLookupListingFirst && firstPartialCity) {
      handleSelect(firstPartialCity);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(
        `/api/property-lookup?q=${encodeURIComponent(raw)}`,
      );
      const data = await res.json();

      if (res.ok && data?.found && data?.city && data?.listingKey) {
        setIsExpanded(false);
        nProgress.start();
        router.push(`/${cityToSlug(data.city)}/${data.listingKey}`);
        return;
      }
    } catch {
      // Ignore lookup errors and fallback to city behavior.
    } finally {
      setIsSearching(false);
    }

    if (firstPartialCity) {
      handleSelect(firstPartialCity);
      return;
    }

    if (!looksLikeListingInput(raw)) {
      setIsExpanded(false);
      nProgress.start();
      router.push(`/${cityToSlug(raw)}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          "overflow-x-clip overflow-y-visible w-full z-50",
          pathname === "/" ? "absolute top-0 left-0 bg-transparent text-slate-900" : "relative bg-white text-black"
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 flex items-center justify-start gap-2 sm:gap-4 md:gap-6">
              <Link href="/" className="flex shrink-0">
                <span className="text-2xl md:text-3xl font-bold text-blue-950">bizmonk.</span>
              </Link>

              {showHeaderSearch && (
                <div
                  ref={desktopSearchRef}
                  className="relative flex-1 min-w-0 max-w-md ml-1 md:ml-2 mr-2 md:mr-3"
                >
                  <div
                    className={cn(
                      "relative flex items-center bg-gray-100 border border-transparent transition-all duration-200 hover:border-gray-200 hover:shadow-lg focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-lg",
                      isExpanded && suggestions.length > 0
                        ? "rounded-t-xl md:rounded-t-2xl"
                        : "rounded-full",
                    )}
                  >
                    <input
                      type="text"
                      placeholder="Search MLS or city"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsExpanded(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      className="w-full h-9 md:h-11 bg-transparent pl-3 md:pl-6 pr-10 md:pr-14 text-xs md:text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      aria-label="Search"
                      className="absolute right-2 md:right-3 p-1 text-gray-700 hover:text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <span className="inline-block h-3 w-3 md:h-4 md:w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-700" />
                      ) : (
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>
                  </div>

                  {isExpanded && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white rounded-b-xl md:rounded-b-2xl shadow-xl border border-t-0 border-gray-200 overflow-hidden z-120">
                      {suggestions.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleSelect(city)}
                          className="w-full px-3 md:px-4 py-2 md:py-2.5 text-left text-gray-900 hover:bg-gray-50 transition flex items-center gap-2 border-b border-gray-100 last:border-0"
                        >
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#38003c]" />
                          <span className="text-xs md:text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-4 xl:gap-6 ml-4 whitespace-nowrap">
              <nav className="flex items-center gap-4 xl:gap-6 flex-nowrap whitespace-nowrap">
                <Link
                  href="/"
                  className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>

                {/* CITIES DROPDOWN */}
                <div className="relative group py-2">
                  <button className="flex items-center gap-1 text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Cities{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 w-40 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100">
                    <div className="flex flex-col py-2">
                      {communities.map((city) => (
                        <Link
                          key={city}
                          href={`/${cityToSlug(city)}`}
                          className="px-6 py-3 text-[15px] font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b last:border-0 border-gray-50"
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SELLERS DROPDOWN */}
                {/* <div className="relative group py-2">
                  <button className="flex items-center gap-1 text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Sellers{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-80 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100">
                    <div className="flex flex-col py-2">
                      {sellerLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="px-6 py-3 text-[15px] font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b last:border-0 border-gray-50 whitespace-nowrap"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div> */}

                {/* FRANCHISE DROPDOWN */}
                <div className="relative group py-2">
                  <button className="flex items-center gap-1 text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Franchise{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-80 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100">
                    <div className="flex flex-col py-2">
                      {franchiseLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="px-6 py-3 text-[15px] font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b last:border-0 border-gray-50"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Link
                  href="tel:905-226-7284"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="hidden xl:inline">905-226-7284</span>
                </Link>
              </div>
            </div>

            <button
              className="lg:hidden p-1.5 sm:p-2 text-black"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-60 h-full w-72 md:w-80 bg-white text-black shadow-2xl transform transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between px-6 h-20 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={closeMenu} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-4 overflow-y-auto scrollbar-hide h-[calc(100%-80px)]">
          <Link href="/" onClick={closeMenu} className="text-sm font-bold">
            Home
          </Link>

          {/* Mobile Communities Accordion */}
          <div>
            <button
              onClick={() =>
                setIsMobileCommunitiesOpen(!isMobileCommunitiesOpen)
              }
              className="flex items-center justify-between w-full text-sm font-bold py-2"
            >
              Cities{" "}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isMobileCommunitiesOpen && "rotate-180",
                )}
              />
            </button>
            {isMobileCommunitiesOpen && (
              <div className="flex flex-col pl-4 mt-2 gap-3 border-l-2 text-gray-700 border-gray-100">
                {communities?.map((city, index) => (
                  <Link
                    key={index}
                    href={`/${cityToSlug(city)}`}
                    onClick={closeMenu}
                    className="text-sm text-gray-700 py-1"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Sellers Accordion */}
          {/* <div>
            <button
              onClick={() => setIsMobileSellersOpen(!isMobileSellersOpen)}
              className="flex items-center justify-between w-full text-sm font-bold py-2"
            >
              Sellers{" "}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isMobileSellersOpen && "rotate-180",
                )}
              />
            </button>
            {isMobileSellersOpen && (
              <div className="flex flex-col pl-4 mt-2 gap-3 border-l-2 text-gray-700 border-gray-100">
                {sellerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-sm text-gray-700 py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div> */}

          {/* Mobile Franchise Accordion */}
          <div>
            <button
              onClick={() => setIsMobileFranchiseOpen(!isMobileFranchiseOpen)}
              className="flex items-center justify-between w-full text-sm font-bold py-2"
            >
              Franchise{" "}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isMobileFranchiseOpen && "rotate-180",
                )}
              />
            </button>
            {isMobileFranchiseOpen && (
              <div className="flex flex-col pl-4 mt-2 gap-3 border-l-2 text-gray-700 border-gray-100">
                {franchiseLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-sm text-gray-700 py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="text-sm font-bold border-b border-gray-50 pb-2"
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-auto pt-6 flex flex-col gap-4">
            <Link
              href="tel:905-226-7284"
              className="text-md font-bold text-blue-600"
            >
              905-226-7284
            </Link>
          </div>
        </nav>
      </aside>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-55 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Header;
