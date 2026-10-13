export type ServiceCategorySlug =
  | "strategy-brand"
  | "websites-experience"
  | "applications-software"
  | "ai-automation"
  | "business-systems"
  | "infrastructure-growth";

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  name: string;
  code: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string; // "01" to "18"
  slug: string;
  title: string;
  category: string;
  categorySlug: ServiceCategorySlug;
  tagline: string;
  description: string;
  deliverables: string[];
  searchIntent: string;
  relatedProjects?: string[]; // Project slugs from PROJECTS
  hasDedicatedPage?: boolean;
  dedicatedSlug?: string;
  overview?: string;
  considerations?: string[];
  faqs?: ServiceFAQ[];
}
