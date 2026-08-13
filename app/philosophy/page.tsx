import { constructMetadata } from "@/lib/seo/metadata";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { TrustSection } from "@/components/sections/TrustSection";

export const metadata = constructMetadata({
  title: "Philosophy",
  description: "Ideas are everywhere. Execution is rare. Learn how Goldspade approaches design and digital engineering.",
});

export default function PhilosophyPage() {
  return (
    <div className="pt-20 bg-canvas text-primary-dark min-h-screen">
      <PhilosophySection />
      <TrustSection />
    </div>
  );
}
