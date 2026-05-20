import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: StarIcon,
  groups: [
    { name: "content", title: "Content", default: true },
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
      name: "description",
      title: "Description",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon name",
      type: "string",
      group: "content",
      description: 'Icon key from the icon registry (e.g. "cloud", "terminal", "code").',
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      group: "settings",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "settings",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    { title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title.en", icon: "icon", published: "published" },
    prepare({ title, icon, published }) {
      return { title, subtitle: `${icon ?? "no icon"} · ${published ? "Published" : "Hidden"}` };
    },
  },
});
