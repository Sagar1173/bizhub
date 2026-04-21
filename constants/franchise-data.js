import { franchiseCities } from "./franchiseCities";

const baseFranchises = [

  {
    name: "Boardwalk Burgers",
    type: "Fast Casual Restaurant",
    investment: "$400,000 - $500,000",
    locations: "High traffic retail locations preferred",
    image: "/boardwalky.jpg",
    description: 
      "Boardwalk Fries Burgers Shakes is a fast-casual restaurant brand inspired by the classic boardwalk dining experience. Known for its fresh-cut fries, made-to-order burgers, and creamy milkshakes made with quality dairy, the brand focuses on simple ingredients and bold flavors.",

   // brochure: "/brochures/boardwalk.pdf",

    financing: {
      "Restaurant Model": "Typical restaurant location",
      "startUp Costs": "$400,000 - $500,000",
      "liquid Capital": "$150,000",
      "franchisee Fee": "$30,000",
      royalties: "6%",
      marketing: "3%"
    },

    stats: [
      { value: "1981", label: "FOUNDED" },
      { value: "FRESH CUT", label: "SIGNATURE BOARDWALK FRIES" },
      { value: "MADE TO ORDER", label: "BURGERS PREPARED FRESH" },
      { value: "CANADIAN DAIRY", label: "MILKSHAKES" }
    ],

    contactImage: null,

    specialities: [
      "Signature boardwalk-style fresh cut fries",
      "Made-to-order burgers prepared fresh",
      "Milkshakes made with Canadian dairy",
      "Simple fast-casual menu focused on quality ingredients",
      "Boardwalk-inspired restaurant concept"
    ],

    storeModels: [
      {
        type: "Restaurant Location",
        description:
          "Boardwalk restaurants typically operate in high-traffic retail locations offering dine-in and takeout service.",
        image: "/boardwalk-urban.png"
      }
    ]
  },
  {
    name: "Shawarma Lab",
    type: "Mediterranean Fast Casual Restaurant",
    investment: "$500,000+",
    locations: "Operating across multiple cities in Canada with franchise opportunities available",
    image: "/shawarmalab.png",

    description: "Shawarma Lab is a modern fast-casual Mediterranean restaurant serving fresh, made-to-order shawarma wraps, bowls, and plates. Focused on premium ingredients and bold flavors, it delivers a contemporary dining experience.",

    brochure: null,

    financing: {
      "Restaurant Model": "Fast casual restaurant",
      "startUp Costs": "Not publicly disclosed",
      "liquid Capital": "$150,000 minimum",
      "net Worth": "$500,000 minimum",
      "franchisee Fee": "Not publicly disclosed",
      royalties: "Not publicly disclosed",
      marketing: "Franchise marketing support provided"
    },

    stats: [
      { value: "2020", label: "FOUNDED" },
      { value: "3+", label: "CURRENT LOCATIONS (EXPANDING)" },
      { value: "FAST", label: "GROWING FAST CASUAL BRAND" },
      { value: "CANADA", label: "MULTI-CITY PRESENCE" }
    ],

    contactImage: null,

    specialities: [
      "Fresh made-to-order Mediterranean shawarma",
      "Wraps, bowls, plates, and catering options",
      "Premium ingredients and bold flavour profiles",
      "Fast-casual quick service model",
      "Franchise support including training and operations guidance"
    ],

  },
  {
    name: "Mary Brown's Chicken",
    type: "Fast Food Restaurant",
    investment: "$450K - $700K",
    locations: "Premium locations available",
    image: "/marryb.webp",
    description:
      "Be part of Canada's fastest-growing chicken restaurant chain known for its Made Fresh from Scratch™ preparation. With over 50 years of success, Mary Brown's offers a proven business model and comprehensive support system.",
    brochure: "/brochures/marybrowns.pdf",
    financing: {
      "Restaurant Model": "Full Store: 1,800-3,000 sq. ft.",
      "startUp Costs": "$875,000+",
      "liquid Capital": "$300,000",
      "franchisee Fee": "$30,000",
      royalties: "5%",
      marketing: "4%",
    },
    stats: [
      { value: "270+", label: "STORES" },
      { value: "55+", label: "YEARS IN BUSINESS" },
      { value: "18", label: "CONSECUTIVE YEARS SAME STORE SALES GROWTH" },
      {
        value: "14",
        label: "YEARS CONSECUTIVE FRANCHISEES' CHOICE AWARD WINNER",
      },
    ],
    contactImage: null,
    specialities: [
      "Individual or multi-unit operators are welcome",
      "Best-in-class training at our training centre",
      "3 week comprehensive Training Course teaches you how to produce and serve consistently perfect product – profitably",
      "Our purchasing team ensures the highest quality products are available chain-wide for all Mary Brown's menu items",
      "An expert group of Banking and Business Advisors is available to assist with financial planning and any questions you may have.",
    ],
    storeModels: [
      {
        type: "Stand Alone with Drive Thru",
        description:
          "Our stand alone model with Drive Thru offers a spacious 2,200 to 3,200 square foot floor plan as well as additional sales opportunities in the drive-thru.",
        image: "/marybrown-drivethru.webp",
      },
      {
        type: "Stand Alone",
        description:
          "Mary Brown's stand alone locations are typically 1,800 to 2,500 square feet, providing ample dine-in seating as well as convenient take-out ordering.",
        image: "/marybrown-standalone.webp",
      },
      {
        type: "End Cap",
        description:
          "End cap offers unique design and enhanced visibility. Square footage is 1,700 to 2,200 square feet for dine-in guest seating and take-out.",
        image: "/marybrown-endcap.webp",
      },
      {
        type: "In Line",
        description:
          "Mary Brown's in line models are 1,700 – 2,200 square feet.",
        image: "/marybrown-inline.webp",
      },
      {
        type: "Non-Traditional",
        description:
          "A smaller footprint at 600-1,000 square feet including Walmart locations, mall locations and express locations that are ideal for universities, airports, sport arenas and other options.",
        image: "/marybrown-notraditional.webp",
      },
    ],
  },

  {
    name: "Fat Bastard Burrito",
    type: "Fast Casual Restaurant",
    investment: "$350K - $500K",
    locations: "Prime locations available",
    image: "/fatbb.jpg",
    description:
      "Join Canada's fastest-growing burrito franchise with a unique menu and strong brand presence. Fat Bastard Burrito offers an innovative concept with exceptional profit potential and comprehensive franchise support.",
    specialities: [
      "Proven business model with strong track record",
      "Comprehensive training and ongoing support",
      "Strong brand recognition and marketing support",
      "Prime location opportunities",
      "Established supply chain and operations systems",
    ],
  },
  {
    name: "Infinity Mart",
    type: "Convenience & Retail Store",
    investment: "$185K - $485.5K",
    locations: "High-traffic and high-visibility areas",
    image: "/infinity-mart.jpeg",
    description:
      "Infinity Mart offers a modern, low-overhead convenience retail model designed for maximum profitability and scalability. With comprehensive training, strategic site selection, and ongoing support, Infinity Mart empowers franchisees to build a lean and profitable retail business.",
    financing: {
      "Restaurant Model": "Retail Convenience Store: 300–3,000 sq. ft.",
      "startUp Costs": "$185,000 – $485,500",
      "liquid Capital": "$100,000+",
      "franchisee Fee": "$30,000",
      royalties: "Not disclosed",
      marketing: "Not disclosed",
    },
    specialities: [
      "Low-overhead and high-efficiency business model",
      "Hands-on training in real store environment",
      "Comprehensive site selection and lease negotiation support",
      "Ongoing operational guidance and performance coaching",
      "Flexible store formats for malls, transit hubs, and residential areas",
    ],
    storeModels: [
      {
        type: "Retail Convenience Model",
        description:
          "Compact retail format (300–3,000 sq. ft.) designed for high-traffic environments such as transit hubs, office towers, or residential plazas. Emphasizes efficient layout, clear signage, and easy operations.",
        image: "/infinity-mart-1.jpeg",
      },
    ],
    contactImage: null,
  },

  {
    name: "WingsUp",
    type: "Fast Casual Restaurant",
    investment: "$400K - $480K",
    locations: "Prime locations available",
    image: "/franchises/wingsup.jpg",
    description:
      "Join Canada's leading takeout and delivery chicken wing franchise with a proven business model and strong brand presence. WingsUp! offers a turn-key operation with high efficiency, low overhead, and strong profit potential in the growing QSR industry.",
    specialities: [
      "Proven business model with minimal risk",
      "Turn-key storefronts with low overhead",
      "Strong brand recognition and growing customer base",
      "Perfect for the fast-growing online takeout and delivery market",
      "High-quality recipes that align with modern eating habits",
    ],
    financing: {
      "Restaurant Model": "Quick Service: 1,200-1,800 sq. ft.",
      "startUp Costs": "$400,000+",
      "liquid Capital": "$200,000",
      "franchisee Fee": "$34,500",
      royalties: "4.5%",
      marketing: "3%",
    },

    contactImage: null,
    video: "https://www.youtube.com/embed/nu6iHiKgzjg?si=6ulmBDnB1kWxbp5p",
  },
  {
    name: "Burger King",
    type: "Fast Food Restaurant",
    investment: "$500K - $1.2M",
    locations: "Available across major Canadian cities",
    image: "/burger-king.jpg",
    description:
      "Burger King is a global leader in the fast-food hamburger segment. With strong brand recognition and worldwide operations, it offers a robust franchise system with training, marketing, and operational support.",
    financing: {
      "Restaurant Model": "Drive-Thru & Dine-In",
      "startUp Costs": "$500,000+",
      "liquid Capital": "$250,000",
      "franchisee Fee": "$50,000",
      royalties: "4.5%",
      marketing: "4%",
    },
    specialities: [
      "Iconic brand with global presence",
      "Standardized operational model",
      "Flexible formats for urban and suburban markets",
      "Access to centralized supply chain",
      "Extensive training and onboarding",
    ],
    contactImage: null,
  },

  {
    name: "Burrito Jax",
    type: "Fast Casual Restaurant",
    investment: "$150K - $300K",
    locations: "Expansion opportunities available",
    image: "/burrito-jax.jpeg",
    description:
      "Burrito Jax brings fresh, customizable Mexican-inspired food with a Canadian twist. Known for quick service and quality ingredients, it's ideal for entrepreneurs looking to enter the QSR market with a low-cost model.",
    financing: {
      "Restaurant Model": "Quick Service: 800-1,200 sq. ft.",
      "startUp Costs": "$200,000+",
      "liquid Capital": "$100,000",
      "franchisee Fee": "$20,000",
      royalties: "5%",
      marketing: "2%",
    },
    specialities: [
      "Fresh and customizable menu",
      "Lower initial investment",
      "Strong appeal to health-conscious consumers",
      "Great for small-footprint urban areas",
      "Efficient kitchen layout and operations",
    ],
    contactImage: null,
  },

  {
    name: "Boston Pizza",
    type: "Full-Service Restaurant",
    investment: "$1.5M - $2.5M",
    locations: "High-traffic locations available",
    image: "/boston-pizza.jpg",
    description:
      "Boston Pizza is one of Canada's most beloved casual dining and sports bar franchises, offering a comprehensive dine-in experience with a proven, scalable model.",
    financing: {
      "Restaurant Model": "Full-Service + Sports Bar: 4,000 - 6,000 sq. ft.",
      "startUp Costs": "$2,000,000+",
      "liquid Capital": "$500,000",
      "franchisee Fee": "$60,000",
      royalties: "7%",
      marketing: "2.5%",
    },
    specialities: [
      "Iconic brand with national presence",
      "Complete training and site selection assistance",
      "Robust marketing campaigns and loyalty programs",
      "Family-friendly menu and sports bar appeal",
      "Support for real estate and construction",
    ],
    contactImage: null,
  },

  {
    name: "Naturals2Go",
    type: "Healthy Vending Business",
    investment: "$60K - $150K",
    locations: "Flexible locations across Canada",
    image: "/natural2go.webp",
    description:
      "Naturals2Go is a healthy vending business that allows entrepreneurs to enter the vending market with advanced technology, training, and healthy products that align with wellness trends.",
    financing: {
      "Business Model": "Vending Machines: 5-10 units",
      "startUp Costs": "$60,000+",
      "liquid Capital": "$30,000",
      "franchisee Fee": "No franchise fee",
      royalties: "None",
      marketing: "Optional Support",
    },
    specialities: [
      "Home-based business with flexible schedule",
      "No franchise fees or royalties",
      "Healthy product inventory and AI vending machines",
      "Great for passive or semi-absentee ownership",
      "Full training and coaching included",
    ],
    contactImage: null,
  },

  // {
  //   name: "A&W Restaurant",
  //   type: "Fast Food Restaurant",
  //   investment: "$500K - $1M",
  //   locations: "Available in select Canadian markets",
  //   image: "/A&W.jpg",
  //   description:
  //     "A&W is one of Canada’s most iconic fast food brands known for its root beer, Teen Burgers, and commitment to natural ingredients. It offers a strong, community-based brand with innovative restaurant formats.",
  //   financing: {
  //     "Restaurant Model": "Urban & Drive-Thru: 1,200 - 2,400 sq. ft.",
  //     "startUp Costs": "$500,000+",
  //     "liquid Capital": "$250,000",
  //     "franchisee Fee": "$40,000",
  //     royalties: "5%",
  //     marketing: "3%",
  //   },
  //   specialities: [
  //     "Strong Canadian brand loyalty",
  //     "Commitment to hormone-free meats and natural sourcing",
  //     "Modern design with multiple layout options",
  //     "National advertising support",
  //     "Strong profitability and unit growth",
  //   ],
  //   contactImage: null,
  // },
  {
    name: "Charleys Philly Steak",
    type: "Quick Service Restaurant",
    investment: "$250K - $500K",
    locations: "Mall and high-footfall areas in Canada",
    image: "/charleys_philly-steak.webp",
    description:
      "Charleys Philly Steaks is the largest Philly cheesesteak franchise in the world. Known for hot, grilled-to-order sandwiches, it offers a simple menu with high consumer appeal in malls and food courts.",
    financing: {
      "Restaurant Model": "Food Court / Inline",
      "startUp Costs": "$350,000+",
      "liquid Capital": "$150,000",
      "franchisee Fee": "$24,500",
      royalties: "6%",
      marketing: "3%",
    },
    specialities: [
      "Internationally recognized brand",
      "Streamlined operations for food court locations",
      "Focus on fresh grilled subs and fries",
      "Excellent for mall-based foot traffic",
      "Strong franchise support and training",
    ],
    contactImage: null,
  },

  {
    name: "Potikki's",
    type: "Indian Fusion Restaurant",
    investment: "$200K - $350K",
    locations: "Urban centers with multicultural demand",
    image: "/potikkis.jpg",
    description:
      "Potikki’s is a rising Indian fusion QSR brand offering loaded chaats, wraps, and street-style bowls. Perfect for foodies and multicultural markets, it blends traditional Indian flavors with a modern fast-casual model.",
    financing: {
      "Restaurant Model": "QSR: 800-1,200 sq. ft.",
      "startUp Costs": "$250,000+",
      "liquid Capital": "$100,000",
      "franchisee Fee": "$25,000",
      royalties: "5%",
      marketing: "2%",
    },
    specialities: [
      "Unique Indian-fusion menu",
      "Compact and modern design",
      "Ideal for younger and multicultural customers",
      "Flexible kiosk and dine-in formats",
      "Social media-driven marketing model",
    ],
    contactImage: null,
  },

  {
    name: "Imperfect Eats",
    type: "Sustainable Food Concept",
    investment: "$100K - $250K",
    locations: "Eco-conscious cities in Canada",
    image: "/imperfect-eats.jpg",
    description:
      "Imperfect Eats is a sustainability-focused concept aiming to reduce food waste by selling 'imperfect' but perfectly edible produce and meals. A unique and socially responsible opportunity for green-minded entrepreneurs.",
    financing: {
      "Business Model": "Retail Café + Grocery: 500-1,000 sq. ft.",
      "startUp Costs": "$150,000+",
      "liquid Capital": "$75,000",
      "franchisee Fee": "$18,000",
      royalties: "4%",
      marketing: "1.5%",
    },
    specialities: [
      "Eco-conscious brand with mission-based appeal",
      "Minimal food waste concept",
      "Strong media and community engagement",
      "Flexible retail format (pop-up, store, or café)",
      "Ideal for first-time social entrepreneurs",
    ],
    contactImage: null,
  },

  {
    name: "Eggsmart",
    type: "Breakfast & Brunch Restaurant",
    investment: "$400K - $600K",
    locations: "High-traffic urban and suburban locations",
    image: "/eggsmart.jpg",
    description:
      "Eggsmart is a modern breakfast and brunch concept offering a fresh menu in a casual setting. It’s a popular choice for morning-focused operators and suits Canadian lifestyle habits.",
    financing: {
      "Restaurant Model": "Full-Service Breakfast: 1,800 - 2,500 sq. ft.",
      "startUp Costs": "$450,000+",
      "liquid Capital": "$150,000",
      "franchisee Fee": "$30,000",
      royalties: "5%",
      marketing: "2%",
    },
    specialities: [
      "Proven morning and brunch business model",
      "Full menu from eggs to smoothies",
      "Trendy interiors and welcoming ambiance",
      "Support in location selection and design",
      "Strong operations and culinary training",
    ],
    contactImage: null,
  },

  {
    name: "Qwench Juice Bar",
    type: "Health & Wellness Restaurant",
    investment: "$150K - $300K",
    locations: "Gyms, malls, universities, and busy retail centers",
    image: "/qwench.jpg",
    description:
      "Qwench Juice Bar offers freshly made juices, smoothies, and bowls using whole ingredients. It’s a vibrant health-focused concept riding the wellness trend across North America.",
    financing: {
      "Business Model": "Inline or Kiosk: 600 - 1,200 sq. ft.",
      "startUp Costs": "$200,000+",
      "liquid Capital": "$100,000",
      "franchisee Fee": "$25,000",
      royalties: "6%",
      marketing: "2%",
    },
    specialities: [
      "Fast-growing health & juice industry brand",
      "Menu with no syrups or additives",
      "Compact store footprint for urban centers",
      "Perfect for gym-adjacent and wellness hubs",
      "Excellent franchisee training and onboarding",
    ],
    contactImage: null,
  },
];

// Helper function to create location data
const createLocationData = (cityName) => ({
  title: `Franchise Opportunities in ${cityName}`,
  description: `Discover premium franchise opportunities in ${cityName}'s thriving market`,
  franchises: baseFranchises.map((franchise) => ({
    ...franchise,
    locations: franchise.locations + ` in ${cityName}`,
  })),
  stats: {
    availableFranchises: "100+",
    successRate: "95%",
    supportAndTraining: `${cityName}-based`,
    financingOptions: "Available",
  },
});

// Create a mapping of all valid locations
export const franchiseLocations = {
  ontario: {
    title: "Franchise Opportunities in Ontario",
    description: "Discover premium franchise opportunities across Ontario",
    franchises: baseFranchises.map((franchise) => ({
      ...franchise,
      locations: franchise.locations + " across Ontario",
    })),
    stats: {
      availableFranchises: "500+",
      successRate: "95%",
      supportAndTraining: "Comprehensive",
      financingOptions: "Multiple Available",
    },
  },
  ...Object.fromEntries(
    franchiseCities.map((city) => [
      // Convert city name to kebab-case for the key
      city.toLowerCase().replace(/ /g, "-").replace(/\./g, ""),
      // Create location data for each city
      createLocationData(city),
    ])
  ),
};

// Helper function to get location-specific content with error handling
export const getLocationContent = (location) => {
  const locationKey = location.toLowerCase();
  const locationData = franchiseLocations[locationKey];

  if (!locationData) {
    throw new Error(`Location not found: ${location}`);
  }

  return locationData;
};

// Add this new data structure for franchise partners
export const franchiseList = [
  {
    name: "A&W Restaurant",
    logo: "/franchises/a_&_w_restaurant.jpeg",
    displayName: "A&W Restaurant",
  },
  {
    name: "Charleys Philly Steak",
    logo: "/franchises/charleys_philly_steak.png",
    displayName: "Charleys Philly Steak",
  },
  {
    name: "Potikki's",
    logo: "/franchises/potikkis.png",
    displayName: "Potikki's",
  },
  {
    name: "241 Pizza",
    logo: "/franchises/241_pizza.png",
    displayName: "241 Pizza",
  },
  {
    name: "Boston Pizza",
    logo: "/franchises/boston_pizza.jpeg",
    displayName: "Boston Pizza",
  },
  {
    name: "Burger King",
    logo: "/franchises/burger_king.png",
    displayName: "Burger King",
  },
  {
    name: "Burrito Jax",
    logo: "/franchises/burrito_jax.png",
    displayName: "Burrito Jax",
  },
  {
    name: "Eggsmart",
    logo: "/franchises/eggsmart.png",
    displayName: "Eggsmart",
  },
  {
    name: "Imperfect Eats",
    logo: "/franchises/imperfect_eats.jpeg",
    displayName: "Imperfect Eats",
  },
  {
    name: "Kajun Chicken & Seafood",
    logo: "/franchises/kajun_chicken_&_seafood.png",
    displayName: "Kajun Chicken & Seafood",
  },
  {
    name: "Lice Squad & Superherokids",
    logo: "/franchises/lice_squad_&_superherokids.png",
    displayName: "Lice Squad & Superherokids",
  },
  {
    name: "Modern Cleaning",
    logo: "/franchises/modern_cleaning.png",
    displayName: "Modern Cleaning",
  },
  {
    name: "Naturals2Go",
    logo: "/franchises/naturals2go.png",
    displayName: "Naturals2Go",
  },
  {
    name: "Qwench Juice Bar",
    logo: "/franchises/qwench_juice_bar.png",
    displayName: "Qwench Juice Bar",
  },
  {
    name: "The Toasted Yolk Cafe",
    logo: "/franchises/the_toasted_yolk_cafe.png",
    displayName: "The Toasted Yolk Cafe",
  },
];
