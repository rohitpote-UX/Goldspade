import { SITE_CONFIG } from "./metadata";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    slogan: SITE_CONFIG.tagline,
    knowsAbout: [
      "Brand Strategy",
      "Digital Product Design",
      "Web Design & Development",
      "UI/UX Architecture",
      "Software Systems",
      "AI & Automation Solutions",
    ],
    priceRange: "$$$$",
  };
}
