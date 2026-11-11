import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = constructMetadata({
  title: "Contact Goldspade — Start a Project Inquiry | Pune & Nationwide",
  exactTitle: true,
  description:
    "Start a project with Goldspade. Share your website development, web application, or custom software requirements for a technical scoping reply within 24 hours.",
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
