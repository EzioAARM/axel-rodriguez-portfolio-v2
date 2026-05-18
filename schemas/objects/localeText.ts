import { defineType, defineField } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Bilingual text (multiline)",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "es",
      title: "Español",
      type: "text",
    }),
  ],
});
