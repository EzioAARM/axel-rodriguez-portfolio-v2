import { defineType, defineField } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image with alt text",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "localeString",
      description: "Describe the image for accessibility and SEO.",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt.en" },
  },
});
