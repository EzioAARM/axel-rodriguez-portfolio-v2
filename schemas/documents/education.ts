import { defineType, defineField } from "sanity";
import { BookIcon } from "@sanity/icons";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree / Program",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Institution Logo",
      type: "image",
      options: { hotspot: true },
      group: "content",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "Leave blank if still in progress.",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeBlock",
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
      description: "Lower numbers appear first.",
      group: "settings",
    }),
  ],
  orderings: [
    {
      title: "End Date (newest first)",
      name: "endDateDesc",
      by: [{ field: "endDate", direction: "desc" }],
    },
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "institution",
      subtitle: "degree.en",
      media: "logo",
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
