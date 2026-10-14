export interface LocationFaq {
  question: string;
  answer: string;
}

export interface LocalIndustryNeed {
  industry: string;
  challenge: string;
  solution: string;
}

export interface LocationProfile {
  slug: string;
  name: string;
  displayName: string;
  region: string;
  state: string;
  tier: 1 | 2 | 3 | 4;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeywords: string[];
  heroSummary: string;
  operatingModel: {
    baseCity: string;
    deliveryType: "Headquarters & Local Collaboration" | "Regional Corridor & On-Site Alignment" | "Remote Execution & Sprint Delivery";
    description: string;
  };
  marketContext: string[];
  industryNeeds: LocalIndustryNeed[];
  concreteDeliverables: string[];
  relevantProjects: string[]; // Slugs from data/projects.ts
  faqs: LocationFaq[];
  serviceLinks: Array<{ label: string; href: string }>;
}
