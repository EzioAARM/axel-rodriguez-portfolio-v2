# Axel Rodriguez — Portfolio

Personal portfolio website for Axel Alejandro Rodriguez Montenegro.
Senior Software Engineer | Cloud & DevOps | Guatemala.

## Architecture

```
Frontend:  magic-portfolio (Next.js 16 + OnceUI free) — this repo
CMS:       Sanity v3 — hosted by Sanity, Studio embedded at /studio
```

Sanity is a hosted headless CMS (free tier). Content is stored in Sanity's cloud and fetched via GROQ queries using the Sanity client. The Studio (admin panel) is embedded in this Next.js app at `/studio` — accessible on the custom domain.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **UI System**: `@once-ui-system/core` — see `.agents` for all component/layout rules
- **Styling**: SCSS Modules + OnceUI design tokens (never Tailwind, never hex colors)
- **Content (current)**: `src/resources/content.tsx` — static, to be replaced by Sanity
- **Content (target)**: Sanity CMS schemas, queried via GROQ from `src/sanity/queries.ts`
- **Formatting**: Biome (`npm run biome-write`)
- **Linting**: ESLint (`npm run lint`)

## Dev Commands

```bash
npm run dev          # dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run biome-write  # format all files with Biome
```

## Site Structure

| Route | Description | Status |
|---|---|---|
| `/` | Home — hero, featured project, latest 2 blog posts | template |
| `/about` | About — bio, experience, education, skills, certifications | template |
| `/work` | Projects — personal + professional, filtered by tags | template |
| `/blog` | Blog — bilingual posts (EN/ES) | template |
| `/gallery` | Gallery — photography grid with tag filters | template |

Certifications live inside `/about` as a dedicated section (not a separate route).

## Key Files

```
sanity.config.ts                 # Sanity Studio configuration (root, next to next.config.mjs)
sanity.cli.ts                    # Sanity CLI config — projectId and dataset
schemas/                         # Content type definitions (all Sanity schemas live here)
  index.ts                       # Barrel export of every schema
  singletons/siteConfig.ts       # Global person info, social links
  documents/                     # One document per content type
  objects/                       # Reusable field groups (localeString, tag, etc.)
src/resources/content.tsx        # all page content — static until Sanity replaces it
src/resources/once-ui.config.ts  # routes, theme, fonts, visual effects
src/resources/icons.ts           # icon registry (add new icons here)
src/types/content.types.ts       # TypeScript types for all content shapes
src/utils/utils.ts               # getPosts() — reads MDX files from disk
src/sanity/                      # Sanity data access layer
  client.ts                      # createClient — reads NEXT_PUBLIC_SANITY_* env vars
  queries.ts                     # All GROQ queries, one function per content type
  image.ts                       # urlForImage() helper (Sanity image URLs)
  types.ts                       # TypeScript types generated from Sanity schemas
src/app/studio/[[...tool]]/      # Sanity Studio embedded at /studio
  page.tsx
```

## Content Management — Source of Truth

**Before Sanity integration:** content lives in `src/resources/content.tsx`.
**After Sanity integration:** pages call `src/sanity/queries.ts` directly. `content.tsx` becomes a thin compatibility layer or is removed.

Never duplicate content between static files and Sanity. Once a content type is migrated, the static data is deleted.

## Sanity Schemas (planned)

| Schema | Type | Key fields |
|---|---|---|
| `siteConfig` | Singleton | firstName, lastName, role, bio (EN/ES), avatar, email, location |
| `socialLink` | Document | platform, url, essential |
| `workExperience` | Document | company, role, timeframe, achievements (PT, EN/ES), images, published, order |
| `education` | Document | institution, degree, period, description (EN/ES), published |
| `skill` | Document | title (EN/ES), description (PT, EN/ES), tags[], images[], published, order |
| `certification` | Document | name (EN/ES), issuer, date, credentialUrl, logo, published |
| `project` | Document | title (EN/ES), slug, description (PT, EN/ES), type, tags[], images[], links[], published, featured |
| `blogPost` | Document | title (EN/ES), slug, body (PT, EN/ES), summary (EN/ES), coverImage, tags[], publishedAt, published |
| `galleryImage` | Document | image, alt (EN/ES), orientation, tags[], published |

PT = Portable Text (Sanity rich text). EN/ES fields use `localeString` / `localeBlock` object types.

Every schema has a `published` boolean field. When `false`, GROQ queries filter it out.

## Sanity GROQ Query Pattern

```typescript
// Always filter published: true
const PROJECTS_QUERY = groq`*[_type == "project" && published == true] | order(featured desc) {
  _id, title, slug, description, type, tags, "coverImage": coverImage.asset->url
}`
```

## Bilingual (EN/ES)

- Primary locale: `en` (English)
- Secondary locale: `es` (Spanish)
- Payload's built-in localization handles per-field translations
- Language switcher component in the Header
- URL pattern: `/en/about`, `/es/about` (Next.js i18n or `[locale]` segment — TBD)

## Work Section

Shows both personal/side projects and professional achievements. Each Project has a `type` field (`personal` | `professional`) used as a tag in the UI.

## Gallery

Simple masonry grid with tag-based filtering. Tags represent destinations or themes (e.g. "Guatemala", "México", "Arquitectura"). Filter UI is client-side.

## MCPs Configured

| MCP | Scope | Purpose |
|---|---|---|
| **Context7** | Project (`.claude/settings.json`) | Live OnceUI documentation |
| **next-devtools** | Project (`.claude/settings.json`) | Next.js diagnostics, routes, build info |
| **playwright** | Project (`.claude/settings.json`) | Browser automation y pruebas E2E |
| **Sanity** | User (`~/.claude/settings.json`) | Query/manage Sanity content across projects |

Run `npx sanity@latest mcp configure` to also configure Sanity MCP for VS Code / Cursor.
After creating the Sanity project, set `SANITY_API_TOKEN` in your shell before adding the MCP.

## OnceUI Rules

See `.agents` file at the repo root — it contains the complete OnceUI component and layout rules. The MCP (Context7) is configured in `.claude/settings.json` and serves live OnceUI docs.

**Critical constraints:**
- Never use `<div>` — use `<Column>`, `<Row>`, `<Grid>`
- Never use Tailwind classes
- Never use hex/rgb colors — use OnceUI token props (`background`, `onBackground`, etc.)
- Never use inline `style` for layout — use Flex props on layout components
- Always use TypeScript functional components

## Owner Profile (for content reference)

- **Name**: Axel Alejandro Rodriguez Montenegro
- **Role**: Cloud Specialist DevOps @ Escala 24x7 Inc. (March 2026–present)
- **Previous**: Senior Backend Developer @ Grupo CEMACO (6 years)
- **Stack**: AWS, Pulumi, C#, Python, React, Next.js, GraphQL, Docker, CI/CD
- **Certifications**: AWS Certified, Google Cloud Fundamentals, CloudFormation, others
- **Education**: CS Degree (Universidad Rafael Landívar) + Master's in Cybersecurity (in progress)
- **Languages**: Spanish (native), English (professional)
- **Interests**: Photography, Travel
- **Location**: Guatemala, Guatemala — timezone: `America/Guatemala`
- **LinkedIn**: linkedin.com/in/axelrm
- **Email**: alejandrom9712@gmail.com

## Security

### What's implemented

| Area | Implementation | File |
|---|---|---|
| **Auth cookie** | HMAC-SHA256 del `PAGE_ACCESS_PASSWORD`, no valor literal | `src/lib/auth.ts` |
| **Rate limiting** | 5 intentos / 15 min por IP (in-memory) | `src/lib/rateLimit.ts` |
| **Timing attacks** | Comparación en tiempo constante en verificación de token | `src/lib/auth.ts` |
| **Rutas protegidas** | Server-side en `middleware.ts` + client-side en `RouteGuard` | `src/middleware.ts` |
| **HTTP headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS | `next.config.mjs` |
| **OG image** | Título sanitizado (strip control chars, max 120 chars) | `src/app/api/og/generate/route.tsx` |
| **Image domains** | Solo `cdn.sanity.io` y `fonts.gstatic.com` | `next.config.mjs` |
| **Env vars** | `SANITY_API_TOKEN` nunca con prefijo `NEXT_PUBLIC_` | `.env.example` |

### Reglas para no romper la seguridad

- `SANITY_API_TOKEN` debe ser **server-side only** — nunca añadir `NEXT_PUBLIC_` a este var
- Toda query GROQ a Sanity debe incluir `&& published == true`
- Nuevas API routes deben validar el body (tipo, longitud) antes de procesarlo
- El middleware excluye `/studio` — el Studio de Sanity maneja su propia autenticación
- Rate limiting es in-memory: si en el futuro hay múltiples instancias (Vercel Functions concurrentes), migrar a Redis

## Documentation Rules

After every change, check if any of these need updating:

| Changed | Update |
|---|---|
| New route or page | `README.md` structure table + `once-ui.config.ts` routes |
| New Sanity schema | `README.md` content types table + `schemas/CLAUDE.md` folder map + root `CLAUDE.md` schema table |
| New env variable | `.env.example` (with explanation) + `README.md` env vars section |
| New npm script | `README.md` available scripts section |
| New folder or key file | `README.md` project structure + relevant `CLAUDE.md` folder map |
| Changed dev command or port | `README.md` local setup section |
| New MCP server | `README.md` MCP section + root `CLAUDE.md` MCPs table |
| Changed deploy process | `README.md` deploy section |

The README is the single source of truth for anyone (or any AI) starting fresh on this project. Keep it accurate.

## What NOT to Do

- Don't add Tailwind — it conflicts with OnceUI's class system
- Don't hardcode content once Payload is integrated — all text through CMS
- Don't create new pages without adding the route to `once-ui.config.ts`
- Don't use `any` types — follow the types in `src/types/`
- Don't break the `published` filter — unlisted items must never appear publicly
- Don't delete items in Payload — use `published: false` to hide them
- Don't add the newsletter/Mailchimp section until Axel decides to use it
- Don't write GROQ queries without the `published == true` filter
- Don't store images in the repo — all media goes through Sanity's CDN (`cdn.sanity.io`)
