import { MetadataRoute } from "next";
import { CANONICAL_SITE_URL } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const privateDisallows = [
    "/admin",
    "/admin/",
    "/admin/*",
    "/api/",
    "/api/*",
    "/login",
    "/signup",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "cohere-ai",
        ],
        allow: "/",
        disallow: privateDisallows,
      },
    ],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
    host: CANONICAL_SITE_URL,
  };
}
