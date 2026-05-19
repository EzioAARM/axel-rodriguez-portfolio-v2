import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  icon: StarIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Skill Name",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      description: "Logo or icon for this skill/technology.",
      group: "content",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Languages", value: "languages" },
          { title: "Frameworks & Libraries", value: "frameworks" },
          { title: "Cloud & DevOps", value: "cloud" },
          { title: "Databases", value: "databases" },
          { title: "Tools", value: "tools" },
          { title: "Other", value: "other" },
        ],
        layout: "radio",
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency Level",
      type: "number",
      description: "1 (beginner) to 5 (expert).",
      options: {
        list: [1, 2, 3, 4, 5],
      },
      group: "content",
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
      description: "Lower numbers appear first within their category.",
      group: "settings",
    }),
  ],
  orderings: [
    {
      title: "Category then Manual Order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name.en",
      subtitle: "category",
      media: "icon",
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
