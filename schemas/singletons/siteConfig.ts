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
    { name: "contact", title: "Contact" },
    { name: "home", title: "Home page" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
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
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [{ type: "reference", to: [{ type: "socialLink" }] }],
      description: "Select from the Social Links you defined in the Social Links section. The 'Show on About page' flag on each link controls where it appears.",
      group: "contact",
    }),
    defineField({
      name: "headline",
      title: "Hero headline",
      type: "localeString",
      group: "home",
      description: "Main heading shown on the home page.",
    }),
    defineField({
      name: "subline",
      title: "Hero subline",
      type: "localeString",
      group: "home",
      description: "Subtitle shown below the headline.",
    }),
    defineField({
      name: "stats",
      title: "Stats / Numbers",
      type: "array",
      group: "home",
      description: 'Numbers displayed on the home page (e.g. "6+ Years of experience").',
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: 'e.g. "6+"' }),
            defineField({ name: "label", title: "Label", type: "localeString" }),
          ],
          preview: {
            select: { value: "value", label: "label.en" },
            prepare({ value, label }: { value?: string; label?: string }) {
              return { title: [value, label].filter(Boolean).join(" — ") };
            },
          },
        },
      ],
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
    defineField({
      name: "showBlog",
      title: "Show Blog section",
      type: "boolean",
      initialValue: true,
      description: "When disabled, the blog page shows no posts.",
      group: "settings",
    }),
    defineField({
      name: "showNewsletter",
      title: "Show Newsletter section",
      type: "boolean",
      initialValue: false,
      description: "Show the newsletter signup form on the home and blog pages.",
      group: "settings",
    }),
  ],
  preview: {
    select: { first: "firstName", last: "lastName", media: "avatar" },
    prepare({ first, last, media }) {
      return { title: `${first ?? ""} ${last ?? ""}`.trim() || "Site Config", media };
    },
  },
});
