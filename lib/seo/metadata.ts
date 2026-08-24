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
    keywords: [
      "Digital Studio",
      "Digital Product Design",
      "Web Design Studio",
      "Website Development",
      "UI UX Design",
      "Brand Strategy",
      "Product Development",
      "Digital Experience Design",
      "Next.js Development",
      "AI Automation",
      "Business Software Development",
      "Forged for Founders",
    ],
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
      locale: "en_US",
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
    category: "technology",
  };
}
