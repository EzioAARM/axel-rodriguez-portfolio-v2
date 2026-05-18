# schemas/ — Sanity Content Types

All Sanity schema definitions live here. This folder is referenced by `sanity.config.ts` at the project root.

## Folder Structure

```
schemas/
  index.ts                    # Exports all schemas in one array for sanity.config.ts
  singletons/
    siteConfig.ts             # Global doc: person info, social links, bio (EN/ES)
  documents/
    workExperience.ts         # Work history entries
    education.ts              # Education / degrees
    skill.ts                  # Technical skill with tags and images
    certification.ts          # AWS, GCP, etc. certifications
    project.ts                # Portfolio projects (personal + professional)
    blogPost.ts               # Blog articles with Portable Text body
    galleryImage.ts           # Photography with tags for filtering
    socialLink.ts             # GitHub, LinkedIn, Email, etc.
  objects/
    localeString.ts           # { en: string, es: string } — bilingual single-line text
    localeText.ts             # { en: string, es: string } — bilingual multiline text
    localeBlock.ts            # { en: BlockContent, es: BlockContent } — bilingual Portable Text
    tag.ts                    # Reusable { label: string } object used in projects/gallery/blog
    projectLink.ts            # { label: string, url: string } for project external links
    imageWithAlt.ts           # image + localeString alt (used in skills, projects)
```

## Naming Conventions

- Schema `name` field: camelCase (`workExperience`, `blogPost`, `siteConfig`)
- Schema `title` field: human-readable, shown in Studio (`"Work Experience"`, `"Blog Post"`)
- Field names: camelCase (`publishedAt`, `credentialUrl`, `coverImage`)
- Never use `id` as a field name — Sanity uses `_id` internally

## Every Document Schema Must Have

```typescript
// Required on every document schema
{
  name: 'published',
  title: 'Published',
  type: 'boolean',
  initialValue: true,
  description: 'Uncheck to hide this item from the site without deleting it.',
  group: 'settings',  // put it in a sidebar group
}
```

GROQ queries always filter `&& published == true`. Never query without this filter.

## Bilingual Fields — Pattern

Use `localeString` / `localeBlock` object types for any field with EN/ES content:

```typescript
// Field definition in a document schema
{
  name: 'title',
  title: 'Title',
  type: 'localeString',  // object type defined in objects/localeString.ts
}

// The localeString object type:
export const localeString = {
  name: 'localeString',
  type: 'object',
  fields: [
    { name: 'en', title: 'English', type: 'string', validation: Rule => Rule.required() },
    { name: 'es', title: 'Español', type: 'string' },
  ],
}

// In GROQ — access the right locale:
// title.en  or  title[$locale]  (where $locale = 'en' | 'es')
```

## Document Groups (Studio UX)

Organize fields into groups for a cleaner Studio experience:

```typescript
groups: [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo',     title: 'SEO' },
  { name: 'settings', title: 'Settings' },  // published toggle goes here
],
```

## `published` Field Behavior

- `published: true` → item appears on the site
- `published: false` → item is hidden, NOT deleted
- Default is `true` so new items are visible immediately after saving
- Change to `false` to draft/hide an item without removing it

This applies to: workExperience, education, skill, certification, project, blogPost, galleryImage.
`siteConfig` and `socialLink` do not need `published` (they're always active or removed entirely).

## Adding a New Schema

1. Create the file in the appropriate subfolder (`documents/` or `objects/`)
2. Export it from `schemas/index.ts`
3. If it's a singleton (only one document ever), configure it in `sanity.config.ts` under `singletons`
4. Write the corresponding GROQ query in `src/sanity/queries.ts`
5. Add the TypeScript interface to `src/sanity/types.ts`
6. Add it to the CLAUDE.md schema table in the root `CLAUDE.md`

## Sanity Image Fields

Always use `type: 'image'` with `options: { hotspot: true }` so editors can set focal points:

```typescript
{
  name: 'coverImage',
  title: 'Cover Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alt text', type: 'localeString' }
  ],
}
```

In GROQ, dereference with `->` to get the CDN URL:
```groq
"coverImageUrl": coverImage.asset->url
```

In the frontend, always use `urlForImage(source)` from `src/sanity/image.ts` to build URLs with proper dimensions, never raw asset URLs.

## Schema Template

```typescript
import { defineField, defineType } from 'sanity'

export const mySchema = defineType({
  name: 'mySchema',
  title: 'My Schema',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [
    { title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.en', published: 'published' },
    prepare({ title, published }) {
      return { title, subtitle: published ? 'Published' : 'Hidden' }
    },
  },
})
```
