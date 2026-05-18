import { defineType, defineField } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});
