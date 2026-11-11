import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      // Prevent search engine indexing of private API routes and internal admin endpoints
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      // Aggressive caching for static media assets
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Enforce WWW to non-WWW canonical redirection
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.goldspade.in",
          },
        ],
        destination: "https://goldspade.in/:path*",
        permanent: true,
      },
      // Capabilities legacy path consolidation
      {
        source: "/capabilities",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/capabilities/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
      // Service slug standardisation
      {
        source: "/services/website-development",
        destination: "/services/website-design-development",
        permanent: true,
      },
      {
        source: "/services/technical-seo",
        destination: "/services/technical-seo-performance",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
