export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type Community = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  highlights: string[];
  responsibilities: string[];
};

export type Event = {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  location?: string;
  type: "workshop" | "summit" | "networking" | "conference";
  status: "upcoming" | "past";
  speaker?: string;
  capacity?: number;
  registrationOpen?: boolean;
};

export type Webinar = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  duration: string;
  speaker: string;
  status: "upcoming" | "live" | "recorded";
  platform: "Zoom" | "YouTube Live" | "Google Meet";
  topics: string[];
  registrationOpen: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
};

export type TeamMember = {
  name: string;
  role: string;
  department?: string;
  image?: string;
  bio?: string;
  subtitle?: string;
};

export type Sponsor = {
  name: string;
  tier: "platinum" | "gold" | "silver" | "partner";
  logo?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type SocialLink = {
  name: string;
  label: string;
  href: string;
  icon: "instagram" | "youtube" | "linkedin" | "whatsapp";
  subtitle?: string;
};

export type ApplicationType =
  | "management"
  | "volunteer"
  | "presidency"
  | "speaker"
  | "sponsor"
  | "partner";

export type DashboardApplication = {
  id: string;
  name: string;
  type: ApplicationType;
  date: string;
  status: "pending" | "approved" | "rejected";
};

export type DashboardMessage = {
  id: string;
  name: string;
  email: string;
  preview: string;
  date: string;
  isRead: boolean;
};
