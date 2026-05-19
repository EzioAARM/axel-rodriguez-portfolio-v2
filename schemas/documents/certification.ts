import { defineType, defineField } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons";

export const certification = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  icon: CheckmarkCircleIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Certification Name",
      type: "localeString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuing Organization",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuerLogo",
      title: "Issuer Logo",
      type: "image",
      options: { hotspot: true },
      group: "content",
    }),
    defineField({
      name: "issuedDate",
      title: "Issue Date",
      type: "date",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "date",
      description: "Leave blank if it does not expire.",
      group: "content",
    }),
    defineField({
      name: "credentialId",
      title: "Credential ID",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "credentialUrl",
      title: "Credential URL",
      type: "url",
      description: "Link to verify the certification.",
      group: "content",
    }),
    defineField({
      name: "badgeImage",
      title: "Badge Image",
      type: "image",
      options: { hotspot: true },
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
      title: "Issue Date (newest first)",
      name: "issuedDateDesc",
      by: [{ field: "issuedDate", direction: "desc" }],
    },
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name.en",
      subtitle: "issuer",
      media: "badgeImage",
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
