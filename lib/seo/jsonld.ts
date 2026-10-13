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

export function generateServicesCatalogSchema(services: Array<{ title: string; description: string; category: string }>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_CONFIG.url}/services/#service`,
        name: "Goldspade Digital Studio Services",
        serviceType: "Digital Strategy, Design, Engineering & AI Services",
        provider: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        description:
          "Comprehensive digital capabilities for founders: bespoke web development, SaaS product engineering, brand strategy, AI integration, and technical SEO architecture.",
        areaServed: [
          {
            "@type": "Country",
            name: "India",
          },
          {
            "@type": "AdministrativeArea",
            name: "Maharashtra",
          },
          {
            "@type": "AdministrativeArea",
            name: "Worldwide",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Goldspade Capabilities & Service Catalogue",
          itemListElement: services.map((service, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              category: service.category,
            },
            position: index + 1,
          })),
        },
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]),
    ],
  };
}

export function generateServiceDetailSchema(
  service: {
    title: string;
    category: string;
    description: string;
    faqs?: Array<{ question: string; answer: string }>;
  },
  canonicalUrl: string
) {
  const fullUrl = canonicalUrl.startsWith("http")
    ? canonicalUrl
    : `${SITE_CONFIG.url}${canonicalUrl}`;

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Service",
      "@id": `${fullUrl}/#service`,
      url: fullUrl,
      name: `${service.title} — Goldspade`,
      serviceType: service.category,
      provider: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
      description: service.description,
      areaServed: [
        {
          "@type": "Country",
          name: "India",
        },
        {
          "@type": "AdministrativeArea",
          name: "Maharashtra",
        },
      ],
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.title, url: canonicalUrl },
    ]),
  ];

  if (service.faqs && service.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${fullUrl}/#faq`,
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function generateArticleSchema(
  article: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author: { name: string; role: string };
    category: string;
  },
  canonicalUrl: string
) {
  const fullUrl = canonicalUrl.startsWith("http")
    ? canonicalUrl
    : `${SITE_CONFIG.url}${canonicalUrl}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${fullUrl}/#article`,
        url: fullUrl,
        headline: article.title,
        description: article.description,
        datePublished: `${article.publishedAt}T09:00:00+05:30`,
        dateModified: `${article.updatedAt || article.publishedAt}T09:00:00+05:30`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": fullUrl,
        },
        author: {
          "@type": "Person",
          name: article.author.name,
          jobTitle: article.author.role,
          url: `${SITE_CONFIG.url}/about`,
        },
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        articleSection: article.category,
        inLanguage: "en-US",
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Journal", url: "/journal" },
        { name: article.title, url: canonicalUrl },
      ]),
    ],
  };
}

