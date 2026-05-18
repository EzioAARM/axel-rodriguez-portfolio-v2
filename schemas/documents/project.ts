import { defineType, defineField } from "sanity";
import { CodeIcon } from "@sanity/icons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CodeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          { title: "Personal", value: "personal" },
          { title: "Professional", value: "professional" },
          { title: "Open Source", value: "open-source" },
          { title: "Freelance", value: "freelance" },
        ],
        layout: "radio",
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "localeString",
        },
      ],
      group: "content",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localeText",
      description: "Short description shown on the project card.",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Full Description",
      type: "localeBlock",
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags / Technologies",
      type: "array",
      of: [{ type: "tag" }],
      group: "content",
    }),
    defineField({
      name: "links",
      title: "Project Links",
      type: "array",
      of: [{ type: "projectLink" }],
      description: "e.g. GitHub repo, live demo, case study.",
      group: "content",
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      group: "content",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      group: "content",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "Leave blank if still in progress.",
      group: "content",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show on the home page highlights section.",
      group: "settings",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this item from the site without deleting it.",
      group: "settings",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
      group: "settings",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "localeString",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "localeText",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Start Date (newest first)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "projectType",
      media: "coverImage",
      published: "published",
    },
    prepare({ title, subtitle, media, published }) {
      return {
        title: title ?? "Untitled",
        subtitle: `${subtitle ?? ""}${published === false ? " — Hidden" : ""}`,
        media,
      };
    },
  },
});
