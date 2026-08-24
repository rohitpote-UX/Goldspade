import { SITE_CONFIG } from "./metadata";
import { Project } from "@/types/project";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.alternateName,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.url}/logo.png`,
      caption: SITE_CONFIG.name,
    },
    image: `${SITE_CONFIG.url}/og-image.jpg`,
    description: SITE_CONFIG.description,
    slogan: SITE_CONFIG.tagline,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.telephone,
    sameAs: [
      SITE_CONFIG.socials.x,
      SITE_CONFIG.socials.instagram,
      SITE_CONFIG.socials.github,
    ],
    knowsAbout: [
      "Brand Strategy & Positioning",
      "Digital Product Design",
      "UI/UX Architecture",
      "Full-Stack Web Development",
      "Next.js & React Engineering",
      "AI & Process Automation",
      "Technical SEO & Performance Optimization",
      "Design Systems & Component Architecture",
    ],
    priceRange: "$$$$",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.alternateName,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: "en-US",
  };
}

export function generateGlobalSchemaGraph() {
  const org = generateOrganizationSchema();
  const site = generateWebsiteSchema();

  return {
    "@context": "https://schema.org",
    "@graph": [org, site],
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function generateWebPageSchema({
  title,
  description,
  url,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE_CONFIG.url}${url}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${fullUrl}/#webpage`,
    url: fullUrl,
    name: title,
    description,
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    about: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: "en-US",
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
  }

  return schema;
}

export function generateCaseStudySchema(project: Project, canonicalUrl: string) {
  const fullUrl = canonicalUrl.startsWith("http")
    ? canonicalUrl
    : `${SITE_CONFIG.url}${canonicalUrl}`;
  const fullImage = project.heroImage.startsWith("http")
    ? project.heroImage
    : `${SITE_CONFIG.url}${project.heroImage}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${fullUrl}/#creativework`,
        url: fullUrl,
        name: `${project.title} — ${project.category}`,
        headline: `${project.title}: ${project.positioning}`,
        description: project.description,
        image: fullImage,
        creator: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        genre: project.category,
        keywords: project.services.join(", "),
        dateCreated: project.year ? `${project.year}-01-01` : "2026-01-01",
        inLanguage: "en-US",
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Work", url: "/work" },
        { name: project.title, url: `/work/${project.slug}` },
      ]),
    ],
  };
}
