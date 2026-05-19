import { defineType, defineField } from "sanity";

const blockContent = {
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
};

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Bilingual rich text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", ...blockContent }),
    defineField({ name: "es", title: "Español", ...blockContent }),
  ],
});
