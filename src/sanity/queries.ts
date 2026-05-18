import { client } from "./client";
import type {
  SiteConfig,
  WorkExperience,
  Education,
  Skill,
  Certification,
  Project,
  BlogPost,
  GalleryImage,
  SocialLink,
} from "./types";

// ─── Site Config ─────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return client.fetch(
    `*[_type == "siteConfig"][0]{
      _id,
      firstName,
      lastName,
      role,
      avatar,
      email,
      location,
      languages,
      bio,
      calendarUrl,
      socialLinks,
      seoTitle,
      seoDescription
    }`
  );
}

// ─── Work Experience ─────────────────────────────────────────────────────────

export async function getWorkExperience(): Promise<WorkExperience[]> {
  return client.fetch(
    `*[_type == "workExperience" && published == true] | order(order asc, startDate desc){
      _id,
      company,
      role,
      logo,
      startDate,
      endDate,
      location,
      description,
      achievements,
      tags,
      published,
      order
    }`
  );
}

// ─── Education ───────────────────────────────────────────────────────────────

export async function getEducation(): Promise<Education[]> {
  return client.fetch(
    `*[_type == "education" && published == true] | order(order asc, endDate desc){
      _id,
      institution,
      degree,
      logo,
      startDate,
      endDate,
      location,
      description,
      published,
      order
    }`
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  return client.fetch(
    `*[_type == "skill" && published == true] | order(category asc, order asc){
      _id,
      name,
      icon,
      category,
      proficiency,
      published,
      order
    }`
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

export async function getCertifications(): Promise<Certification[]> {
  return client.fetch(
    `*[_type == "certification" && published == true] | order(order asc, issuedDate desc){
      _id,
      name,
      issuer,
      issuerLogo,
      issuedDate,
      expiryDate,
      credentialId,
      credentialUrl,
      badgeImage,
      published,
      order
    }`
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(opts?: { featured?: boolean }): Promise<Project[]> {
  const featuredFilter = opts?.featured ? " && featured == true" : "";
  return client.fetch(
    `*[_type == "project" && published == true${featuredFilter}] | order(order asc, startDate desc){
      _id,
      title,
      "slug": slug.current,
      projectType,
      coverImage,
      summary,
      tags,
      links,
      startDate,
      endDate,
      featured,
      published,
      order
    }`
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug && published == true][0]{
      _id,
      title,
      "slug": slug.current,
      projectType,
      coverImage,
      summary,
      body,
      tags,
      links,
      images,
      startDate,
      endDate,
      featured,
      published,
      order,
      seoTitle,
      seoDescription
    }`,
    { slug }
  );
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(opts?: { featured?: boolean }): Promise<BlogPost[]> {
  const featuredFilter = opts?.featured ? " && featured == true" : "";
  return client.fetch(
    `*[_type == "blogPost" && published == true${featuredFilter}] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      coverImage,
      summary,
      tags,
      readingTimeMinutes,
      published,
      featured
    }`
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug && published == true][0]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      coverImage,
      summary,
      body,
      tags,
      readingTimeMinutes,
      published,
      featured,
      seoTitle,
      seoDescription
    }`,
    { slug }
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getGalleryImages(opts?: { tag?: string }): Promise<GalleryImage[]> {
  if (opts?.tag) {
    const params: Record<string, unknown> = { tag: opts.tag };
    return client.fetch(
      `*[_type == "galleryImage" && published == true && $tag in tags[].label] | order(order asc, dateTaken desc){
        _id,
        image,
        alt,
        caption,
        location,
        dateTaken,
        tags,
        published,
        order
      }`,
      params
    );
  }
  return client.fetch(
    `*[_type == "galleryImage" && published == true] | order(order asc, dateTaken desc){
      _id,
      image,
      alt,
      caption,
      location,
      dateTaken,
      tags,
      published,
      order
    }`
  );
}

export async function getGalleryTags(): Promise<string[]> {
  const result = await client.fetch<Array<{ label: string }[]>>(
    `*[_type == "galleryImage" && published == true].tags[]{label}`
  );
  const all = result.flat().map((t) => t.label);
  return [...new Set(all)].sort();
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<SocialLink[]> {
  return client.fetch(
    `*[_type == "socialLink"] | order(order asc){
      _id,
      platform,
      url,
      icon,
      label,
      essential,
      order
    }`
  );
}
