import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Bilingual text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "es",
      title: "Español",
      type: "string",
    }),
  ],
});
