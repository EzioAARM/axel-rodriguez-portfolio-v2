# src/ — Frontend Source

All frontend code for the portfolio. Next.js App Router, TypeScript, OnceUI.

## Folder Map

```
app/                      # Next.js App Router pages
  page.tsx                # Home — hero + featured project + latest posts
  about/page.tsx          # About — bio, work, education, skills, certifications
  work/
    page.tsx              # Work index — all projects grid
    [slug]/page.tsx       # Individual project page (from MDX → future: Payload)
    projects/*.mdx        # Project content files (to be migrated to Payload)
  blog/
    page.tsx              # Blog index
    [slug]/page.tsx       # Individual post page
    posts/*.mdx           # Blog post files (to be migrated to Payload)
  gallery/page.tsx        # Gallery — masonry grid with tag filtering
  api/
    og/                   # Open Graph image generation
    rss/route.ts          # RSS feed
    authenticate/         # Password protection routes

components/               # Shared UI components (built from OnceUI primitives)
  Header.tsx / .scss      # Top navigation
  Footer.tsx / .scss      # Footer
  Mailchimp.tsx           # Newsletter form (disabled until decided)
  about/                  # About-page-specific components
  blog/                   # Blog-specific components (Post, Posts, ShareSection)
  gallery/GalleryView.tsx # Gallery masonry grid (to add tag filter UI)
  work/Projects.tsx       # Projects grid

resources/
  content.tsx             # SOURCE OF TRUTH for all content (until Payload replaces it)
  once-ui.config.ts       # Visual config: routes, theme, fonts, effects
  icons.ts                # Icon registry — add new icons here before using them
  index.ts                # Barrel export for resources

lib/                      # (to be created) Data access layer
  payload.ts              # Payload Local API queries — replaces hardcoded content.tsx data

types/
  content.types.ts        # TypeScript types: Person, Home, About, Blog, Work, Gallery
  config.types.ts         # Types for once-ui.config.ts
  index.ts                # Barrel export

utils/
  utils.ts                # getPosts() — reads MDX from disk via gray-matter
  formatDate.ts           # Date formatting utility
```

## Content Flow (current → target)

```
Current:  content.tsx (static TypeScript objects)
                ↓
Target:   src/sanity/queries.ts (GROQ → Sanity CDN)
                ↓
          Pages call query functions directly (Server Components, no changes needed)
```

When migrating a content type:
1. Write the GROQ query in `src/sanity/queries.ts`
2. Call it from the page (`await getProjects()`)
3. Delete the static data from `content.tsx`
Never keep the same data in both places.

## Adding a New Section to About

1. Add the TypeScript type to `src/types/content.types.ts`
2. Add the data to `content.tsx` (or the Payload collection)
3. Add the JSX block in `src/app/about/page.tsx` using `<Column>` and `<Heading>`
4. Add the section to the `structure` array at the top of `about/page.tsx` for the table of contents

## Adding a New Route

1. Create `src/app/<route>/page.tsx`
2. Set `"/<route>": true` in `src/resources/once-ui.config.ts` under `routes`
3. Add a nav label if needed in `Header.tsx`

## Gallery Tag Filtering

`GalleryView.tsx` needs a tag filter UI added above the masonry grid. Pattern:
- Tags come from `gallery.images[].tags` (currently `orientation` only — expand to include destination)
- Filter state is client-side (`useState`)
- Filter button group uses OnceUI `<Button>` components with `variant="secondary"` / `"primary"` for active state

## Blog & Work — MDX vs Sanity

Currently both use MDX files read by `utils/utils.ts → getPosts()`.

When Sanity is integrated:
- Blog posts → `blogPost` schema in Sanity (Portable Text rich text)
- Work projects → `project` schema in Sanity
- Keep `getPosts()` until migration is complete — both can coexist temporarily
- Do NOT delete MDX files until all content is confirmed in Sanity

## Sanity Data Layer (`src/sanity/`)

```
client.ts    createClient({ projectId, dataset, useCdn: true })
             reads NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET from env
queries.ts   one exported async function per content type:
             getProjects(), getBlogPosts(), getSiteConfig(), getGalleryImages(), etc.
             every query includes `&& published == true` filter
image.ts     urlForImage(source) — converts Sanity image ref to CDN URL with dimensions
types.ts     TypeScript interfaces matching each Sanity schema (can be auto-generated
             with `npx sanity@latest typegen generate`)
```

## Bilingual Implementation Plan

- Wrap `src/app/` in a `[locale]/` segment (`en` | `es`)
- Pass `locale` to Payload queries to get the right translation
- `LanguageSwitcher` component in `Header.tsx` — swaps locale in the URL
- Default locale `en`, fallback `en` if `es` translation is missing

## Component Rules (summary — full rules in `.agents`)

- Layout: `<Column>` (vertical) / `<Row>` (horizontal) / `<Grid>` (equal cells)
- Text: `<Heading variant="display-strong-xl">` / `<Text variant="body-default-m">`
- Colors: use `background`, `onBackground`, `solid`, `onSolid` props — never inline CSS colors
- Spacing: `gap`, `padding`, `margin` props with SpacingToken values ("8", "16", "24"...)
- Responsive: `s={{ direction: "column" }}` breakpoint objects on layout components
- Interactive: `<Button>`, `<IconButton>` — default size `m`
- Images/video: `<Media>` component (not `<img>`)
- Never: `<div>`, Tailwind classes, hex colors, `style` prop for layout
