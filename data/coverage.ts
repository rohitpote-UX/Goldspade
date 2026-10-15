export type CoverageTier = "hub" | "corridor" | "coastal" | "regional" | "remote";

export type RegionId =
  | "pune"
  | "western-maharashtra"
  | "north-karnataka"
  | "goa"
  | "konkan"
  | "pan-india";

export interface CoverageCity {
  id: string;
  name: string;
  displayName: string;
  alias?: string;
  regionId: RegionId;
  regionName: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // SVG canvas coordinate (0-800)
    y: number; // SVG canvas coordinate (0-680)
  };
  tier: CoverageTier;
  isBaseStudio?: boolean;
  shortDescription: string;
  operatingModel: {
    type: "Headquarters & Local Collaboration" | "Regional Corridor & On-Site Alignment" | "Remote Execution & Sprint Delivery";
    badge: string;
    description: string;
  };
  keyDistrictsOrAreas: string[];
  deliverables: string[];
  serviceLinks: Array<{ label: string; href: string }>;
  locationUrl?: string;
  caseStudy?: {
    title: string;
    href: string;
  };
}

export interface CoverageRegion {
  id: RegionId;
  name: string;
  shortName: string;
  state: string;
  tagline: string;
  description: string;
  operatingType: string;
  primaryCityId: string;
  cityIds: string[];
  keyIndustries: string[];
}

export const COVERAGE_REGIONS: CoverageRegion[] = [
  {
    id: "pune",
    name: "Pune Metropolitan",
    shortName: "Pune (Studio Base)",
    state: "Maharashtra",
    tagline: "Primary Studio Headquarters & Engineering Core",
    description:
      "Goldspade's primary operating base. We host in-person architectural roadmapping, product discovery, and sprint reviews across Pune while delivering production-grade web systems globally.",
    operatingType: "Studio Headquarters & In-Person Collaboration",
    primaryCityId: "pune",
    cityIds: ["pune"],
    keyIndustries: ["SaaS & Tech Startups", "Industrial Manufacturing", "Real Estate & Architecture", "Enterprise Groups"],
  },
  {
    id: "western-maharashtra",
    name: "Western Maharashtra Corridor",
    shortName: "Western Maharashtra",
    state: "Maharashtra",
    tagline: "NH48 Industrial, Commercial & Hospitality Corridor",
    description:
      "Direct NH48 connectivity from our Pune studio. We serve manufacturing groups, agro-processing leaders, luxury hospitality brands, and trading businesses across Karad, Satara, Kolhapur, and Sangli.",
    operatingType: "Corridor On-Site Alignment & Sprints",
    primaryCityId: "karad",
    cityIds: ["karad", "satara", "kolhapur", "sangli"],
    keyIndustries: ["Hospitality & Food Heritage", "Heavy Engineering & Foundries", "Agro-Processing & Sugar", "Retail Chains"],
  },
  {
    id: "north-karnataka",
    name: "North Karnataka Corridor",
    shortName: "North Karnataka",
    state: "Karnataka",
    tagline: "Commercial Crossroads & Industrial Tech Hubs",
    description:
      "Connecting North Karnataka commercial capitals with principal-architect craftsmanship. We build bespoke business websites, high-speed portals, and custom operational software for Belagavi (Belgaum) and Hubballi-Dharwad.",
    operatingType: "Regional On-Site Discovery & Remote Sprints",
    primaryCityId: "belagavi",
    cityIds: ["belagavi", "hubballi-dharwad"],
    keyIndustries: ["Precision Engineering & Auto Ancillaries", "Logistics & Cross-Border Trade", "Retail & Distribution", "Educational Tech"],
  },
  {
    id: "goa",
    name: "Goa Coastal Corridor",
    shortName: "Goa",
    state: "Goa",
    tagline: "Bespoke Hospitality, Architecture & Boutique Commerce",
    description:
      "Partnering with founders across North and South Goa in luxury hospitality, lifestyle real estate, culinary ventures, and creative digital brands. Regular on-site creative kickoffs paired with high-performance Next.js delivery.",
    operatingType: "Creative Kickoff On-Site & Digital Delivery",
    primaryCityId: "goa",
    cityIds: ["goa"],
    keyIndustries: ["Luxury Resorts & Boutique Villas", "Culinary Brands & Nightlife", "Architectural Real Estate", "Creative Studios"],
  },
  {
    id: "konkan",
    name: "Konkan Coastal Belt",
    shortName: "Konkan Coast",
    state: "Maharashtra",
    tagline: "Agro-Tourism, Marine Commerce & Coastal Enterprise",
    description:
      "Extending from Raigad and Alibag down through Chiplun, Ratnagiri, and Sindhudurg. Goldspade engineers direct-to-consumer e-commerce, agro-export portals, and authentic hospitality platforms for coastal ventures.",
    operatingType: "Digital-First Collaboration & Field Alignment",
    primaryCityId: "konkan",
    cityIds: ["konkan"],
    keyIndustries: ["Agro-Tourism & Nature Resorts", "Direct-to-Consumer Food & Fruit Exports", "Maritime Commerce", "Regional Heritage"],
  },
  {
    id: "pan-india",
    name: "Pan-India & Remote Collaboration",
    shortName: "Pan-India Remote",
    state: "India-wide",
    tagline: "Modern Technology Without Geographic Boundaries",
    description:
      "Beyond our regional corridors, Goldspade collaborates with ambitious founders across Mumbai, Bengaluru, Delhi NCR, Hyderabad, and internationally. Clean architecture, async discipline, and clear weekly milestones.",
    operatingType: "Disciplined Remote Sprints & Async Collaboration",
    primaryCityId: "pan-india",
    cityIds: ["pan-india"],
    keyIndustries: ["Fintech & AI Copilots", "Multi-Tenant SaaS", "D2C Brands", "Institutional Digital Flagships"],
  },
];

export const COVERAGE_CITIES: CoverageCity[] = [
  {
    id: "pune",
    name: "Pune",
    displayName: "Pune, Maharashtra",
    regionId: "pune",
    regionName: "Pune Metropolitan",
    state: "Maharashtra",
    coordinates: {
      lat: 18.5204,
      lng: 73.8567,
      x: 297,
      y: 169,
    },
    tier: "hub",
    isBaseStudio: true,
    shortDescription:
      "Studio headquarters and engineering center. In-person architecture discovery and product workshops across Baner, Hinjawadi, Kothrud, Kalyani Nagar, and central Pune.",
    operatingModel: {
      type: "Headquarters & Local Collaboration",
      badge: "STUDIO HEADQUARTERS",
      description: "Direct in-person discovery, architectural roadmapping, and co-located sprint alignments.",
    },
    keyDistrictsOrAreas: ["Baner & Balewadi", "Hinjawadi IT Park", "Kalyani Nagar & Viman Nagar", "Kothrud & Deccan", "Senapati Bapat Road"],
    deliverables: [
      "Bespoke Digital Flagships (Next.js 15, Tailwind, GSAP)",
      "Multi-Tenant SaaS Dashboards & Client Portals",
      "Practical AI Copilots & Semantic Intelligence",
      "Core Web Vitals Optimization (Sub-Second Speed)",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "Custom Software & Web Apps", href: "/services/custom-software-web-applications" },
      { label: "AI Integration & Automation", href: "/services/ai-integration-automation" },
    ],
    locationUrl: "/locations/pune",
    caseStudy: {
      title: "BrandBattle & Mayuri Developer",
      href: "/work/brandbattle",
    },
  },
  {
    id: "satara",
    name: "Satara",
    displayName: "Satara, Maharashtra",
    regionId: "western-maharashtra",
    regionName: "Western Maharashtra Corridor",
    state: "Maharashtra",
    coordinates: {
      lat: 17.6805,
      lng: 73.9935,
      x: 323,
      y: 274,
    },
    tier: "corridor",
    shortDescription:
      "Industrial manufacturing, heritage trade, and regional business systems connected via the direct NH48 corridor from Pune.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CORRIDOR ALIGNMENT",
      description: "1.5 hours from Pune via NH48. Scheduled on-site kickoffs and fast sprint cycles.",
    },
    keyDistrictsOrAreas: ["Satara MIDC", "Wai & Panchgani Corridor", "Old Satara Trade Centers"],
    deliverables: [
      "Industrial Catalog & Inquiry Portals",
      "Internal Inventory & Operations Software",
      "High-Performance Business Brand Sites",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "Custom Software & Web Apps", href: "/services/custom-software-web-applications" },
    ],
    locationUrl: "/locations/satara",
  },
  {
    id: "karad",
    name: "Karad",
    displayName: "Karad, Satara District",
    regionId: "western-maharashtra",
    regionName: "Western Maharashtra Corridor",
    state: "Maharashtra",
    coordinates: {
      lat: 17.2885,
      lng: 74.1844,
      x: 359,
      y: 323,
    },
    tier: "corridor",
    shortDescription:
      "Proven digital partner for Karad businesses. High-converting hospitality platforms, culinary flagships, and operational management systems.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CORRIDOR ALIGNMENT",
      description: "Regular on-site presence. Proven delivery with local leaders Hotel Atithi & Mamacha Mala.",
    },
    keyDistrictsOrAreas: ["Karad MIDC", "NH48 Commercial Belt", "Ogalewadi & Malkapur"],
    deliverables: [
      "Hospitality Booking & Table Reservation Portals",
      "Agro-Industrial Commercial Platforms",
      "Bespoke Local Business Web Flagships",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "E-Commerce & Hospitality Platforms", href: "/services/ecommerce-development" },
    ],
    locationUrl: "/locations/karad",
    caseStudy: {
      title: "Hotel Atithi & Mamacha Mala",
      href: "/work/mamacha-mala",
    },
  },
  {
    id: "kolhapur",
    name: "Kolhapur",
    displayName: "Kolhapur, Maharashtra",
    regionId: "western-maharashtra",
    regionName: "Western Maharashtra Corridor",
    state: "Maharashtra",
    coordinates: {
      lat: 16.705,
      lng: 74.2433,
      x: 370,
      y: 395,
    },
    tier: "corridor",
    shortDescription:
      "Enterprise foundry systems, auto ancillary portals, textile exports, and legacy culinary brand platforms for Kolhapur leaders.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CORRIDOR ALIGNMENT",
      description: "Direct highway connectivity. Regular on-site alignment meetings for manufacturing executives.",
    },
    keyDistrictsOrAreas: ["Shiroli MIDC", "Gokul Shirgaon MIDC", "Udyamnagar", "Rajarampuri Commercial Hub"],
    deliverables: [
      "Heavy Foundry Specification Engines",
      "Textile & Jaggery Export Portals",
      "ERP-Connected Internal Tools",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "Custom Software & Web Apps", href: "/services/custom-software-web-applications" },
    ],
    locationUrl: "/locations/kolhapur",
  },
  {
    id: "sangli",
    name: "Sangli",
    displayName: "Sangli–Miraj, Maharashtra",
    regionId: "western-maharashtra",
    regionName: "Western Maharashtra Corridor",
    state: "Maharashtra",
    coordinates: {
      lat: 16.8524,
      lng: 74.5815,
      x: 434,
      y: 377,
    },
    tier: "corridor",
    shortDescription:
      "Modern digital solutions for agro-trade, turmeric & spice commerce, multi-specialty healthcare networks, and manufacturing in Sangli-Miraj.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CORRIDOR ALIGNMENT",
      description: "Connected across the Krishna river valley. Bi-weekly sprint milestones and on-site discovery.",
    },
    keyDistrictsOrAreas: ["Kupwad MIDC", "Miraj Healthcare Corridor", "Sangli Market Yard (APMC)"],
    deliverables: [
      "Commodity Trading & B2B Portals",
      "Healthcare Appointment & Tele-Consult Portals",
      "Manufacturing Operations Tools",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "Technical SEO & Performance", href: "/services/technical-seo-performance" },
    ],
    locationUrl: "/locations/sangli",
  },
  {
    id: "belagavi",
    name: "Belagavi",
    displayName: "Belagavi (Belgaum), Karnataka",
    alias: "Belgaum",
    regionId: "north-karnataka",
    regionName: "North Karnataka Corridor",
    state: "Karnataka",
    coordinates: {
      lat: 15.8497,
      lng: 74.4977,
      x: 418,
      y: 502,
    },
    tier: "corridor",
    shortDescription:
      "Website developer and custom software partner for Belgaum enterprises. Bridging Maharashtra-Karnataka border commerce with high-authority web systems.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CORRIDOR ALIGNMENT",
      description: "Connected directly via NH48. On-site technical discovery followed by agile digital sprints.",
    },
    keyDistrictsOrAreas: ["Udyambag Industrial Estate", "Machhe Industrial Area", "Camp & Tilakwadi Commercial Centers", "Kakati MIDC"],
    deliverables: [
      "Precision Foundry & Hydraulic Web Systems",
      "Cross-Border Retail & Billing Platforms",
      "Multi-Lingual Internal Workflows (EN, MR, KN)",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "Custom Software & Web Apps", href: "/services/custom-software-web-applications" },
      { label: "E-Commerce & Digital Commerce", href: "/services/ecommerce-development" },
    ],
    locationUrl: "/locations/belagavi",
    caseStudy: {
      title: "EzDukkan Retail Architecture",
      href: "/work/ezdukkan",
    },
  },
  {
    id: "hubballi-dharwad",
    name: "Hubballi-Dharwad",
    displayName: "Hubballi–Dharwad (Hubli), Karnataka",
    alias: "Hubli",
    regionId: "north-karnataka",
    regionName: "North Karnataka Corridor",
    state: "Karnataka",
    coordinates: {
      lat: 15.3647,
      lng: 75.124,
      x: 537,
      y: 562,
    },
    tier: "corridor",
    shortDescription:
      "Software development, web design, and automation for Hubli startups, logistics hubs, and educational institutions across the twin cities.",
    operatingModel: {
      type: "Remote Execution & Sprint Delivery",
      badge: "REMOTE SPRINTS",
      description: "Fast remote sprints with weekly video demos, shared GitHub repos, and scheduled executive roadmapping.",
    },
    keyDistrictsOrAreas: ["Gokul Road Industrial Hub", "Deshpande Nagar & Vidyanagar", "Dharwad High-Tech Growth Area"],
    deliverables: [
      "Logistics Dispatch & Tracking Portals",
      "EdTech & University Student Portals",
      "SaaS Startups & AI Integrations",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "AI Integration & Automation", href: "/services/ai-integration-automation" },
    ],
    locationUrl: "/locations/hubballi-dharwad",
  },
  {
    id: "goa",
    name: "Goa",
    displayName: "Goa (North & South Goa)",
    regionId: "goa",
    regionName: "Goa Coastal Corridor",
    state: "Goa",
    coordinates: {
      lat: 15.4909,
      lng: 73.8278,
      x: 292,
      y: 546,
    },
    tier: "coastal",
    shortDescription:
      "Bespoke websites and digital experiences for luxury resorts, boutique villas, fine dining establishments, and lifestyle brands across Goa.",
    operatingModel: {
      type: "Regional Corridor & On-Site Alignment",
      badge: "CREATIVE KICKOFF ON-SITE",
      description: "Regular travel to Goa for creative spatial reviews, photography alignment, and founder roadmaps.",
    },
    keyDistrictsOrAreas: ["Panaji (Capital & Business)", "Assagao & Anjuna (Boutique Hubs)", "Candolim & Calangute", "Margao & South Goa Resorts"],
    deliverables: [
      "Luxury Spatial & Hospitality Web Portals",
      "Sub-Second Global Edge Delivery (Cloudflare/Vercel)",
      "Direct Booking Workflows (Zero OTA Commission)",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "E-Commerce & Direct Booking", href: "/services/ecommerce-development" },
    ],
    locationUrl: "/locations/goa",
    caseStudy: {
      title: "Hospitality & Villa Flagships",
      href: "/work/saanjgarva",
    },
  },
  {
    id: "konkan",
    name: "Konkan Coast",
    displayName: "Konkan Coast, Maharashtra",
    regionId: "konkan",
    regionName: "Konkan Coastal Belt",
    state: "Maharashtra",
    coordinates: {
      lat: 16.9902,
      lng: 73.312,
      x: 195,
      y: 360,
    },
    tier: "coastal",
    shortDescription:
      "Direct-to-consumer mango & agro exports, boutique coastal homestays, and maritime commerce across Ratnagiri, Sindhudurg, Chiplun, and Raigad.",
    operatingModel: {
      type: "Remote Execution & Sprint Delivery",
      badge: "DIGITAL-FIRST SPRINT",
      description: "Digital-first collaboration with on-demand field trips for packaging, photography, and brand foundations.",
    },
    keyDistrictsOrAreas: ["Ratnagiri & Mirya Port", "Sindhudurg (Kudal, Sawantwadi, Malvan)", "Chiplun Industrial Belt", "Raigad & Alibag Coastal Strip"],
    deliverables: [
      "Direct-to-Consumer Seasonal Harvest E-Commerce",
      "Authentic Coastal Agro-Tourism Websites",
      "Marine Logistics & Supply Chain Software",
    ],
    serviceLinks: [
      { label: "Website Design & Development", href: "/services/website-design-development" },
      { label: "E-Commerce & Payment Solutions", href: "/services/ecommerce-development" },
    ],
    locationUrl: "/locations/konkan",
    caseStudy: {
      title: "Saanjgarva Coastal Hospitality",
      href: "/work/saanjgarva",
    },
  },
  {
    id: "pan-india",
    name: "Pan-India & Remote",
    displayName: "India & Remote International",
    regionId: "pan-india",
    regionName: "Pan-India & Remote Collaboration",
    state: "India-wide",
    coordinates: {
      lat: 19.076,
      lng: 75.8,
      x: 640,
      y: 190,
    },
    tier: "remote",
    shortDescription:
      "Partnering with founders in Mumbai, Bengaluru, Delhi NCR, Hyderabad, and overseas. High-velocity async sprints, modern Next.js 15, and strict engineering discipline.",
    operatingModel: {
      type: "Remote Execution & Sprint Delivery",
      badge: "GLOBAL REMOTE",
      description: "Weekly milestone demos, shared Slack/WhatsApp channels, continuous deployment, and transparent timelines.",
    },
    keyDistrictsOrAreas: ["Mumbai & MMR", "Bengaluru Tech Corridor", "Delhi NCR & Gurugram", "Hyderabad Tech Zone", "Global Founders"],
    deliverables: [
      "AI-Powered SaaS Applications",
      "Interactive Product Landing Experiences",
      "Enterprise Design Systems (Figma to Code)",
      "High-Traffic Headless Architectures",
    ],
    serviceLinks: [
      { label: "Custom Software & Web Apps", href: "/services/custom-software-web-applications" },
      { label: "AI Integration & Intelligent Workflows", href: "/services/ai-integration-automation" },
      { label: "Full Service Capabilities", href: "/capabilities" },
    ],
    locationUrl: "/capabilities",
    caseStudy: {
      title: "BrandBattle AI Platform",
      href: "/work/brandbattle",
    },
  },
];
