import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Goldspade",
  tagline: "Forged for Founders.",
  description:
    "Goldspade is a premium digital studio. We build brands, digital products, websites, and business systems for ambitious founders and businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://goldspade.com",
  ogImage: "/og-image.jpg",
  twitterHandle: "@goldspade_studio",
};

export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;

  return {
    title: metaTitle,
    description,
    keywords: [
      "Digital Studio",
      "Digital Product Design",
      "Web Design Studio",
      "Website Development",
      "UI UX Design",
      "Product Development",
      "Brand Strategy",
      "Digital Experience Design",
      "AI Automation",
      "Business Software Development",
      "Forged for Founders",
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl || SITE_CONFIG.url,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl || SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
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
  };
}
