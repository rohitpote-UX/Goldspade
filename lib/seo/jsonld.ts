import { SITE_CONFIG, CANONICAL_SITE_URL, buildCanonicalUrl } from "./metadata";
import { Project } from "@/types/project";

/**
 * Creates a normalized Schema.org entity URI ID without duplicate slashes.
 */
function makeEntityId(pathOrUrl: string, fragment: string): string {
  const canonical = buildCanonicalUrl(pathOrUrl);
  const cleanFragment = fragment.replace(/^#/, "");
  return `${canonical}#${cleanFragment}`;
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": makeEntityId("/", "organization"),
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.alternateName,
    url: CANONICAL_SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${CANONICAL_SITE_URL}/logo.png`,
      caption: SITE_CONFIG.name,
      width: 512,
      height: 512,
    },
    image: `${CANONICAL_SITE_URL}/og-image.jpg`,
    description: SITE_CONFIG.description,
    slogan: SITE_CONFIG.tagline,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.telephone,
    founder: {
      "@type": "Person",
      name: "Rohit Pote",
      jobTitle: "Founder & Principal Architect",
      url: `${CANONICAL_SITE_URL}/about`,
    },
    sameAs: [
      SITE_CONFIG.socials.x,
      SITE_CONFIG.socials.instagram,
      SITE_CONFIG.socials.github,
    ],
    knowsAbout: [
      "Website Development",
      "Web Design & UX Architecture",
      "Custom Software Development",
      "Web Application Development",
      "Next.js & React Engineering",
      "Progressive Web Apps (PWAs)",
      "AI & Business Process Automation",
      "Technical SEO & Core Web Vitals Architecture",
      "E-Commerce & Digital Commerce Platforms",
      "Brand Strategy & Digital Design Systems",
    ],
    priceRange: "₹₹ - ₹₹₹₹",
    currenciesAccepted: "INR, USD, EUR",
    paymentAccepted: "Bank Transfer, UPI, Credit Card, Razorpay",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: "IN",
      postalCode: SITE_CONFIG.location.postalCode,
    },
    areaServed: [
      { "@type": "City", name: "Pune", "@id": "https://en.wikipedia.org/wiki/Pune" },
      { "@type": "City", name: "Satara", "@id": "https://en.wikipedia.org/wiki/Satara_(city)" },
      { "@type": "City", name: "Karad", "@id": "https://en.wikipedia.org/wiki/Karad" },
      { "@type": "City", name: "Sangli", "@id": "https://en.wikipedia.org/wiki/Sangli" },
      { "@type": "City", name: "Kolhapur", "@id": "https://en.wikipedia.org/wiki/Kolhapur" },
      { "@type": "City", name: "Belagavi", alternateName: "Belgaum", "@id": "https://en.wikipedia.org/wiki/Belgaum" },
      { "@type": "City", name: "Hubballi-Dharwad", alternateName: "Hubli", "@id": "https://en.wikipedia.org/wiki/Hubli%E2%80%93Dharwad" },
      { "@type": "AdministrativeArea", name: "Goa" },
      { "@type": "AdministrativeArea", name: "Konkan" },
      { "@type": "AdministrativeArea", name: "Maharashtra" },
      { "@type": "Country", name: "India" },
      { "@type": "AdministrativeArea", name: "Worldwide" },
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": makeEntityId("/", "website"),
    url: CANONICAL_SITE_URL,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.alternateName,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": makeEntityId("/", "organization"),
    },
    inLanguage: "en-IN",
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
      item: buildCanonicalUrl(item.url),
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
  const canonical = buildCanonicalUrl(url);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": makeEntityId(url, "webpage"),
    url: canonical,
    name: title,
    description,
    isPartOf: {
      "@id": makeEntityId("/", "website"),
    },
    about: {
      "@id": makeEntityId("/", "organization"),
    },
    inLanguage: "en-IN",
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
  }

  return schema;
}

export function generateFAQPageSchema(
  faqs: Array<{ question: string; fullAnswer?: string; answer?: string }>,
  canonicalUrl: string = "/"
) {
  return {
    "@type": "FAQPage",
    "@id": makeEntityId(canonicalUrl, "faq"),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.fullAnswer || faq.answer || "",
      },
    })),
  };
}

export function generateHomepageSchema(
  faqs: Array<{ question: string; fullAnswer?: string; answer?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": makeEntityId("/", "webpage"),
        url: CANONICAL_SITE_URL,
        name: "Goldspade — Website Development Company & Custom Web Applications",
        description:
          "Goldspade is an engineering-led digital studio in Pune, India. We design and build high-performance websites, custom web applications, SaaS platforms, and AI digital solutions for ambitious founders.",
        isPartOf: {
          "@id": makeEntityId("/", "website"),
        },
        about: {
          "@id": makeEntityId("/", "organization"),
        },
        inLanguage: "en-IN",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "#positioning",
            "#faq-what-does-goldspade-do-answer",
            "#faq-services-offered-answer",
          ],
        },
      },
      generateFAQPageSchema(faqs, "/"),
    ],
  };
}

export function generateCaseStudySchema(project: Project, canonicalUrl: string) {
  const fullUrl = buildCanonicalUrl(canonicalUrl);
  const fullImage = project.heroImage.startsWith("http")
    ? project.heroImage
    : `${CANONICAL_SITE_URL}${project.heroImage}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": makeEntityId(canonicalUrl, "creativework"),
        url: fullUrl,
        name: `${project.title} — ${project.category}`,
        headline: `${project.title}: ${project.positioning}`,
        description: project.description,
        image: fullImage,
        creator: {
          "@id": makeEntityId("/", "organization"),
        },
        publisher: {
          "@id": makeEntityId("/", "organization"),
        },
        genre: project.category,
        keywords: project.services.join(", "),
        dateCreated: project.year ? `${project.year}-01-01` : "2026-01-01",
        inLanguage: "en-IN",
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Work", url: "/work" },
        { name: project.title, url: `/work/${project.slug}` },
      ]),
    ],
  };
}

export function generateServicesCatalogSchema(
  services: Array<{ title: string; description: string; category: string }>
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": makeEntityId("/services", "service"),
        name: "Goldspade Digital Studio Services",
        serviceType: "Website Development, Custom Software & AI Services",
        provider: {
          "@id": makeEntityId("/", "organization"),
        },
        description:
          "Comprehensive digital capabilities for founders: bespoke web development, SaaS product engineering, brand strategy, AI integration, and technical SEO architecture.",
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "AdministrativeArea", name: "Maharashtra" },
          { "@type": "AdministrativeArea", name: "Worldwide" },
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
  const fullUrl = buildCanonicalUrl(canonicalUrl);

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Service",
      "@id": makeEntityId(canonicalUrl, "service"),
      url: fullUrl,
      name: `${service.title} — Goldspade`,
      serviceType: service.category,
      provider: {
        "@id": makeEntityId("/", "organization"),
      },
      description: service.description,
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "AdministrativeArea", name: "Maharashtra" },
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
      "@id": makeEntityId(canonicalUrl, "faq"),
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
  const fullUrl = buildCanonicalUrl(canonicalUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": makeEntityId(canonicalUrl, "article"),
        url: fullUrl,
        headline: article.title,
        description: article.description,
        image: `${CANONICAL_SITE_URL}/og-image.jpg`,
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
          url: `${CANONICAL_SITE_URL}/about`,
        },
        publisher: {
          "@type": "Organization",
          "@id": makeEntityId("/", "organization"),
          name: SITE_CONFIG.name,
          logo: {
            "@type": "ImageObject",
            url: `${CANONICAL_SITE_URL}/logo.png`,
          },
        },
        articleSection: article.category,
        inLanguage: "en-IN",
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Journal", url: "/journal" },
        { name: article.title, url: canonicalUrl },
      ]),
    ],
  };
}

export function generateLocationsHubSchema(
  locations: Array<{ name: string; slug: string; region: string }>
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": makeEntityId("/locations", "page"),
        url: buildCanonicalUrl("/locations"),
        name: "Regional Coverage & Locations — Goldspade Digital Studio",
        description:
          "Goldspade engineers websites, custom applications, and business software across Pune, Satara, Karad, Sangli, Kolhapur, Belgaum, Maharashtra, and India.",
        publisher: {
          "@id": makeEntityId("/", "organization"),
        },
        inLanguage: "en-IN",
        mainEntity: {
          "@type": "ItemList",
          name: "Goldspade Regional Service Locations",
          itemListElement: locations.map((loc, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: loc.name,
            url: buildCanonicalUrl(`/locations/${loc.slug}`),
          })),
        },
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Locations", url: "/locations" },
      ]),
    ],
  };
}

export function generateLocationDetailSchema(
  location: {
    name: string;
    displayName: string;
    region: string;
    state: string;
    h1: string;
    metaDescription: string;
    faqs?: Array<{ question: string; answer: string }>;
  },
  canonicalUrl: string
) {
  const fullUrl = buildCanonicalUrl(canonicalUrl);

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "ProfessionalService",
      "@id": makeEntityId(canonicalUrl, "service"),
      url: fullUrl,
      name: `Goldspade — ${location.h1}`,
      description: location.metaDescription,
      parentOrganization: {
        "@id": makeEntityId("/", "organization"),
      },
      telephone: SITE_CONFIG.telephone,
      email: SITE_CONFIG.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_CONFIG.location.city,
        addressRegion: SITE_CONFIG.location.state,
        addressCountry: "IN",
        postalCode: SITE_CONFIG.location.postalCode,
      },
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: location.displayName,
        },
        {
          "@type": "AdministrativeArea",
          name: location.region,
        },
        {
          "@type": "AdministrativeArea",
          name: location.state,
        },
      ],
      priceRange: "₹₹ - ₹₹₹₹",
      inLanguage: "en-IN",
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Locations", url: "/locations" },
      { name: location.name, url: canonicalUrl },
    ]),
  ];

  if (location.faqs && location.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": makeEntityId(canonicalUrl, "faq"),
      mainEntity: location.faqs.map((faq) => ({
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
