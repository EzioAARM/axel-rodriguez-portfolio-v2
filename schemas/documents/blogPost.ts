import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
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
      description: "Short excerpt shown on the blog listing page.",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localeBlock",
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "tag" }],
      group: "content",
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading Time (minutes)",
      type: "number",
      group: "content",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this post from the site without deleting it.",
      group: "settings",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Highlight this post on the home page.",
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
      title: "Published Date (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "publishedAt",
      media: "coverImage",
      published: "published",
    },
    prepare({ title, subtitle, media, published }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString() : "";
      return {
        title: title ?? "Untitled",
        subtitle: `${date}${published === false ? " — Hidden" : ""}`,
        media,
      };
    },
  },
});
