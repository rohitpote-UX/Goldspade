export interface JournalArticle {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  category: string;
  publishedAt: string; // ISO date format e.g. "2026-03-15"
  updatedAt?: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  searchIntent: string;
  relatedService: {
    title: string;
    href: string;
  };
  relatedProjects?: string[];
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      paragraphs: string[];
      callout?: string;
    }>;
    conclusion: string;
  };
}

export interface EditorialTopic {
  id: string;
  title: string;
  targetQuery: string;
  searchIntent: "Informational" | "Commercial" | "Comparative";
  targetAudience: string;
  relatedService: string;
  status: "PUBLISHED" | "PLANNED";
  outline: string[];
}
