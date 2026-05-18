# src/resources/ — Configuration & Content

This folder is the brain of the portfolio. Two files control everything:

## content.tsx — All Page Content

Defines the data consumed by every page. Exports:

| Export | Used by | Description |
|---|---|---|
| `person` | all pages | name, role, avatar, email, timezone, languages |
| `social` | About, Footer | social links with `essential` flag for About visibility |
| `newsletter` | Home, Blog | newsletter section toggle + text |
| `home` | `/` | headline, subline, featured badge |
| `about` | `/about` | intro, work experiences, education, technical skills |
| `blog` | `/blog` | page title/description (posts are MDX files) |
| `work` | `/work` | page title/description (projects are MDX files) |
| `gallery` | `/gallery` | images array with src, alt, orientation |

**When Payload CMS is integrated**, these exports become async functions backed by `src/lib/payload.ts`. The page components (which are Server Components) call them with `await`.

### Extending content.tsx

To add a new section (e.g. certifications inside About):
1. Define a new type in `src/types/content.types.ts`
2. Add the data object here
3. Add it to the `about` export or as a standalone export
4. Use it in `src/app/about/page.tsx`

## once-ui.config.ts — Visual & Route Config

Controls visual theme and which routes are enabled.

### Routes — MUST stay in sync

```typescript
const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true,
  "/blog": true,
  "/gallery": true,
  // Add new routes here before creating the page
};
```

Setting a route to `false` removes it from navigation and returns 404.

### Theme Tokens (current)

```typescript
const style: StyleConfig = {
  theme: "system",      // dark | light | system
  neutral: "gray",      // sand | gray | slate | mint | rose | dusk | custom
  brand: "cyan",        // many options — Axel's brand color
  accent: "red",
  solid: "contrast",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "100",
};
```

Change `brand` and `accent` to match Axel's personal branding when decided.

### Effects (current defaults)

- `dots`: enabled at 40% opacity — background dot pattern
- `gradient`, `grid`, `lines`: disabled
- `mask.cursor`: disabled on the main page

### baseURL

Must be updated to the real domain before deploy:
```typescript
const baseURL: string = "https://axel-rodriguez.com"; // update this
```

## icons.ts — Icon Registry

Before using any icon in a component, it must be imported here.
This is a central registry that maps icon names to their implementations.
Check this file first before trying to use an icon — it may already exist.
