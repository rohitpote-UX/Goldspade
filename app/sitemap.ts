import { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { DEDICATED_SERVICES } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldspade.in";
  const currentDate = new Date().toISOString();

  const coreRoutes = [
    { route: "", priority: 1.0, changeFrequency: "weekly" as const },
    { route: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/capabilities", priority: 0.8, changeFrequency: "weekly" as const },
    { route: "/work", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/philosophy", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/journal", priority: 0.7, changeFrequency: "weekly" as const },
    { route: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { route: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency,
    priority,
  }));

  const serviceDetailRoutes = DEDICATED_SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.dedicatedSlug || service.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectRoutes = PROJECTS.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...serviceDetailRoutes, ...projectRoutes];
}
