import { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { DEDICATED_SERVICES } from "@/data/services";
import { JOURNAL_ARTICLES } from "@/data/journal";
import { REGIONAL_LOCATIONS } from "@/data/locations";
import { buildCanonicalUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  // Foundational baseline date for core pages
  const coreLastModified = new Date("2026-04-12T00:00:00.000Z");

  const coreRoutes = [
    { route: "", priority: 1.0, changeFrequency: "weekly" as const },
    { route: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/locations", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/work", priority: 0.85, changeFrequency: "weekly" as const },
    { route: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/philosophy", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/contact", priority: 0.85, changeFrequency: "monthly" as const },
    { route: "/journal", priority: 0.85, changeFrequency: "weekly" as const },
    { route: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { route: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: buildCanonicalUrl(route),
    lastModified: coreLastModified,
    changeFrequency,
    priority,
  }));

  const serviceDetailRoutes = DEDICATED_SERVICES.map((service) => ({
    url: buildCanonicalUrl(`/services/${service.dedicatedSlug || service.slug}`),
    lastModified: coreLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const locationRoutes = REGIONAL_LOCATIONS.map((location) => ({
    url: buildCanonicalUrl(`/locations/${location.slug}`),
    lastModified: coreLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const projectRoutes = PROJECTS.map((project) => ({
    url: buildCanonicalUrl(`/work/${project.slug}`),
    lastModified: new Date(`${project.year || "2026"}-01-15T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const journalRoutes = JOURNAL_ARTICLES.map((article) => ({
    url: buildCanonicalUrl(`/journal/${article.slug}`),
    lastModified: new Date(`${article.updatedAt || article.publishedAt}T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...coreRoutes,
    ...serviceDetailRoutes,
    ...locationRoutes,
    ...projectRoutes,
    ...journalRoutes,
  ];
}
