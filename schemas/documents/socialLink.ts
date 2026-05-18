import { defineType, defineField } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  icon: LinkIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Icon key from icons.ts (e.g. github, linkedin, email, x, youtube).",
      group: "content",
    }),
    defineField({
      name: "label",
      title: "Display Label",
      type: "string",
      description: "Accessible label shown on hover or for screen readers.",
      group: "content",
    }),
    defineField({
      name: "essential",
      title: "Show on About Page",
      type: "boolean",
      initialValue: false,
      description: "Highlight this link prominently on the About page.",
      group: "settings",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
      group: "settings",
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "platform",
      subtitle: "url",
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "Untitled",
        subtitle: subtitle ?? "",
      };
    },
  },
});
