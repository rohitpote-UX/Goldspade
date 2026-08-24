import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = constructMetadata({
  title: "Start a Project with Goldspade",
  exactTitle: true,
  description:
    "Partner with Goldspade. Tell us about your company, digital product, or web platform inquiry. Response guaranteed within 24 hours.",
  canonicalUrl: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageSchema = generateWebPageSchema({
    title: "Start a Project with Goldspade",
    description:
      "Partner with Goldspade. Tell us about your company, digital product, or web platform inquiry.",
    url: "/contact",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      {children}
    </>
  );
}
