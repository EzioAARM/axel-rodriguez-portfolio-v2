import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import {
  localeString,
  localeText,
  localeBlock,
  tag,
  projectLink,
  imageWithAlt,
  siteConfig,
  workExperience,
  education,
  skill,
  certification,
  project,
  blogPost,
  galleryImage,
  socialLink,
} from "./schemas";

const SINGLETON_TYPES = new Set(["siteConfig"]);

export default defineConfig({
  name: "default",
  title: "Axel Portfolio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Config")
              .id("siteConfig")
              .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
            S.divider(),
            S.documentTypeListItem("workExperience").title("Work Experience"),
            S.documentTypeListItem("education").title("Education"),
            S.documentTypeListItem("skill").title("Skills"),
            S.documentTypeListItem("certification").title("Certifications"),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
            S.divider(),
            S.documentTypeListItem("socialLink").title("Social Links"),
          ]),
    }),
  ],

  schema: {
    types: [
      // Objects
      localeString,
      localeText,
      localeBlock,
      tag,
      projectLink,
      imageWithAlt,
      // Singletons
      siteConfig,
      // Documents
      workExperience,
      education,
      skill,
      certification,
      project,
      blogPost,
      galleryImage,
      socialLink,
    ],
    // Prevent singletons from appearing in the "new document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // Prevent users from creating new singleton documents
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => !SINGLETON_TYPES.has(template.templateId));
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(({ action }) =>
          ["publish", "discardChanges", "restore"].includes(action ?? "")
        );
      }
      return prev;
    },
  },
});
