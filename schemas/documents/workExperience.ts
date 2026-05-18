import { defineType, defineField } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const workExperience = defineType({
  name: "workExperience",
  title: "Work Experience",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Job Title",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Company Logo",
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
      description: "Leave blank if this is the current position.",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Guatemala City, Guatemala" or "Remote"',
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeBlock",
      group: "content",
    }),
    defineField({
      name: "achievements",
      title: "Key Achievements",
      type: "array",
      of: [{ type: "localeString" }],
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
      title: "Start Date (newest first)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "company",
      subtitle: "role.en",
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
