import type { PortableTextBlock } from "sanity";

// ─── Locale helpers ───────────────────────────────────────────────────────────

export type Locale = "en" | "es";

export interface LocaleString {
  en: string;
  es?: string;
}

export interface LocaleText {
  en: string;
  es?: string;
}

export type LocaleBlock = {
  en: PortableTextBlock[];
  es?: PortableTextBlock[];
};

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Tag {
  label: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface ImageWithAlt {
  asset: SanityImage;
  alt?: LocaleString;
}

// ─── Site Config ─────────────────────────────────────────────────────────────

export interface SocialLinkInline {
  platform: string;
  url: string;
  icon?: string;
  essential?: boolean;
}

export interface SiteConfig {
  _id: string;
  firstName: string;
  lastName: string;
  role: LocaleString;
  avatar?: SanityImage;
  email: string;
  location: string;
  languages?: string[];
  bio?: LocaleBlock;
  calendarUrl?: string;
  socialLinks?: SocialLinkInline[];
  seoTitle?: LocaleString;
  seoDescription?: LocaleText;
}

// ─── Work Experience ─────────────────────────────────────────────────────────

export interface WorkExperience {
  _id: string;
  company: string;
  role: LocaleString;
  logo?: SanityImage;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: LocaleBlock;
  achievements?: LocaleString[];
  tags?: Tag[];
  published: boolean;
  order?: number;
}

// ─── Education ───────────────────────────────────────────────────────────────

export interface Education {
  _id: string;
  institution: string;
  degree: LocaleString;
  logo?: SanityImage;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: LocaleBlock;
  published: boolean;
  order?: number;
}

// ─── Skill ───────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "languages"
  | "frameworks"
  | "cloud"
  | "databases"
  | "tools"
  | "other";

export interface Skill {
  _id: string;
  name: LocaleString;
  icon?: SanityImage;
  category: SkillCategory;
  proficiency?: number;
  published: boolean;
  order?: number;
}

// ─── Certification ────────────────────────────────────────────────────────────

export interface Certification {
  _id: string;
  name: LocaleString;
  issuer: string;
  issuerLogo?: SanityImage;
  issuedDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeImage?: SanityImage;
  published: boolean;
  order?: number;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectType = "personal" | "professional" | "open-source" | "freelance";

export interface Project {
  _id: string;
  title: LocaleString;
  slug: string;
  projectType: ProjectType;
  coverImage?: SanityImage & { alt?: LocaleString };
  summary: LocaleText;
  body?: LocaleBlock;
  tags?: Tag[];
  links?: ProjectLink[];
  images?: ImageWithAlt[];
  startDate?: string;
  endDate?: string;
  featured: boolean;
  published: boolean;
  order?: number;
  seoTitle?: LocaleString;
  seoDescription?: LocaleText;
}

// ─── Blog Post ────────────────────────────────────────────────────────────────

export interface BlogPost {
  _id: string;
  title: LocaleString;
  slug: string;
  publishedAt: string;
  coverImage?: SanityImage & { alt?: LocaleString };
  summary: LocaleText;
  body?: LocaleBlock;
  tags?: Tag[];
  readingTimeMinutes?: number;
  published: boolean;
  featured: boolean;
  seoTitle?: LocaleString;
  seoDescription?: LocaleText;
}

// ─── Gallery Image ────────────────────────────────────────────────────────────

export interface GalleryImage {
  _id: string;
  image: SanityImage;
  alt: LocaleString;
  caption?: LocaleString;
  location?: string;
  dateTaken?: string;
  tags?: Tag[];
  published: boolean;
  order?: number;
}

// ─── Social Link ─────────────────────────────────────────────────────────────

export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  icon?: string;
  label?: string;
  essential?: boolean;
  order?: number;
}
