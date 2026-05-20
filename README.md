# Axel Rodriguez — Portfolio

Personal portfolio website for Axel Alejandro Rodriguez Montenegro.  
Senior Software Engineer | Cloud & DevOps | Guatemala.

Built with [magic-portfolio](https://github.com/once-ui-system/magic-portfolio) (Next.js + Once UI) and [Sanity](https://sanity.io) as headless CMS.

## Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **UI**: [Once UI](https://once-ui.com) (free tier)
- **CMS**: Sanity v3 (hosted, free tier) — Studio at `/studio`
- **Styling**: SCSS Modules + Once UI design tokens
- **Fonts**: Chalet (headings) + Space Mono (display) + Inter (body)

## Prerequisites

- Node.js v18.17 or higher
- A [Sanity](https://sanity.io) account (free)

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token          # editor or admin token (server-side only)

# Optional: password-protect specific pages
PAGE_ACCESS_PASSWORD=your_password
```

Get your Sanity credentials from [sanity.io/manage](https://sanity.io/manage).

### 3. Run the dev server

```bash
npm run dev
```

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Sanity Studio (CMS admin): [http://localhost:3000/studio](http://localhost:3000/studio)

## Available Scripts

```bash
npm run dev          # dev server with hot reload
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run biome-write  # format all files with Biome
```

## Project Structure

```
/
├── sanity.config.ts          # Sanity Studio configuration
├── sanity.cli.ts             # Sanity CLI config (projectId, dataset)
├── schemas/                  # Sanity content type definitions
│   ├── index.ts              # Exports all schemas
│   ├── singletons/           # Single-instance documents (siteConfig)
│   ├── documents/            # Repeatable content types
│   └── objects/              # Reusable field groups (localeString, tag, etc.)
└── src/
    ├── app/
    │   ├── (portfolio)/      # Default-locale routes (always ES)
    │   │   ├── page.tsx      # Home
    │   │   ├── about/        # About — bio, experience, skills, certifications
    │   │   ├── work/         # Projects list + detail
    │   │   ├── blog/         # Blog list + post
    │   │   └── gallery/      # Photography gallery
    │   ├── [locale]/
    │   │   └── (portfolio)/  # Prefixed routes (/en/*, /es/*)
    │   │       ├── page.tsx  # Same pages, locale passed as param
    │   │       └── ...
    │   └── studio/           # Sanity Studio (admin panel)
    ├── components/           # Shared UI components (built with Once UI)
    │   ├── home/             # Home-page specific (ServiceCard styles)
    │   ├── work/             # Projects card + StopPropagation helper
    │   └── gallery/          # Masonry grid with lightbox
    ├── i18n/
    │   └── translations.ts   # EN/ES string translations
    ├── sanity/               # Sanity data access layer
    │   ├── client.ts         # Sanity client
    │   ├── queries.ts        # GROQ queries (all filter published == true)
    │   ├── image.ts          # Image URL builder
    │   ├── locale.ts         # l() / lBlock() helpers for bilingual fields
    │   └── types.ts          # TypeScript types from schemas
    ├── resources/
    │   ├── content.tsx       # Static content (migrated to Sanity progressively)
    │   └── once-ui.config.ts # Theme, routes, fonts, visual effects
    └── types/                # TypeScript type definitions
```

## Site Routes

| Route | Description |
|---|---|
| `/` | Home — hero, stats strip, "What I do" services, featured project, latest blog posts |
| `/about` | About — bio, work experience, education, certifications, technical skills, social links |
| `/work` | Projects — personal + professional, 2-column horizontal cards |
| `/blog` | Blog — bilingual posts (EN/ES) |
| `/gallery` | Gallery — masonry grid with tag + location filters and lightbox |
| `/studio` | Sanity Studio — content management admin panel |

All routes are also available with a locale prefix: `/en/*` and `/es/*`.

## Content Management

All content is managed from the Sanity Studio at `/studio` (or [sanity.io/manage](https://sanity.io/manage)).

### Content types

| Type | Description |
|---|---|
| Site Config | Global info: name, bio, avatar, social links, hero headline/subline, stats strip |
| Social Link | Social/contact links shown in the About sidebar |
| Service | "What I do" cards on the home page (title, description, icon) |
| Work Experience | Employment history |
| Education | Degrees and courses |
| Skill | Technical skills with tags and images |
| Certification | Professional certifications (AWS, GCP, etc.) |
| Project | Portfolio projects (personal + professional) |
| Blog Post | Articles — bilingual EN/ES, Portable Text |
| Gallery Image | Photography with location, date, and theme tags |

Every content item has a **Published** toggle. Unpublish to hide an item without deleting it.

### Home page — configurable from Sanity

Inside **Site Config → Home page** you can set:

- **Headline** — hero heading (EN/ES)
- **Subline** — hero subtext (EN/ES)
- **Stats** — numbered strip (e.g. "6+ Years", "10+ Projects")

The **What I do** section is populated from the **Services** content type. Each service has a title, description, and an icon name from the [Once UI icon set](https://once-ui.com/docs/icons) (e.g. `cloud`, `terminal`, `code`, `server`, `chip`).

### Bilingual content (EN/ES)

Fields marked as bilingual have separate EN and ES inputs in the Studio. The site defaults to Spanish (`es`); English is served at `/en/*` routes.

- Non-prefixed URLs (`/about`) always serve the default locale (ES)
- Prefixed URLs (`/en/about`, `/es/about`) serve the matching locale and keep the prefix on navigation

## Theme Customization

Edit `src/resources/once-ui.config.ts` to change colors, fonts, border style, and visual effects.  
See [Once UI theming docs](https://docs.once-ui.com) for available tokens.

## Deploy

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the environment variables from `.env.local`
4. Deploy

Once deployed, update `baseURL` in `src/resources/once-ui.config.ts` to your custom domain.

## Security

The following security measures are implemented out of the box:

- **HTTP security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS (via `next.config.mjs`)
- **Password-protected routes** — enforced server-side in `src/middleware.ts` and client-side in `RouteGuard`
- **Auth token** — HMAC-SHA256 of the password, not a guessable literal value
- **Rate limiting** — 5 attempts per 15 minutes per IP on the auth endpoint
- **Timing-safe comparison** — token verification uses constant-time comparison
- **Image allowlist** — only `cdn.sanity.io` and `fonts.gstatic.com` are allowed as remote image sources
- **OG image sanitization** — title parameter is stripped and truncated before rendering

> Never prefix `SANITY_API_TOKEN` with `NEXT_PUBLIC_` — it would expose the token to the browser.

## MCP Servers (for AI-assisted development)

This project has four MCP servers configured for Claude Code:

| MCP | Scope | Purpose |
|---|---|---|
| **Context7** | Project | Live Once UI documentation |
| **next-devtools** | Project | Next.js diagnostics, routes, and build info |
| **playwright** | Project | Browser automation and E2E testing |
| **Sanity** | User | Query and manage Sanity content |

To configure the Sanity MCP after creating your project:
```bash
# For Claude Code
claude mcp add Sanity -t http https://mcp.sanity.io/mcp --scope user

# For VS Code / Cursor / Windsurf
npx sanity@latest mcp configure
```

## License

Based on [magic-portfolio](https://github.com/once-ui-system/magic-portfolio) — CC BY-NC 4.0.  
Attribution required. Commercial use not allowed without a [Once UI Pro](https://once-ui.com/pricing) license.
