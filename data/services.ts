import { ServiceCategory, ServiceItem } from "@/types/service";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "strategy-brand",
    name: "Strategy & Brand",
    code: "A",
    description: "Clarify market positioning, brand differentiation, and cohesive digital identity systems.",
  },
  {
    slug: "websites-experience",
    name: "Websites & Experience",
    code: "B",
    description: "Bespoke digital flagships, editorial websites, and product UX engineered for high conversion.",
  },
  {
    slug: "applications-software",
    name: "Applications & Software",
    code: "C",
    description: "Custom web applications, SaaS platforms, and mobile-ready PWAs engineered around real workflows.",
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    code: "D",
    description: "Practical AI integrations, official communication APIs, and intelligent workflow automation.",
  },
  {
    slug: "business-systems",
    name: "Business Systems",
    code: "E",
    description: "Operational tools, billing systems, inventory tracking, and secure payment workflows.",
  },
  {
    slug: "infrastructure-growth",
    name: "Infrastructure & Growth",
    code: "F",
    description: "Cloud deployment, technical SEO architecture, speed optimization, and ongoing engineering support.",
  },
];

export const SERVICES: ServiceItem[] = [
  // Category A — Brand & Digital Strategy
  {
    id: "01",
    slug: "brand-strategy-positioning",
    title: "Brand Strategy & Positioning",
    category: "Brand & Digital Strategy",
    categorySlug: "strategy-brand",
    tagline: "Market differentiation & audience alignment",
    description:
      "We help founders articulate their core value proposition, define competitive differentiation, and establish a digital brand strategy that commands enterprise authority.",
    deliverables: [
      "Brand Positioning & Differentiation",
      "Audience & Competitor Intelligence",
      "Value Proposition Architecture",
      "Strategic Messaging Direction",
      "Digital Brand Strategy",
      "Brand Architecture Framework",
    ],
    searchIntent: "brand strategy services, brand positioning, digital brand strategy",
    relatedProjects: ["brandbattle", "gitapath"],
  },
  {
    id: "02",
    slug: "visual-identity-digital-branding",
    title: "Visual Identity & Digital Branding",
    category: "Brand & Digital Strategy",
    categorySlug: "strategy-brand",
    tagline: "Typographic systems & digital design languages",
    description:
      "Crafting cohesive visual identity systems, bespoke typography standards, and digital brand guidelines that translate seamlessly into interactive web and product interfaces.",
    deliverables: [
      "Visual Identity System & Mark",
      "Typography & Color Hierarchies",
      "Digital Brand Guidelines & Standards",
      "Website Art Direction",
      "Design System Foundations",
      "Cross-Platform Consistency Rules",
    ],
    searchIntent: "digital branding services, visual identity design, brand identity for businesses",
    relatedProjects: ["mamacha-mala", "gitapath"],
  },

  // Category B — Websites & Digital Experiences
  {
    id: "03",
    slug: "website-design-development",
    title: "Premium Website Design & Development",
    category: "Websites & Digital Experiences",
    categorySlug: "websites-experience",
    tagline: "Bespoke digital flagships engineered for speed & credibility",
    description:
      "We design and build bespoke business flagships and editorial websites using Next.js, React, and TypeScript—engineered with precision, speed, and compelling conversion architecture.",
    deliverables: [
      "Bespoke Corporate & Founder Websites",
      "Editorial Marketing Platforms & Landing Pages",
      "High-Performance Next.js App Router Engineering",
      "Tailored Content & Layout Architecture",
      "Subtle Micro-Interactions & Restrained Motion",
      "Mobile-First Responsive Composition",
    ],
    searchIntent: "website design and development, business website development, custom website development",
    relatedProjects: ["hotel-atithi-karad", "mamacha-mala", "mayuri-developer"],
    hasDedicatedPage: true,
    dedicatedSlug: "website-design-development",
    overview:
      "Your website is the single most critical touchpoint where founders prove credibility to investors, enterprise clients, and prospective buyers. Goldspade builds custom digital flagships engineered with Next.js, clean semantic code, and typography-first editorial layouts. We reject off-the-shelf templates and heavy page-builders in favor of bespoke frontend engineering that loads instantaneously and communicates undeniable authority.",
    considerations: [
      "High-speed server-rendered architecture (Next.js App Router)",
      "Zero layout shifts and strict Core Web Vitals optimization",
      "Accessible typography, high contrast, and responsive viewports",
      "Semantic HTML5 structuring for indexation by modern search engines",
      "Direct integration with inquiry capture and analytics workflows",
    ],
    faqs: [
      {
        question: "How long does a bespoke website design and development engagement take?",
        answer:
          "Most studio website engagements range between 2 to 4 weeks depending on content complexity, custom interaction specifications, and CMS integration requirements. We operate in concentrated sprints to ensure rapid launch velocity without compromising engineering standards.",
      },
      {
        question: "Do you use WordPress, Webflow, or custom code?",
        answer:
          "We engineer custom digital solutions using Next.js, React, TypeScript, and Tailwind CSS. This guarantees near-instant load speeds, complete design freedom, enterprise-grade security, and eliminates the vulnerabilities, maintenance overhead, and plugin bloat of traditional CMS platforms.",
      },
      {
        question: "Will our website be optimized for mobile screens and search engines?",
        answer:
          "Yes. Every build is developed mobile-first and tested across actual device viewports. We implement technical SEO best practices out of the box, including semantic headings, Open Graph protocols, canonical URLs, XML sitemaps, and Schema.org structured data.",
      },
    ],
  },
  {
    id: "04",
    slug: "ecommerce-development",
    title: "E-commerce Website Development",
    category: "Websites & Digital Experiences",
    categorySlug: "websites-experience",
    tagline: "High-conversion product catalogues & frictionless checkout flows",
    description:
      "Designing and developing modern online storefronts centered around seamless product discovery, intuitive navigation, fast checkouts, and resilient payment gateway integration.",
    deliverables: [
      "Custom Product Catalogues & Category Filtration",
      "High-Conversion Cart & Checkout Experiences",
      "Indian & Global Payment Gateway Integration (Razorpay, UPI, Stripe)",
      "Inventory & Order Management Workflows",
      "Customer Account & Order Tracking Portals",
      "E-commerce Technical SEO & Schema.org Product Data",
    ],
    searchIntent: "e-commerce website development, online store development, custom e-commerce solutions",
    relatedProjects: ["ezdukkan"],
    hasDedicatedPage: true,
    dedicatedSlug: "ecommerce-development",
    overview:
      "In modern e-commerce, every second of checkout friction or slow page latency directly erodes conversion rates. Goldspade engineers custom online storefronts and shopping experiences structured around clean product presentation, instant client-side filtering, and frictionless mobile checkouts with verified payment integrations.",
    considerations: [
      "Sub-second catalog browsing and instant search filtering",
      "Safe and certified payment gateways supporting UPI, cards, and net banking",
      "Automated order confirmation triggers and customer notifications",
      "Mobile-optimized checkout designed for single-hand mobile interaction",
      "Structured product data schema for Google Shopping and organic search discovery",
    ],
    faqs: [
      {
        question: "Which payment gateways can be integrated into our store?",
        answer:
          "We integrate certified and compliant payment processors suited to your business jurisdiction, including Razorpay, Cashfree, PayU, and Stripe, supporting UPI, credit/debit cards, net banking, and EMI options.",
      },
      {
        question: "Can our e-commerce store handle large inventories?",
        answer:
          "Yes. Our headless and full-stack architectures decouple product indexing from frontend rendering, allowing catalogues with thousands of SKUs to load effortlessly with instant category filtering and search.",
      },
    ],
  },
  {
    id: "05",
    slug: "ui-ux-design-product-experience",
    title: "UI/UX Design & Product Experience",
    category: "Websites & Digital Experiences",
    categorySlug: "websites-experience",
    tagline: "User-centered interaction architecture & design systems",
    description:
      "Transforming complex functional workflows into clear, frictionless user journeys, wireframes, and production-ready design systems that delight users and accelerate adoption.",
    deliverables: [
      "User Research & Journey Mapping",
      "Information Architecture & Flow Diagrams",
      "High-Fidelity Wireframes & Clickable Prototypes",
      "Component Design Systems & Tokens",
      "Usability Testing & Accessibility Reviews",
      "Developer Handoff Specifications",
    ],
    searchIntent: "UI/UX design services, product design, user experience design",
    relatedProjects: ["brandbattle", "nityasadhana"],
  },

  // Category C — Applications & Software Products
  {
    id: "06",
    slug: "custom-software-web-applications",
    title: "Custom Web Applications & SaaS",
    category: "Applications & Software Products",
    categorySlug: "applications-software",
    tagline: "Bespoke SaaS architectures & interactive web software",
    description:
      "Architecting scalable web software, client portals, internal dashboards, and SaaS applications tailored precisely to your operational requirements and product roadmap.",
    deliverables: [
      "Customer & Client Portal Development",
      "Admin Control Panels & Operational Dashboards",
      "SaaS Multi-Tenant Architecture & Auth (JWT/OAuth)",
      "Role-Based Access Control (RBAC)",
      "Real-Time Data Visualization & Analytics",
      "Modular Full-Stack TypeScript Architecture",
    ],
    searchIntent: "custom web application development, SaaS development, web application development company",
    relatedProjects: ["brandbattle", "nityasadhana", "ezdukkan"],
    hasDedicatedPage: true,
    dedicatedSlug: "custom-software-web-applications",
    overview:
      "Off-the-shelf software inevitably forces growing businesses into awkward workarounds. Goldspade builds custom web applications and SaaS platforms engineered around how your company actually operates. From multi-tiered customer portals to high-concurrency SaaS interfaces, we deliver clean TypeScript codebases designed for longevity, auditability, and effortless future expansion.",
    considerations: [
      "Strict type safety and end-to-end TypeScript validation",
      "Role-based permission boundaries and secure authentication",
      "High-performance database indexing and query optimization",
      "Modular component hierarchy allowing your internal team to iterate rapidly",
      "Clear API documentation and integration endpoints",
    ],
    faqs: [
      {
        question: "How do you ensure data security in custom web applications?",
        answer:
          "We enforce industry best practices including secure session management, salted password hashing, parameterised database queries to prevent SQL injection, strict CORS policies, and environment isolation between development, staging, and production.",
      },
      {
        question: "Do we retain full ownership of the source code?",
        answer:
          "Yes. Upon completion and milestone settlement, you retain 100% intellectual property rights and full source code ownership in your private Git repository.",
      },
    ],
  },
  {
    id: "07",
    slug: "mobile-app-development",
    title: "Mobile Application Development",
    category: "Applications & Software Products",
    categorySlug: "applications-software",
    tagline: "Installable Progressive Web Apps & cross-platform mobile solutions",
    description:
      "Developing mobile-optimized digital solutions, installable Progressive Web Apps (PWAs), and cross-platform mobile experiences that operate smoothly on smartphones and tablets.",
    deliverables: [
      "Installable Progressive Web App (PWA) Architecture",
      "Offline-First Data Storage & Caching",
      "Touch-Optimized Mobile UI/UX",
      "Cross-Platform Mobile Application Development",
      "Mobile Push Notifications & Background Sync",
      "Device Optimization & Smooth Viewport Responsiveness",
    ],
    searchIntent: "mobile app development, custom mobile applications, cross-platform app development",
    relatedProjects: ["saanjgarva", "jar", "nityasadhana"],
  },
  {
    id: "08",
    slug: "custom-software-development",
    title: "Custom Software Development",
    category: "Applications & Software Products",
    categorySlug: "applications-software",
    tagline: "Bespoke digital tools engineered for specific operational realities",
    description:
      "Engineering bespoke business software that eliminates spreadsheets and fragmented manual tools—giving founders transparent visibility and full control over operations.",
    deliverables: [
      "Internal Business Tools & Workflow Engines",
      "Structured Data Entry & Review Consoles",
      "Custom Reporting & Productivity Tools",
      "Legacy Process Modernization",
      "Third-Party System Bridges & Sync",
      "Maintainable Architectural Documentation",
    ],
    searchIntent: "custom software development, business software solutions, bespoke software development",
    relatedProjects: ["saanjgarva", "ezdukkan", "jar"],
  },

  // Category D — AI, Automation & Integrations
  {
    id: "09",
    slug: "ai-integration-automation",
    title: "AI Integration & Intelligent Workflows",
    category: "AI, Automation & Integrations",
    categorySlug: "ai-automation",
    tagline: "Practical artificial intelligence embedded into real digital products",
    description:
      "We help founders implement practical AI capabilities into existing workflows—including intelligent search, natural language assistants, document parsing, and automated analysis.",
    deliverables: [
      "Custom AI Assistant & Copilot Interfaces",
      "Natural Language Query & Semantic Search",
      "Automated Document Processing & Extraction",
      "LLM API Integrations (OpenAI, Anthropic, Gemini)",
      "Human-in-the-Loop Review Interfaces",
      "AI Proof-of-Concept & Production Deployment",
    ],
    searchIntent: "AI integration services, AI-powered business solutions, custom AI software development",
    relatedProjects: ["brandbattle", "face-attendance-system"],
    hasDedicatedPage: true,
    dedicatedSlug: "ai-integration-automation",
    overview:
      "Artificial intelligence creates real commercial value when applied to concrete operational bottlenecks rather than speculative hype. Goldspade integrates pragmatic AI capabilities directly into software products—enabling founders to automate repetitive document parsing, embed natural language search across proprietary catalogs, and build human-supervised intelligence into core platforms.",
    considerations: [
      "Deterministic fallback mechanisms for mission-critical paths",
      "Cost-efficient token budgeting, response streaming, and smart caching",
      "Strict data privacy controls ensuring sensitive company data remains secure",
      "Low-latency response times with optimistic client-side UI states",
    ],
    faqs: [
      {
        question: "Do you train proprietary foundation models or use existing APIs?",
        answer:
          "We focus on engineering practical applications using state-of-the-art foundation APIs (such as OpenAI, Anthropic, and Google Gemini), customized with Retrieval-Augmented Generation (RAG), fine-tuning, and structured prompt pipelines to deliver reliable business outcomes without the astronomical cost of training models from scratch.",
      },
      {
        question: "Can AI be integrated into our existing web application?",
        answer:
          "Yes. We design decoupled micro-services and API endpoints that integrate seamlessly with your current database, web frontend, and customer workflows.",
      },
    ],
  },
  {
    id: "10",
    slug: "business-process-automation",
    title: "Business Process Automation",
    category: "AI, Automation & Integrations",
    categorySlug: "ai-automation",
    tagline: "Eliminating manual bottlenecks through software orchestration",
    description:
      "Automating repetitive administrative tasks, inquiry routing, data synchronization, and reporting so your core team can focus on strategic execution and growth.",
    deliverables: [
      "Repetitive Task & Form Automation",
      "Multi-System Data Synchronization Pipelines",
      "Automated Notification & Reminder Systems",
      "Approval & Verification Routing",
      "Scheduled Batch Processing & Reporting",
      "Error Handling & Exception Alerts",
    ],
    searchIntent: "business process automation, workflow automation services, business automation solutions",
    relatedProjects: ["jar", "saanjgarva"],
  },
  {
    id: "11",
    slug: "whatsapp-communication-integrations",
    title: "WhatsApp & Communication Integrations",
    category: "AI, Automation & Integrations",
    categorySlug: "ai-automation",
    tagline: "Connecting verified customer messaging to operational workflows",
    description:
      "Connecting customer messaging to business systems via official WhatsApp Business Platform integrations, transactional updates, lead notifications, and routing.",
    deliverables: [
      "Official WhatsApp Business Platform Integrations",
      "Transactional Order & Booking Confirmations",
      "Automated Customer Inquiry Routing",
      "Verified Template Messaging Setup",
      "CRM & Internal Notification Webhooks",
      "Compliance with Provider Policies & Guidelines",
    ],
    searchIntent: "WhatsApp Business integration, WhatsApp automation, customer communication automation",
    relatedProjects: ["hotel-atithi-karad", "mamacha-mala"],
  },
  {
    id: "12",
    slug: "api-development-system-integration",
    title: "API Development & System Integration",
    category: "AI, Automation & Integrations",
    categorySlug: "ai-automation",
    tagline: "Robust REST interfaces & secure third-party connectors",
    description:
      "Building resilient, well-documented REST APIs and webhook connectors that bridge disparate applications, synchronize databases, and enable unified operational data.",
    deliverables: [
      "Custom RESTful API Architecture & Endpoints",
      "Third-Party Service & SaaS API Integration",
      "Real-Time Webhook Receivers & Dispatchers",
      "Data Transformation & Synchronization Layers",
      "API Key & OAuth Authentication Protocols",
      "Comprehensive OpenAPI Documentation",
    ],
    searchIntent: "API development services, third-party API integration, custom API development",
    relatedProjects: ["brandbattle", "ezdukkan"],
  },

  // Category E — Business Systems & Digital Operations
  {
    id: "13",
    slug: "crm-customer-management-systems",
    title: "CRM & Customer Management Systems",
    category: "Business Systems & Digital Operations",
    categorySlug: "business-systems",
    tagline: "Centralized lead pipelines, customer logs & team visibility",
    description:
      "Developing structured customer relationship management systems and client desks that consolidate customer history, track communication, and eliminate lost leads.",
    deliverables: [
      "Lead Capture & Pipeline Management",
      "Customer Contact Profiles & Interaction History",
      "Team Activity Tracking & Follow-Up Reminders",
      "Role-Based Access & Territory Controls",
      "Custom Sales & Conversion Dashboards",
      "Third-Party CRM Data Synchronization",
    ],
    searchIntent: "CRM development, customer management software, custom CRM solutions",
    relatedProjects: ["ezdukkan"],
  },
  {
    id: "14",
    slug: "erp-inventory-operations-software",
    title: "ERP, Inventory & Operations Software",
    category: "Business Systems & Digital Operations",
    categorySlug: "business-systems",
    tagline: "Real-time stock tracking, billing workflows & logistics control",
    description:
      "Building targeted operational software for businesses that need real-time stock visibility, supplier tracking, credit (udhari) records, and automated dispatch management.",
    deliverables: [
      "Real-Time Stock & Inventory Tracking",
      "Order Processing & Dispatch Workflow",
      "Billing, Quotations & Invoice Generation",
      "Customer & Supplier Account Ledgers",
      "Daily Sales & Profitability Summaries",
      "Offline-Capable Multi-Device Support",
    ],
    searchIntent: "ERP software development, inventory management software, business operations software",
    relatedProjects: ["saanjgarva", "jar"],
  },
  {
    id: "15",
    slug: "payments-transaction-workflows",
    title: "Payments & Transaction Workflows",
    category: "Business Systems & Digital Operations",
    categorySlug: "business-systems",
    tagline: "Frictionless online transactions & secure checkout gateways",
    description:
      "Integrating certified payment gateways, UPI workflows, recurring billing schedules, and automated webhook verification to ensure secure transactions with zero leaks.",
    deliverables: [
      "Payment Gateway Integration (Razorpay, Stripe, UPI)",
      "Secure Server-Side Transaction Verification",
      "Automated Webhook Status Processing",
      "Digital Invoicing & GST-Compliant Receipts",
      "Failure Handling, Retries & Refund Flows",
      "Reconciliation Reports & Ledger Export",
    ],
    searchIntent: "payment gateway integration, online payment integration, checkout development",
    relatedProjects: ["ezdukkan", "brandbattle"],
  },

  // Category F — Infrastructure, Performance & Growth
  {
    id: "16",
    slug: "cloud-deployment-infrastructure",
    title: "Cloud Deployment & Application Infrastructure",
    category: "Infrastructure, Performance & Growth",
    categorySlug: "infrastructure-growth",
    tagline: "Production hosting, CI/CD pipelines & resilient deployment",
    description:
      "Setting up dependable production environments, zero-downtime CI/CD deployment pipelines, environment isolation, and SSL security on modern cloud platforms.",
    deliverables: [
      "Production Cloud Hosting Configuration (Vercel, AWS, Cloudflare)",
      "Automated Git CI/CD Build Pipelines",
      "Environment Separation (Development / Staging / Production)",
      "Domain DNS Coordination, SSL & DDoS Mitigation",
      "Application Logging & Error Monitoring",
      "Backup Planning & Disaster Recovery Review",
    ],
    searchIntent: "cloud deployment services, application deployment, cloud infrastructure consulting",
    relatedProjects: ["brandbattle", "saanjgarva"],
  },
  {
    id: "17",
    slug: "technical-seo-performance",
    title: "Technical SEO & Website Performance",
    category: "Infrastructure, Performance & Growth",
    categorySlug: "infrastructure-growth",
    tagline: "Core Web Vitals optimization, semantic architecture & crawlability",
    description:
      "Optimizing underlying website foundations for maximum search crawlability, sub-second load times, structured data rich snippets, and organic indexation.",
    deliverables: [
      "Core Web Vitals Assessment & Speed Optimization",
      "Semantic HTML5 & Document Outline Structuring",
      "Schema.org JSON-LD Structured Data Implementation",
      "Dynamic XML Sitemap & Robots.txt Architecture",
      "Open Graph & Twitter Card Social Metadata",
      "Indexability Audits & Broken Link Remediation",
    ],
    searchIntent: "technical SEO services, website performance optimization, SEO-friendly website development",
    relatedProjects: ["hotel-atithi-karad", "brandbattle"],
    hasDedicatedPage: true,
    dedicatedSlug: "technical-seo-performance",
    overview:
      "Search visibility is fundamentally an engineering discipline. Even extraordinary design fails to generate business value if search engine crawlers struggle to parse content, or if excessive JavaScript slows down page rendering. Goldspade provides comprehensive technical SEO architecture—ensuring your web properties achieve optimal Core Web Vitals, pristine semantic hierarchies, valid Schema.org graph markup, and effortless discoverability by both traditional search engines and AI answer engines.",
    considerations: [
      "Lighthouse 95+ performance metrics across desktop and mobile",
      "Complete structured data (Organization, BreadcrumbList, Service, CreativeWork)",
      "Zero cumulative layout shift (CLS) through fixed aspect ratios and next/image",
      "Clean canonical URL strategies preventing duplicate content indexing",
      "Localized geographic discoverability for businesses across Maharashtra and India",
    ],
    faqs: [
      {
        question: "Do you guarantee first-page ranking on Google?",
        answer:
          "No ethical agency or engineer can promise fixed first-page rankings, as search algorithm rankings depend on organic competition, domain age, and editorial depth. What we guarantee is a technically flawless foundation: lightning-fast load times, semantic HTML, valid structured data, and complete crawlability that eliminates every technical barrier to ranking.",
      },
      {
        question: "How do Core Web Vitals affect search performance?",
        answer:
          "Google explicitly utilizes page experience signals—Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS)—as ranking factors. Fast, stable pages rank higher, reduce bounce rates, and convert a significantly higher percentage of visitors into qualified project inquiries.",
      },
    ],
  },
  {
    id: "18",
    slug: "product-improvement-maintenance",
    title: "Ongoing Product Improvement & Maintenance",
    category: "Infrastructure, Performance & Growth",
    categorySlug: "infrastructure-growth",
    tagline: "Dedicated engineering iterations, security updates & feature sprints",
    description:
      "Providing structured post-launch technical support, dependency updates, browser compatibility patches, and iterative feature development for growing digital products.",
    deliverables: [
      "Scheduled Framework & Dependency Security Updates",
      "Proactive Bug Resolution & Error Log Monitoring",
      "UI Refinements & User Experience Iterations",
      "Cross-Device & Browser Compatibility Audits",
      "Performance Audits & Database Housekeeping",
      "Roadmap Consultation & Strategic Feature Sprints",
    ],
    searchIntent: "website maintenance services, application maintenance, software support services",
    relatedProjects: ["saanjgarva", "jar", "nityasadhana"],
  },
];

export const DEDICATED_SERVICES = SERVICES.filter((s) => s.hasDedicatedPage);
