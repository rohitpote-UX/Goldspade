export interface FAQItem {
  id: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  serviceHref?: string;
  serviceLabel?: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    id: "what-does-goldspade-do",
    question: "What does Goldspade do?",
    shortAnswer:
      "Goldspade is an engineering-led digital studio that builds bespoke websites, scalable web applications, modern brand identities, and AI-driven automation for ambitious founders.",
    fullAnswer:
      "Goldspade is an engineering-led digital studio that builds bespoke websites, scalable web applications, modern brand identities, and AI-driven automation for ambitious founders. We combine Awwwards-caliber aesthetics with robust software engineering, taking digital products from strategic positioning to full production deployment.",
    serviceHref: "/services/custom-software-development",
    serviceLabel: "Explore Software Engineering",
  },
  {
    id: "services-offered",
    question: "What services does Goldspade offer?",
    shortAnswer:
      "Goldspade offers four core practices: Brand Strategy & Identity, UI/UX Product Design, Full-Stack Web Development, and Custom Software Engineering with AI Automation.",
    fullAnswer:
      "Goldspade offers four core practices: Brand Strategy & Identity, UI/UX Product Design, Full-Stack Web Development, and Custom Software Engineering with AI Automation. Each discipline is delivered in structured, high-velocity sprints designed to eliminate agency bloat and maximize commercial impact.",
    serviceHref: "/services",
    serviceLabel: "View All Practices",
  },
  {
    id: "pune-digital-studio",
    question: "Is Goldspade a digital studio based in Pune?",
    shortAnswer:
      "Yes, Goldspade is headquartered in Pune, Maharashtra. We partner with founders across Pune while serving ventures throughout Maharashtra, Goa, Karnataka, and nationwide.",
    fullAnswer:
      "Yes, Goldspade is headquartered in Pune, Maharashtra. We partner with founders across Pune while serving ventures throughout Maharashtra, Goa, Karnataka, and nationwide through seamless remote execution, shared staging environments, and weekly transparent sprint alignments.",
    serviceHref: "/locations/pune",
    serviceLabel: "View Pune Studio Scope",
  },
  {
    id: "custom-websites-and-applications",
    question: "Does Goldspade build custom websites and web applications?",
    shortAnswer:
      "Yes, we build 100% custom websites and software applications tailored to each client's specific business workflows, performance targets, and brand positioning.",
    fullAnswer:
      "Yes, we build 100% custom websites and software applications tailored to each client's specific business workflows, performance targets, and brand positioning. We engineer clean React and Next.js architectures from scratch without restrictive WordPress templates, ensuring sub-second load times and unmatched conversion capability.",
    serviceHref: "/services/custom-software-development",
    serviceLabel: "Custom Engineering Overview",
  },
  {
    id: "website-development-cost-india",
    question: "How much does website and web app development cost in India?",
    shortAnswer:
      "Custom commercial websites typically range from ₹50,000 to ₹1,50,000, while complex web applications, customer portals, and enterprise platforms range from ₹1,50,000 to ₹5,00,000+.",
    fullAnswer:
      "Custom commercial websites typically range from ₹50,000 to ₹1,50,000, while complex web applications, customer portals, and enterprise platforms range from ₹1,50,000 to ₹5,00,000+. Pricing is based entirely on scope, design customization, API complexity, and security requirements, with clear, fixed milestone deliverables and zero hidden costs.",
    serviceHref: "/contact",
    serviceLabel: "Request Transparent Scope & Quote",
  },
  {
    id: "project-delivery-timeline",
    question: "How long does a website or web application take to build?",
    shortAnswer:
      "A high-performance commercial website takes 3 to 6 weeks, while a custom web application or software platform typically takes 6 to 12 weeks across structured sprints.",
    fullAnswer:
      "A high-performance commercial website takes 3 to 6 weeks, while a custom web application or software platform typically takes 6 to 12 weeks across structured sprints. Every engagement follows a disciplined timeline: Phase 1 Strategic Discovery, Phase 2 Bespoke UI/UX Design, Phase 3 Production Engineering, and Phase 4 Staging Validation & Launch.",
    serviceHref: "/philosophy",
    serviceLabel: "Review Sprint Architecture",
  },
  {
    id: "working-outside-pune",
    question: "Can Goldspade work with businesses outside Pune?",
    shortAnswer:
      "Yes, we regularly engineer digital solutions for businesses across Karad, Satara, Kolhapur, Sangli, Goa, Belagavi, Hubballi-Dharwad, Mumbai, Bangalore, and across India.",
    fullAnswer:
      "Yes, we regularly engineer digital solutions for businesses across Karad, Satara, Kolhapur, Sangli, Goa, Belagavi, Hubballi-Dharwad, Mumbai, Bangalore, and across India. Our asynchronous workflow, recorded demo walkthroughs, and real-time project dashboards provide founders complete visibility regardless of geographic location.",
    serviceHref: "/locations",
    serviceLabel: "View Regional Coverage",
  },
  {
    id: "how-to-start-a-project",
    question: "How can a founder or business start a project with Goldspade?",
    shortAnswer:
      "You can start by submitting our online inquiry form with your project overview, timeline, and goals. We respond with technical scoping feedback within 24 business hours.",
    fullAnswer:
      "You can start by submitting our online inquiry form with your project overview, timeline, and goals. We respond with technical scoping feedback within 24 business hours, followed by a collaborative 30-minute discovery session to map architecture, timelines, and transparent fixed deliverables.",
    serviceHref: "/contact",
    serviceLabel: "Start an Inquiry",
  },
];

export interface StudioComparisonRow {
  dimension: string;
  freelancer: string;
  goldspade: string;
  agency: string;
}

export const STUDIO_COMPARISON_MATRIX: StudioComparisonRow[] = [
  {
    dimension: "Project Fit",
    freelancer: "Basic landing pages, isolated bug fixes, or minor cosmetic updates.",
    goldspade: "Ambitious founder ventures, custom web apps, and commercial brands demanding senior craft.",
    agency: "Massive corporate enterprises, legacy retainers, and multi-department ad campaigns.",
  },
  {
    dimension: "Direct Senior Access",
    freelancer: "Direct conversation with the sole operator; constrained by individual availability.",
    goldspade: "Direct daily access to founding designers and principal engineers. Zero account manager friction.",
    agency: "Layers of account handlers, coordinators, and junior developers buffering key decisions.",
  },
  {
    dimension: "Engineering & Speed",
    freelancer: "Variable code quality, ad-hoc testing, and template-heavy implementations.",
    goldspade: "Production-grade Next.js/TypeScript architecture, sub-second CWV, and 2-week sprints.",
    agency: "Slow procurement, bureaucratic approval cycles, and 4 to 6 month delivery timelines.",
  },
  {
    dimension: "IP & Code Ownership",
    freelancer: "Full ownership upon payment, though documentation is often sparse.",
    goldspade: "100% intellectual property ownership, clean Git repos, and architectural documentation.",
    agency: "Often restricted by proprietary CMS platforms, licensing fees, or restrictive retainers.",
  },
  {
    dimension: "Investment Structure",
    freelancer: "Lower hourly rates; can become unpredictable as project scope expands.",
    goldspade: "Transparent, fixed sprint milestones with zero agency overhead or hidden line items.",
    agency: "Large five-figure monthly retainers with substantial agency overhead markups.",
  },
];

export interface TechnicalDefinition {
  term: string;
  definition: string;
}

export const TECHNICAL_DEFINITIONS: TechnicalDefinition[] = [
  {
    term: "Next.js App Router Architecture",
    definition:
      "A modern React server-component framework providing automatic code-splitting, streaming SSR, and edge caching for sub-second page performance.",
  },
  {
    term: "Progressive Web Application (PWA)",
    definition:
      "A web application built using modern web capabilities to deliver native app-like reliability, offline caching, and instant interaction on mobile and desktop.",
  },
  {
    term: "Answer Engine Optimization (AEO)",
    definition:
      "The engineering practice of structuring digital content and JSON-LD schema into direct, factual answers easily parsed and cited by search and AI answer engines.",
  },
  {
    term: "Bespoke Digital Product Engineering",
    definition:
      "Software development crafted from first principles without pre-packaged templates, engineered specifically for unique commercial workflows and high-conversion UX.",
  },
];
