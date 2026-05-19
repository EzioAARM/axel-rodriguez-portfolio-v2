import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  icon: ImageIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localeString",
      description: "Optional caption shown below the image.",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Antigua, Guatemala"',
      group: "content",
    }),
    defineField({
      name: "dateTaken",
      title: "Date Taken",
      type: "date",
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags / Destinations",
      type: "array",
      of: [{ type: "tag" }],
      description: "Used for filtering in the gallery (e.g. Guatemala, Travel, Architecture).",
      group: "content",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this image from the site without deleting it.",
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
      title: "Date Taken (newest first)",
      name: "dateTakenDesc",
      by: [{ field: "dateTaken", direction: "desc" }],
    },
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "alt.en",
      subtitle: "location",
      media: "image",
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
