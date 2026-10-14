import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Goldspade",
  alternateName: "Goldspade Studio",
  tagline: "Forged for Founders.",
  title: "Goldspade — Premium Digital Studio for Ambitious Founders",
  description:
    "Goldspade is a premium digital studio building brands, digital products, websites and digital experiences for ambitious founders and businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldspade.in",
  ogImage: "/og-image.jpg",
  twitterHandle: "@GoldspadeFF",
  email: "hello@goldspade.in",
  telephone: "+918390612060",
  location: {
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    region: "Western Maharashtra",
    postalCode: "411001",
  },
  socials: {
    x: "https://x.com/GoldspadeFF",
    instagram: "https://www.instagram.com/goldspade_/",
    github: "https://github.com/rohitpote-UX",
  },
};

export function constructMetadata({
  title,
  exactTitle = false,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  canonicalUrl,
  noIndex = false,
  type = "website",
}: {
  title?: string;
  exactTitle?: boolean;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  type?: "website" | "article";
} = {}): Metadata {
  const metaTitle = title
    ? exactTitle
      ? title
      : title.includes(SITE_CONFIG.name)
      ? title
      : `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.title;

  const canonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${SITE_CONFIG.url}${canonicalUrl.startsWith("/") ? canonicalUrl : `/${canonicalUrl}`}`
    : SITE_CONFIG.url;

  const ogImageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: metaTitle,
    description,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [ogImageUrl],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
    },
    category: "technology",
  };
}
