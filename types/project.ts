export interface Project {
  slug: string;
  title: string;
  category: string;
  positioning: string;
  year: string;
  description: string;
  services: string[];
  heroImage: string;
  heroVideo?: string;
  featured: boolean;
  status: "LIVE" | "COMING SOON";
  gallery?: string[];
  challenge?: string;
  approach?: string;
  solution?: string;
  result?: string;
  technologies: string[];
  liveUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}
