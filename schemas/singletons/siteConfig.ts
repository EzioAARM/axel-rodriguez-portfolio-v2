import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteConfig = defineType({
  name: "siteConfig",
  title: "Site Config",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "bio", title: "Bio" },
    { name: "social", title: "Social links" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "firstName",
      title: "First name",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last name",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / headline",
      type: "localeString",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Profile photo",
      type: "image",
      options: { hotspot: true },
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "location",
      title: "Location (IANA timezone)",
      type: "string",
      description: 'e.g. "America/Guatemala"',
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "languages",
      title: "Languages spoken",
      type: "array",
      of: [{ type: "string" }],
      group: "identity",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "localeBlock",
      group: "bio",
    }),
    defineField({
      name: "calendarUrl",
      title: "Calendar / booking URL",
      type: "url",
      description: "e.g. cal.com link — shown as 'Schedule a call' button.",
      group: "social",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", title: "Platform", type: "string", validation: (Rule) => Rule.required() },
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
            { name: "icon", title: "Icon name", type: "string", description: "Icon key from icons.ts (e.g. github, linkedin, email)" },
            { name: "essential", title: "Show on About page", type: "boolean", initialValue: false },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
      group: "social",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "localeString",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
      group: "seo",
    }),
  ],
  preview: {
    select: { first: "firstName", last: "lastName", media: "avatar" },
    prepare({ first, last, media }) {
      return { title: `${first ?? ""} ${last ?? ""}`.trim() || "Site Config", media };
    },
  },
});
