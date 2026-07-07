import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { allListings } from "@/data/listings";

const CITIES = [
  "Halton", "Burlington", "Oakville", "Milton",
  "Brampton", "Mississauga", "Caledon", "Toronto",
].map(c => c.toLowerCase());

export function useGlobalSearch() {
  const router = useRouter();

  const handleSearch = (query) => {
    if (!query || !query.trim()) {
      toast.error("Please enter a city, address, or MLS® number.");
      return;
    }

    const q = query.trim().toLowerCase();

    // Perform partial match against relevant fields
    const matches = allListings.filter((p) => {
      return (
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        (p.fullAddress && p.fullAddress.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.mls && p.mls.toLowerCase().includes(q)) ||
        (p.mlsNumber && p.mlsNumber.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.projectName && p.projectName.toLowerCase().includes(q))
      );
    });

    if (matches.length === 0) {
      toast.error("No properties found matching your search.");
      return;
    }

    if (matches.length === 1) {
      const p = matches[0];
      const route = p.type === "upcoming" ? "upcoming" : "residential";
      router.push(`/${route}/${p.id}`);
      return;
    }

    // Multiple matches: check if it exactly matches a predefined city
    if (CITIES.includes(q)) {
      // Find the proper cased city name for the URL
      const properCity = CITIES.find(c => c === q);
      const originalCasedCity = [
        "Halton", "Burlington", "Oakville", "Milton",
        "Brampton", "Mississauga", "Caledon", "Toronto"
      ].find(c => c.toLowerCase() === properCity);
      
      router.push(`/buy?city=${encodeURIComponent(originalCasedCity)}`);
    } else {
      router.push(`/buy?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return { handleSearch };
}
