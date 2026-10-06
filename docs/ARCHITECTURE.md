# Rudhirsetu website: architecture and developer guide

The technical guide for whoever inherits this codebase. It explains how the site is put together, why the non-obvious decisions were made, and how to do the common jobs (add a page, add a content type, deploy, debug).

- Verified against the repository on **2026-10-07** (Next.js 16.3.8, React 19.3.0). Every concrete file path below was checked to exist on that date (paths with `<placeholders>` are templates).
- Companion docs: [DESIGN.md](./DESIGN.md) (UI system), [BRAND.md](./BRAND.md) (brand kit), [CONTENT.md](./CONTENT.md) (guide for the NGO staff who edit content). The doc index is [README.md](./README.md).
- Sections marked **verify: recently changed** describe code that was still being edited when this was written. Re-read the code before relying on them.

## Contents

1. [Stack and tooling](#1-stack-and-tooling)
2. [Repository map](#2-repository-map)
3. [Routes and the page, client, view pattern](#3-routes-and-the-page-client-view-pattern)
4. [Data flow and caching](#4-data-flow-and-caching)
5. [Environment variables](#5-environment-variables)
6. [Rendering and performance architecture](#6-rendering-and-performance-architecture)
7. [HTTP headers and caching (`next.config.mjs`)](#7-http-headers-and-caching-nextconfigmjs)
8. [Cross-browser support policy](#8-cross-browser-support-policy)
9. [SEO and social sharing](#9-seo-and-social-sharing)
10. [Accessibility](#10-accessibility)
11. [Scripts and testing](#11-scripts-and-testing)
12. [Deployment on Vercel](#12-deployment-on-vercel)
13. [How to ...](#13-how-to-)
14. [Troubleshooting](#14-troubleshooting)
15. [Known gaps and tech debt](#15-known-gaps-and-tech-debt)

---

## 1. Stack and tooling

| Concern | Choice | `package.json` range | Installed (lockfile) |
| --- | --- | --- | --- |
| Framework | Next.js, App Router, Turbopack (default bundler for `dev` and `build` in Next 16) | `^16.1.6` | 16.3.8 |
| UI | React | `^19.2.4` | 19.3.0 |
| Language | TypeScript (`strict: false`, `strictNullChecks: true`, build fails on type errors) | `~5.7.2` | 5.7.3 |
| Styling | Tailwind CSS v4, CSS-first config (`@theme` in `src/styles/globals.css`, PostCSS plugin `@tailwindcss/postcss`; there is no `tailwind.config.js`) | `^4.0.8` | 4.1.11 |
| Animation | Framer Motion (scroll reveals, menus, lightbox) | `^12.18.1` | 12.18.1 |
| Smooth scroll | Lenis (lazy-loaded, desktop only) | `^1.1.19` | 1.1.19 |
| CMS | Sanity, via `@sanity/client` and `@sanity/image-url` | `^6.28.2`, `^1.1.0` | 6.29.1, 1.1.0 |
| Icons | `lucide-react` | `^0.539.0` | 0.539.0 |
| Hosting and telemetry | Vercel, `@vercel/analytics`, `@vercel/speed-insights` | `^1.5.0`, `^1.2.0` | 1.5.0, 1.2.0 |
| Unit tests | Jest 29 + Testing Library + `jest-axe` (no tests exist yet) | `^29.7.0` | 29.7.0 |
| E2E tests | Playwright | `^1.49.1` | 1.53.2 |
| Lint | ESLint 9 flat config (`eslint.config.js`) with `eslint-config-next` | `^9.21.0` | 9.29.0 |

Dates are formatted with `Intl` in `src/components/events/format.ts` (no date library). `sharp` (`^0.35.5`) is a declared dependency because `src/app/_og/respond.ts` uses it to re-encode share images.

### Node.js

- Next.js 16 requires **Node 20.9 or newer** (`engines` in `node_modules/next/package.json`).
- Ad hoc tooling people tend to run against the project (`react-doctor`, `oxlint`) needs **Node 20.19 or newer**.
- Recommendation: **Node 22 LTS** everywhere (local, CI, Vercel). `.nvmrc` pins 22 for local tools (`nvm use`, `fnm use`). There is no `engines` field, so Vercel uses its project setting: set the Node.js version explicitly there (Project Settings, General).

### Package manager

**npm is the primary package manager.** `package-lock.json` is tracked and current (it resolves Next 16.3.8). `bun.lockb` is also tracked, a leftover from when the project was developed with Bun. It was resynced with `package.json` on 2026-10-07 (`bun install --lockfile-only`) but can drift again. `.gitignore` lists `bun.lockb`, yet the file is tracked (Git keeps tracking a file that was committed before an ignore rule was added).

Practical rules:

- Install with `npm install` (or `npm ci` for a clean, lockfile-exact install). Commit `package-lock.json` changes.
- Do not mix managers in one working tree. If you change dependencies, update `package-lock.json` with npm and then either resync `bun.lockb` (`bun install --lockfile-only`) or, once Vercel is confirmed to install with npm, delete `bun.lockb`.
- Check which install command Vercel actually runs (build log, or Project Settings, Build and Development). Vercel picks a package manager from the lockfiles it finds; with both lockfiles present, confirm it is using npm. Setting the Install Command to `npm ci` removes the ambiguity.

---

## 2. Repository map

```
.
├── docs/                      Documentation (this file, DESIGN.md, BRAND.md, CONTENT.md, README.md)
├── public/                    Static files served from the site root
│   ├── images/                logo-light.svg, logo-dark.svg, monogram.svg
│   │   ├── focus/             Clay/glass illustrations for the home "focus areas" (WebP)
│   │   └── illustrations/     Empty-state / page illustrations (WebP)
│   ├── og/                    PNG illustrations used only by the share-image renderer
│   ├── font/                  Poppins-Bold.ttf, Poppins-Regular.ttf (share-image fallback fonts)
│   ├── icons/, favicon.ico    Favicons and app icons
│   ├── og-thumbnail.png       Static fallback share banner
│   ├── help.html              Printable guide for NGO staff (see CONTENT.md)
│   └── robots.txt, sitemap.xml, site.webmanifest, browserconfig.xml
├── scripts/
│   └── generate-illustration.py   Brand illustration generator (see BRAND.md)
├── src/
│   ├── app/                   Routes (App Router): page.tsx, <Route>Client.tsx, opengraph-image.tsx
│   │   ├── _og/               Share-image rendering code (private folder, not routable)
│   │   └── api/revalidate/    Sanity webhook endpoint
│   ├── views/                 Page-level UI: Home, Impact (the /camp page), Gallery, Donations,
│   │                          Contact, Social, EventDetails
│   ├── components/            Shared components (Navbar, Footer, Hero, HeroShader, EventCard, ...)
│   │   ├── ui/                Section primitives (SectionHeader, Accent, Eyebrow, sectionItemVariants)
│   │   ├── contact/, donations/, events/, gallery/   Feature-specific pieces
│   ├── lib/                   Sanity client, GROQ, server data helpers, SEO and JSON-LD helpers
│   ├── services/              Browser-side Sanity helpers (pagination, fallbacks)
│   ├── hooks/                 useSmoothScroll
│   ├── context/               PageTransitionContext
│   ├── types/                 sanity.ts (document types)
│   └── styles/                globals.css (tokens + intro CSS), animations.css
├── tests/e2e/                 Playwright specs
├── eslint.config.js, jest.config.mjs, jest.setup.js, playwright.config.ts
├── next.config.mjs, postcss.config.mjs, tsconfig.json
└── .claude/launch.json        Dev/prod preview server definitions for Claude Code (not used by the app)
```

Other things you will find in the repo root: `Rudhirsetu User Mannual and Code Documentation.pdf` is a March 2025 print of the old README. It predates the Next.js and Sanity migration, so treat it as history, not documentation.

Import style: relative imports throughout. `tsconfig.json` defines an `@/*` alias for `src/*`, but no file uses it.

### What lives where

| Folder | Put here | Do not put here |
| --- | --- | --- |
| `src/app/<route>/` | `page.tsx` (server component: metadata, data fetch, JSON-LD), the thin `<Route>Client.tsx`, `opengraph-image.tsx` | UI markup |
| `src/views/` | The page UI. Imports components, receives data as props | Data fetching for first paint (do it in `page.tsx`) |
| `src/components/` | Reusable pieces; one folder per feature when a feature has more than one file | Page-specific copy |
| `src/lib/` | Pure helpers and server-side data access | React components |
| `src/services/` | Browser-side Sanity calls used for pagination and fallbacks | Anything needed for first render |

---

## 3. Routes and the page, client, view pattern

Each route follows the same three-layer shape:

```
src/app/<route>/page.tsx        server component: metadata, fetch data, JSON-LD
        │  props (serialisable data only)
        ▼
src/app/<route>/<Route>Client.tsx   'use client' wrapper, a few lines
        ▼
src/views/<View>.tsx            the actual page UI (Framer Motion, state, event handlers)
```

Why this shape:

- `page.tsx` stays a server component, so it can export `metadata`, call `generateMetadata`, fetch from Sanity with Next's data cache options, and ship the data in the initial HTML (good for SEO and LCP, no skeleton flash).
- The `*Client.tsx` wrapper is the client boundary. The view and everything it imports are therefore client components (they are still server-rendered to HTML on first load, then hydrated). `Home.tsx`, `Contact.tsx` and `Donations.tsx` have no `'use client'` of their own; they are client code because their wrapper is.
- Views stay free of data fetching for the first render. They take props, and fall back to a browser fetch only when the server fetch failed.

| Route | `page.tsx` | Client wrapper | View | Data (server) | Cache |
| --- | --- | --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | `src/app/HomeClient.tsx` | `src/views/Home.tsx` | 3 upcoming + 3 past event cards, featured gallery images, contact settings, via `src/lib/data.ts` | ISR 300 s + tags |
| `/camp` | `src/app/camp/page.tsx` | `src/app/camp/CampClient.tsx` | `src/views/Impact.tsx` | First page (6) of upcoming and of past events, plus totals. Later pages are fetched in the browser by `src/services/sanity-client.ts` | ISR 300 s + tag `event` |
| `/gallery` | `src/app/gallery/page.tsx` | `src/app/gallery/GalleryClient.tsx` | `src/views/Gallery.tsx` | All non-featured images and all featured images in one go; filtering and pagination (16 per page) happen in the browser | ISR 300 s + tag `galleryImage` |
| `/donations` | `src/app/donations/page.tsx` | `src/app/donations/DonationsClient.tsx` | `src/views/Donations.tsx` | Donation settings; the QR image URL is built on the server | ISR 300 s + tag `donationSettings` |
| `/contact` | `src/app/contact/page.tsx` | `src/app/contact/ContactClient.tsx` | `src/views/Contact.tsx` | Contact settings | ISR 300 s + tag `contactSettings` |
| `/social` | `src/app/social/page.tsx` | `src/app/social/SocialClient.tsx` | `src/views/Social.tsx` | Social media settings | ISR 300 s + tag `socialMediaSettings` |
| `/event/[id]` | `src/app/event/[id]/page.tsx` | `src/components/EventDetailsClient.tsx` (lives in `components/`, not `app/`) | `src/views/EventDetails.tsx` | One event by `_id` | `revalidate = 300`, tags `event` and `event-<id>` |
| 404 | `src/app/not-found.tsx`, `src/app/event/[id]/not-found.tsx` | none | `src/components/events/NotFoundState.tsx` | none | static |
| `/api/revalidate` | `src/app/api/revalidate/route.ts` | n/a | n/a | n/a | never cached |

Shared chrome is in `src/app/layout.tsx`: `Navbar` (client), `<main id="main-content">`, `Footer` (async server component), `SmoothScrollProvider`, `PageTransitionProvider`, Vercel `SpeedInsights` and `Analytics`, the inline intro script, and site-wide JSON-LD.

Naming quirk: the `/camp` route is rendered by `views/Impact.tsx` (the file kept its old name).

`PageTransitionContext` (`src/context/PageTransitionContext.tsx`): `EventCard` calls `startTransition` on click and delays `router.push` by 100 ms; `EventDetails` calls `endTransition` on mount and skips its entrance animation while a transition is flagged. The `layoutId` props in `EventDetails.tsx` have no matching `layoutId` on `EventCard`, so no shared-element morph actually happens; only the skip-entrance behaviour is live.

---

## 4. Data flow and caching

### 4.1 Overview

```
Sanity Content Lake
  ▲ publish                         │ GROQ over HTTPS (public dataset, API CDN, no token)
  │                                 ▼
Sanity webhook ──POST──►  /api/revalidate  ──revalidateTag / revalidatePath──►  Next.js cache
                                                                                   │
src/lib/data.ts, client.fetch(..., { next: { revalidate: 300, tags } })  ◄─────────┘
        │
        ▼
page.tsx (server)  ──props──►  <Route>Client.tsx  ──►  views/<View>.tsx
```

The Sanity dataset is **public and read without a token**. Only published documents are visible (the client has no `perspective` set and uses the CDN), so editors must press Publish in Studio.

### 4.2 The Sanity client: `src/lib/sanity.ts`

- `client = createClient({ projectId, dataset, apiVersion, useCdn: true })`, configured from the three `NEXT_PUBLIC_SANITY_*` variables (see [section 5](#5-environment-variables)). It is used on the server and in the browser.
- `urlFor(source)` returns an `@sanity/image-url` builder with `.auto('format')` already applied, so the Sanity CDN serves WebP or AVIF to browsers that accept them. Callers chain `.width()`, `.height()`, `.fit('max')` and so on. Chain `.format('jpg')` to override (the share-image code does, because Satori cannot decode WebP).
- Hotspot behaviour: `@sanity/image-url` applies the Studio crop and hotspot when **both** width and height are requested (`EventCard`, event hero, event gallery thumbnails). With width only (gallery tiles, carousels, lightboxes) it returns the whole Studio-cropped image.
- `src/lib/sanity.ts` also exports a `QUERIES` object. It is a second, older copy of the queries and is **not used**; the real one is `src/lib/queries.ts`.

### 4.3 GROQ queries: `src/lib/queries.ts`

One `QUERIES` object with explicit projections (only the fields the UI uses):

| Key | Returns |
| --- | --- |
| `upcomingEvents(page, pageSize)`, `pastEvents(page, pageSize)` | One page of events (upcoming sorted by `date asc`, past by `date desc`), full projection |
| `upcomingEventsCount`, `pastEventsCount` | `count(...)` for pagination |
| `featuredImages` | Gallery images with `isFeatured == true` |
| `galleryImages` | Gallery images with `!isFeatured` |
| `galleryImagesByCategory(category)` | Same, filtered; only used by an unused service. It interpolates the category into the query string, so never pass user input |
| `donationSettings`, `contactSettings`, `socialMediaSettings` | The singleton document (`[0]`) |

"Upcoming" is **a manual flag** (`isUpcoming`), not computed from the date. Nothing flips an event to "past" automatically; an editor must turn the flag off.

### 4.4 Server helpers: `src/lib/data.ts`

Used from server components. Every helper:

1. fetches through `sanityFetch`, which passes `next: { revalidate: 300, tags }` to the Sanity client so the response lands in Next's data cache;
2. never throws: it retries once after 400 ms, then logs `Sanity fetch failed (<tags>)` and returns `null` or `[]`, so a Sanity outage degrades to empty states instead of a 500;
3. is wrapped in React `cache()` so repeated calls in one render (layout plus page) share one request.

| Helper | Tag | Used by |
| --- | --- | --- |
| `getUpcomingEventCards(limit)`, `getPastEventCards(limit)` | `event` | Home. Lean projection (no `desc`, no `gallery`) so the home payload stays small |
| `getFeaturedImages()` | `galleryImage` | Home |
| `getContactSettings()` | `contactSettings` | Home, `getSiteSettings` |
| `getSocialMediaSettings()` | `socialMediaSettings` | `getSiteSettings` |
| `getDonationSettings()` | `donationSettings` | not currently used by a page |
| `getSiteSettings()` | `contactSettings`, `socialMediaSettings` | `Footer` (every page) |

Cache constants live in `src/lib/sanity-cache.ts` (dependency-free, safe for client code): `SANITY_REVALIDATE_SECONDS = 300`, `SANITY_TAGS` (one tag per Sanity `_type`) and `isSanityTag()`.

Only the home page and the footer use `lib/data.ts`. The other `page.tsx` files call `client.fetch` directly with the same options (`{ next: { revalidate: 300, tags: ['<type>'] } }`, literals repeated per file). Behaviour is identical; the pattern is just not consolidated yet.

### 4.5 Browser-side helpers: `src/services/sanity-client.ts`

`eventService`, `galleryService`, `settingsService`. They call the same client with the same cache options (ignored in the browser) and wrap errors so callers get `null`.

- `eventService.fetchUpcoming/fetchPast(page, pageSize)` is what `/camp` uses for pages 2 and up (and as a retry if the first server fetch failed). It retries up to 2 times with backoff.
- `settingsService.fetchSocialMedia()` is the fallback on `/social` when the server fetch returned nothing.
- `galleryService.*` and `settingsService.fetchDonation/fetchContact` are currently unused.
- `/gallery` and `/event/[id]` have inline browser fallbacks that call `client.fetch` directly.

Because these run in the visitor's browser, **the site's origins must be allowed in the Sanity project's CORS settings** (sanity.io/manage, project, API, CORS origins). The repo cannot verify this; check it whenever the production domain changes.

### 4.6 ISR, tags and the webhook

Pages are statically generated and refreshed with **Incremental Static Regeneration**:

- Time-based: every Sanity fetch declares `revalidate: 300`, so list and settings pages refresh at most 5 minutes after a change (the first visit after expiry serves the old copy and triggers a background rebuild, so the next visit shows the new one).
- On demand: every fetch is tagged with the document `_type` (`event`, `galleryImage`, `contactSettings`, `socialMediaSettings`, `donationSettings`), and event detail data is also tagged `event-<id>`. The webhook purges tags, which makes changes visible on the next page load instead of up to 5 minutes later. Pages inherit the tags of the fetches they use, so purging a tag also refreshes the pages that rendered it; the explicit `revalidatePath` calls in the route are an extra safeguard.

**Event detail pages** follow the same model: `src/app/event/[id]/page.tsx` sets `export const revalidate = 300` and tags its fetches `event` and `event-<id>`, so an edit appears within about 5 minutes even if a webhook delivery is missed. `generateStaticParams` prerenders every event that exists at build time; events created later are rendered on first request and then cached the same way.

#### What the webhook route does: `src/app/api/revalidate/route.ts`

`POST /api/revalidate` accepts the Sanity webhook. Authorisation is checked in this order; the first that passes wins and anything else returns `401 {"error":"Invalid secret"}`:

1. **Sanity's signed webhook**: header `sanity-webhook-signature: t=<timestamp>,v1=<base64url HMAC-SHA256 of "<t>.<raw body>">`, keyed with `SANITY_REVALIDATE_SECRET`. This is what Sanity sends when you set a Secret on the webhook. (The timestamp is not checked for freshness.)
2. **Plain shared secret in a header**: `x-sanity-secret`, `x-webhook-secret`, or `Authorization: Bearer <secret>`.
3. **Secret in the JSON body**: `{"secret": "..."}`.

Other responses: `500 {"error":"Server configuration error"}` when `SANITY_REVALIDATE_SECRET` is not set; `400` for invalid JSON; `200 {"revalidated":false,"message":...}` for a `_type` the site does not cache (including a payload with no `_type`); `200 {"revalidated":true,"tag":...,"paths":[...],"timestamp":...}` on success. Responses carry `Cache-Control: no-store`.

What each document type purges (`revalidateType` in the route; `{ expire: 0 }` means the entry is dropped immediately rather than served stale):

| `_type` | Tags purged | Paths revalidated |
| --- | --- | --- |
| `event` | `event`, plus `event-<id>` when the payload has an `_id` (a `drafts.` prefix is stripped) | `/event/<id>`, `/camp`, `/` (the event's share image, `event/[id]/opengraph-image`, uses the same tags and refreshes with them) |
| `galleryImage` | `galleryImage` | `/gallery`, `/` |
| `contactSettings` | `contactSettings` | `/contact`, `/` (the footer carries contact data on every page via its tag) |
| `socialMediaSettings` | `socialMediaSettings` | `/social` (the footer's social icons refresh through the tag) |
| `donationSettings` | `donationSettings` | `/donations` |

Manual trigger: `GET /api/revalidate?secret=<secret>&type=<event|galleryImage|contactSettings|socialMediaSettings|donationSettings>`, or `&eventId=<id>` for one event. Without `type` or `eventId` it returns a usage message after authenticating. The secret is in the URL, so it ends up in server and browser logs; prefer the POST form with a header for anything shared.

In production builds `console.log` is stripped (see [section 7](#7-http-headers-and-caching-nextconfigmjs)), so the route's "Revalidated" log line will not appear in Vercel logs. Use the response body in Sanity's webhook attempt log, or `console.warn`/`console.error` output (kept), to debug.

#### Sanity webhook setup (exact steps)

1. **Create a secret**: a long random string, for example `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. **Set `SANITY_REVALIDATE_SECRET`** to that value in Vercel (Project, Settings, Environment Variables), for Production (and Preview if previews should receive webhooks). Redeploy so the new deployment sees it. Locally, put it in `.env.local`.
3. In **sanity.io/manage**, open the project, then **API, Webhooks, Create webhook** (menu labels can shift slightly between Sanity UI versions) and fill in:

   | Field | Value |
   | --- | --- |
   | Name | `Revalidate website` (anything) |
   | URL | `https://www.rudhirsetu.org/api/revalidate` (use the production domain; one webhook per environment) |
   | Dataset | `production` (the dataset named in `NEXT_PUBLIC_SANITY_DATASET`) |
   | Trigger on | Create, Update, Delete |
   | Filter | `_type in ["event", "galleryImage", "contactSettings", "socialMediaSettings", "donationSettings"]` |
   | Projection | `{_id, _type}` |
   | HTTP method | `POST` |
   | Drafts | off (published changes only) |
   | Secret | the exact value of `SANITY_REVALIDATE_SECRET` |

   With a Secret set, Sanity signs each request (`sanity-webhook-signature`), which method 1 above verifies. Alternatively leave Secret empty and add an HTTP header `x-sanity-secret: <secret>` (method 2).
4. **Test it**: publish a harmless edit and open the webhook's attempt log in Sanity (expect HTTP 200 and `"revalidated": true`), or send a request by hand:

   ```bash
   curl -i -X POST https://www.rudhirsetu.org/api/revalidate \
     -H "x-sanity-secret: $SANITY_REVALIDATE_SECRET" \
     -H "content-type: application/json" \
     -d '{"_type":"contactSettings","_id":"test"}'
   ```
5. When you add a content type, extend the **Filter** and the route (see [13.2](#132-add-a-sanity-content-type-end-to-end)). The route's own doc comment lists the filter; keep the two in sync.
6. Check that **delete** events deliver a `_type`. If a payload has none, the route answers `revalidated:false` and nothing is purged; use the manual GET trigger for that case.

---

## 5. Environment variables

Local development reads `.env.local` (and `.env`); both are git-ignored (`.gitignore` ignores `.env*`; only `.env.example` is force-tracked). Variables prefixed `NEXT_PUBLIC_` are **inlined into the bundle at build time**: changing one on Vercel needs a new build, and nothing secret may use that prefix.

| Variable | Scope | Required | If unset | Used in | Purpose |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | build and browser | yes | `''`, and `createClient` then throws `Configuration must contain projectId` when `src/lib/sanity.ts` is imported, so `next dev` and `next build` fail | `src/lib/sanity.ts` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | build and browser | no | `production` | `src/lib/sanity.ts` | Dataset (must be public) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | build and browser | no | `2023-05-03` in code (`.env.example` suggests `2024-03-14`) | `src/lib/sanity.ts` | GROQ API version |
| `NEXT_PUBLIC_BASE_URL` | build and browser | recommended per environment | `https://www.rudhirsetu.org` | `src/lib/seo.ts` (`SITE_URL`: `metadataBase`, canonical and Open Graph URLs, share-image asset fallback), `baseUrl` in several `page.tsx` files | Canonical origin. Set it per environment so previews and staging do not advertise production URLs. No trailing slash needed (it is stripped) |
| `SANITY_REVALIDATE_SECRET` | server only | yes in production | `/api/revalidate` answers 500 | `src/app/api/revalidate/route.ts` | Webhook shared secret (see 4.6) |
| `NEXT_PUBLIC_SHOW_DEV_WARNING` | build | no | banner hidden | `src/app/layout.tsx`, `src/components/DevelopmentWarning.tsx` | `true` shows a "Development version" banner. Use on staging only |
| `NODE_ENV` | set by Next | n/a | n/a | `next.config.mjs` | Turns on the production-only cache headers and `removeConsole` |
| `NEXT_PHASE` | set by Next | n/a | n/a | `src/app/_og/assets.ts` | Detects `next build` to allow longer network timeouts for share images |
| `CI` | CI only | n/a | n/a | `playwright.config.ts` | Retries, single worker, no server reuse |

`.env.example` lists every variable with comments. Copy it to `.env.local` and fill in real values:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-14
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SANITY_REVALIDATE_SECRET=any-long-random-string
# NEXT_PUBLIC_SHOW_DEV_WARNING=true
```

Never commit real values, and never print them in logs or docs.

---

## 6. Rendering and performance architecture

These are **measured decisions**, not preferences. Each paragraph says what the code does and why; do not undo one without re-measuring (Chrome DevTools Performance and Firefox Profiler on `/` and `/camp`).

### 6.1 Home intro curtain and hero entrance are pure CSS

Files: `src/app/layout.tsx` (inline script), `src/styles/globals.css` ("Home intro" block), `src/components/LoadingScreen.tsx`, `src/components/Hero.tsx`, `src/app/HomeClient.tsx`.

How it works:

1. `layout.tsx` puts an inline `<script>` (`INTRO_SCRIPT`) in `<head>`, so it runs before first paint. If the page is `/` and `sessionStorage` has no `hasVisitedHome`, it sets that key, adds the class `intro` to `<html>`, drives the 0 to 100 counter (`.intro-count`) and progress bar (`.intro-bar`) with a short `requestAnimationFrame` loop (900 ms, eased), and removes `intro` again after 2400 ms. It wraps everything in `try/catch` so storage errors (private mode) just skip the intro.
2. `LoadingScreen` is always server-rendered on `/`, but `.intro-curtain` is `display: none` unless `html.intro` is set, so there is no flash and no hydration wait.
3. The curtain lifts with a CSS animation (`intro-lift`) after `--intro-reveal` (1050 ms). The hero text uses the CSS animation `hero-rise` (staggered by the `--i` custom property set in `Hero.tsx`); under `html.intro` its delay is shifted by `--intro-reveal`.
4. `hero-rise` starts from `opacity: 0.001`, not `0`, so the headline is painted and counted for Largest Contentful Paint on the first frame.
5. `prefers-reduced-motion`: the hero animation and logo animation are disabled and the curtain fades instead of sliding.
6. Only the number count-ups need JavaScript: `HomeClient` waits `LOADING_REVEAL_MS + 200` ms if `html.intro` is present, then flips `heroAnimationsReady`.

Why: the hero used to be animated from JavaScript, so its text could not paint until the bundle had loaded and hydrated. Moving the entrance to CSS made the hero paint on the first frame; measured LCP went from about **2.4 s to about 0.2 to 0.6 s**.

Rules: `LOADING_REVEAL_MS` in `LoadingScreen.tsx` must equal `--intro-reveal` in `globals.css`. Do not move the intro or hero entrance back into Framer Motion. The intro plays only on a full page load of `/` that is the first of the session; client-side navigation back to `/` never replays it. `<html>` has `suppressHydrationWarning` because the script changes its class before React hydrates.

### 6.2 Hero background: `src/components/HeroShader.tsx`

Raw **WebGL 1**, no library. It replaced an `ogl`-based shader (the library is gone from `package.json`). A full-screen triangle runs a fragment shader that draws slow-moving crimson "silk" (trig-warped height field lit like fabric, a soft heartbeat wash, optional pointer sheen, dithering against banding). Behaviours worth knowing:

- **Low resolution on purpose.** The image is low-frequency, so it is shaded at `0.55x` the CSS pixel size (`BASE_SCALE`), `0.4x` on low-end devices (`hardwareConcurrency <= 4` or `deviceMemory <= 4`), and never above 900,000 pixels (`MAX_PIXELS`). The canvas is then stretched by CSS.
- **Adaptive quality.** If more than 45 frames arrive late (about 1.6 times the frame budget), the scale drops by 20 percent steps down to `0.28x` (`MIN_SCALE`); as a last resort the loop drops from 60 fps to 30 fps. Low-end devices start at 30 fps.
- **Pauses** when scrolled offscreen (`IntersectionObserver`) and when the tab is hidden (`visibilitychange`).
- **Reduced motion:** renders one still frame (`STATIC_TIME`) and never starts the loop; reacts if the preference changes.
- **Context loss** (iOS drops contexts in the background): `webglcontextlost` is cancelled so the browser may restore, and `webglcontextrestored` re-initialises.
- **Fallback:** the container has a CSS radial-gradient background; the canvas fades in only after the first successful draw. If WebGL or the shader fails, you simply keep the gradient (a `console.warn` is logged).
- Initialisation is deferred to `requestIdleCallback` (700 ms timeout, `setTimeout` fallback), so first paint and hydration win. `powerPreference: 'low-power'`, no antialiasing, no depth buffer. The pointer sheen is enabled only for `(hover: hover) and (pointer: fine)`.
- One canvas per page, maximum (see DESIGN.md). Third-party shader libraries were evaluated and rejected: they were WebGPU-only (blank on many Safari, Firefox and Android devices) and about 100 KB gzipped.

### 6.3 No `backdrop-filter`, transform-only reveals

Measured in Firefox on `/camp`: `backdrop-filter` (blurred pills and the fixed navbar over scrolling content) and opacity fades on containers holding rounded, clipped images made Firefox re-render those layers every frame while scrolling. Removing them took the profile from **14 to 16 janky frames to 0**.

- No `backdrop-filter` / `backdrop-blur` anywhere (the navbar pill in `src/components/Navbar.tsx` is near-opaque `bg-white/95`). Glows are `radial-gradient` backgrounds, not `blur-*` filters.
- Scroll-reveal variants (`sectionItemVariants` in `src/components/ui/Section.tsx`) animate **only `y`**, never `opacity`. Reuse that export for new sections. Because the variants are transform-only, `MotionConfig reducedMotion="user"` effectively turns them off for users who ask for less motion.

### 6.4 Lenis smooth scroll: `src/hooks/useSmoothScroll.ts`

`SmoothScrollProvider` calls the hook once from the root layout. It starts Lenis only for visitors with a mouse or trackpad (`(pointer: coarse), (hover: none)` is false) who have not requested reduced motion. It is imported lazily (`import('lenis')`), so phones, tablets and reduced-motion users never download it, and native scrolling (momentum, rubber banding, overscroll) is left untouched. The hook re-evaluates when either media query changes and destroys the instance on unmount; it falls back to `addListener` where `MediaQueryList.addEventListener` is missing (Safari before 14). Overlays opt out with `data-lenis-prevent` (mobile menu, lightbox, intro curtain). `globals.css` makes iframes inside `.lenis-smooth` ignore pointer events so maps cannot trap the wheel; `LazyMap` re-enables them on request.

### 6.5 Footer is an async server component

`src/components/Footer.tsx` calls `getSiteSettings()` on the server (contact and social data, cached and tagged), so the footer ships no client JavaScript and never "pops in" after load. It is rendered by the server layout and passed as a child into the client providers, which is allowed.

### 6.6 Maps

- `src/lib/maps.ts` (`safeMapsEmbedUrl`): the map URL comes from the CMS, so only `https` URLs on a Google hostname (`google.<tld>`, optionally `www.` or `maps.`) whose path starts with `/maps/embed` (or `/maps` with `output=embed`) are accepted. Anything else yields `null` and the page shows a "Map not available" state. This stops a mistaken or malicious CMS value from framing another site.
- `src/components/contact/LazyMap.tsx` (used on `/contact`): the iframe mounts only when the frame is within 200 px of the viewport, is `sandbox`ed (`allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`), `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, and starts with `pointer-events: none` so it cannot trap touch or wheel scrolling; the "Explore map" button opts in and "Done" opts out.
- The home page (`src/views/Home.tsx`) has its own inline version (IntersectionObserver, same sandbox). If the URL is invalid there, the placeholder says "Map unavailable".

### 6.7 Structured data (JSON-LD) is escaped

Page-level JSON-LD is serialised with `JSON.stringify(data).replace(/</g, '\\u003c')` so CMS text can never close the `<script>` tag (see `src/app/event/[id]/page.tsx`, which embeds CMS-supplied event fields, and the other `page.tsx` files). The site-wide graph in `layout.tsx` comes from the static `src/lib/site-structured-data.ts` and is serialised once at module load without escaping (it holds no CMS data).

### 6.8 Images

- Sanity images are plain `<img>` tags pointing at `cdn.sanity.io` through `urlFor(...)`. The Sanity CDN does the resizing and the WebP/AVIF negotiation. **`next/image` is not used anywhere**, so the `images` block in `next.config.mjs` is currently inert (kept in case `next/image` is adopted). `layout.tsx` adds `<link rel="preconnect" href="https://cdn.sanity.io">`.
- Every image has explicit `width`/`height` or an aspect-ratio box (`getImageRatio` in `src/components/gallery/image-utils.ts` reads the ratio out of the Sanity asset id and applies the editor crop), so there is no layout shift.
- Responsive `srcSet` widths: gallery thumbnails `400/640/960` (`GalleryGrid.tsx`), featured carousel `800/1200/1600` and lightbox `1600` (`GalleryComponents.tsx`), event hero `800/1200/1600` and poster `640/960/1200` (capped at the source width by `responsiveWidths` in `EventDetails.tsx`), event cards `800x450`, QR code `576` wide (`donations/page.tsx`).
- Only above-the-fold images are eager (`priority` on the first carousel slide, `eagerCount` on the gallery grid); the rest are `loading="lazy"`. Local illustrations are WebP, roughly 20 to 100 KB each.

### 6.9 Fonts

`next/font/google` in `src/app/layout.tsx` self-hosts Plus Jakarta Sans (400 to 700), Bricolage Grotesque (500 to 700) and Pacifico (400) with `display: 'swap'`, exposing them as CSS variables (`--font-jakarta`, `--font-bricolage`, `--font-pacifico`) that `@theme` in `globals.css` maps to `font-sans`, `font-display` and `font-script`. No preconnect to Google Fonts is needed. `next build` downloads the font files, so it needs network access.

### 6.10 Navigation and prefetching

`PreloadLink` (`src/components/PreloadLink.tsx`) is a thin wrapper over `next/link`. An earlier version injected extra `<link rel="prefetch">` tags on hover; that duplicated what `next/link` already does and did nothing on touch devices, so it was removed. `priority="high"` requests a full prefetch as soon as the link is in view; everything else uses Next's default. The `preloadDelay` prop is deprecated and ignored.

### 6.11 Bundle hygiene

`experimental.optimizePackageImports` for `lucide-react` and `framer-motion`; `compiler.removeConsole` in production (keeps `console.error` and `console.warn`); `npm run analyze` runs Next's bundle analyzer. Keep new client-side libraries out unless CSS cannot do the job (DESIGN.md).

---

## 7. HTTP headers and caching (`next.config.mjs`)

All responses get security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (the site cannot be embedded in an iframe), `X-XSS-Protection`, `X-DNS-Prefetch-Control: on`, `Strict-Transport-Security` (1 year, includeSubDomains) and `Referrer-Policy: strict-origin-when-cross-origin`. There is no Content-Security-Policy.

Cache rules are added **in production only** (`NODE_ENV === 'production'`):

| Path | `Cache-Control` | Why |
| --- | --- | --- |
| `/_next/static/**` | Next's default, `public, max-age=31536000, immutable` | File names are content-hashed, so no custom rule is needed |
| `/images/**`, `/icons/**`, `/favicon.ico`, `/og-thumbnail.png` | `public, max-age=86400, stale-while-revalidate=604800` | These keep their name when replaced, so they must not be `immutable`: cache for a day, serve stale for a week while revalidating |
| `/font/**` | `public, max-age=31536000, immutable` | Poppins files used as the share-image fallback font; they never change |
| `/api/revalidate` | `no-store`, set by the route itself | Never cache webhook responses |
| Share images (`opengraph-image`) | Set by Next and by `src/app/_og/respond.ts` | Prerendered files are served by Next itself (section 9.3) |

**Why the old blanket `immutable` rule is gone:** an earlier version of this file applied a long-lived `immutable` header to broad static paths. In `next dev` the chunk URLs are not content-hashed, so browsers kept serving stale JavaScript and CSS after edits, and un-hashed files in `public/` would stay pinned for a year after being replaced. Production-only rules limited to the paths above remove both problems.

Other options: `compress: true`, `poweredByHeader: false`, `typescript.ignoreBuildErrors: false` (type errors fail the build), `images.remotePatterns` for `cdn.sanity.io` and related image settings (inert, see 6.8), and `compiler.removeConsole` in production.

---

## 8. Cross-browser support policy

The site must work in **Chrome, Firefox, Safari (macOS and iOS) and Android browsers**. The full rule list is in [DESIGN.md, "Cross-browser requirements"](./DESIGN.md#cross-browser-requirements). In short:

- `svh`/`dvh` units always come with a `vh` fallback; `overflow: clip` is used on the home root so the sticky column works.
- No `backdrop-filter`, no big `blur-*` glows; `radial-gradient` instead.
- Hover is never required for function. Form inputs (if added) need at least 16 px text to stop iOS zoom.
- Clipboard falls back to `execCommand('copy')` (`src/components/donations/DetailRow.tsx`).
- Feature-detect instead of assuming: `matchMedia().addListener` fallback for Safari before 14, `IntersectionObserver`/`ResizeObserver` guards, `useSyncExternalStore` so `UpiPayButton` renders nothing on the server and during hydration (a `upi://` link only helps on touch devices), `inert` on hidden carousel slides.
- The first-party WebGL is WebGL 1 only, with a CSS fallback.
- Verify with the Playwright projects `firefox`, `webkit`, `Mobile Safari` and `Mobile Chrome` (section 11), and on a real iPhone for anything involving scroll locking, viewport units or the menu.

---

## 9. SEO and social sharing

### 9.1 Metadata pattern

- **Root layout** (`src/app/layout.tsx`): `metadataBase` from `SITE_URL`; `title.default` (the long home title) and `title.template: '%s | Rudhirsetu Seva Sanstha'`; default description, keywords, robots (index, follow, large previews), Open Graph and Twitter defaults, icons, manifest, theme colour `#450a0a` (viewport).
- **Per page**, `page.tsx` exports `metadata` built with `buildMetadata()` from `src/lib/seo.ts`, then adds page-specific `keywords`, `robots` and `other` fields:
  - Page titles are given **without** the site suffix (`title: 'Our Camps'`); the root template appends ` | Rudhirsetu Seva Sanstha`.
  - The home page is the exception: it passes `title: { absolute: '...' }` so the template is skipped.
  - `buildMetadata` fills `alternates.canonical`, `openGraph` (type, site name, locale `en_IN`, url, title, description) and `twitter` (`summary_large_image`). The share title defaults to `"<title> | Rudhirsetu Seva Sanstha"`.
  - Omit `path` for pages that must not declare a URL (the 404 page does this and is `noindex`).
  - `/event/[id]` builds its metadata in `generateMetadata`: title is the event title, description is the IST date and place plus the short description (truncated to 200 characters), `type: 'article'`.
- **Never set `openGraph.images` or `twitter.images`** in a page's metadata: that would override the `opengraph-image` file convention (see 9.3).
- Hard-coded extras you may trip over: `contact/page.tsx` embeds a contact email and phone in `other` metadata, and `page.tsx` files repeat `process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rudhirsetu.org'` locally.

### 9.2 Structured data (JSON-LD)

- Site-wide, in `<head>` of every page: `src/lib/site-structured-data.ts` (an `@graph` with the `NGO` organisation, `WebSite`, home `WebPage`, `BreadcrumbList` and a services `ItemList`). Rendered from `layout.tsx`.
- Per page: constants in `src/lib/structured-data.ts` (`CampPageData`, `ContactPageData`, `DonationsPageData`, `GalleryPageData`, `SocialPageData`), each rendered by its `page.tsx` as an escaped `<script type="application/ld+json">`. `/event/[id]` builds a schema.org `Event` from the CMS data inline.
- All of these use the literal `https://www.rudhirsetu.org` in URLs and ids, not `SITE_URL`.
- `src/lib/seo.ts` still exports legacy SPA-era helpers (`updatePageSEO`, `pageSEOConfigs`, `generateBreadcrumbStructuredData`, `generateEventStructuredData`). Nothing uses them.

### 9.3 Open Graph images

> **verify: recently changed.** This area was still being edited while this document was written. The files in `src/app/_og/` and the `opengraph-image.tsx` files are untracked in Git as of 2026-10-07, and the earlier `/api/og` image routes (with their cache rule in `next.config.mjs` and path in the webhook route) were removed in the same change. Re-read the code before trusting the details below.

**Mechanism (Next.js file convention).** Each route that has a share image contains `opengraph-image.tsx`: `src/app/opengraph-image.tsx` (home), `camp/`, `gallery/`, `social/`, `donations/`, `contact/` and `event/[id]/`. Next renders it, adds the absolute `og:image` (with type, size and `alt`) and copies it to `twitter:image`, resolving URLs against `metadataBase`. Pages therefore must not set `openGraph.images`.

**Rendering code** (all in `src/app/_og/`):

| File | Role |
| --- | --- |
| `preset-image.tsx` | `createPresetImage(route)` builds the default export for a fixed page |
| `presets.ts` | Copy and illustration for each preset (`home`, `camp`, `gallery`, `social`, `donations`, `contact`; the `OgRoute` type is in `src/lib/seo.ts`). Text is fixed on the server, so the image cannot be used to print arbitrary text. Routes without their own image (404, anything new) inherit the home one |
| `card.tsx` | The Satori layouts (1200 by 630): `PresetCard` and `EventCard`. Maroon surface, crimson glow, Bricolage headline with one Pacifico accent word |
| `event-image.tsx` | `renderEventImage(id)` (queries the event, fetches its photo as a JPEG, builds the card) and `getEventIds()` for `generateStaticParams`. `toLatinText` drops non-Latin characters (for example Devanagari) from the title and location, because Satori cannot shape them |
| `fonts.ts` | Fetches the three brand faces from Google Fonts as tiny glyph-subset TrueType files, cached per process; falls back to the local Poppins files in `public/font/` when Google Fonts is unreachable or slow. Sets `degraded` when a brand font is missing |
| `assets.ts` | Reads illustrations (`public/og/*.png`), the logo (`public/images/logo-light.svg`), fallback fonts and the fallback banner (`public/og-thumbnail.png`) from disk, falling back to an HTTP fetch of the site's own origin; shorter timeouts at request time than at build time |
| `respond.ts` | Renders the image, **re-encodes the PNG as a progressive 4:4:4 JPEG with `sharp`**, lowering quality (86, 80, 74, 68, 60) until it is at most 150,000 bytes (`TARGET_BYTES`; typically 60 to 140 KB), and sets `Cache-Control`. On any failure serves the static banner |

**Size budget:** each image must stay **below 600 KB** (WhatsApp drops larger previews); the target is **300 KB or less**. The encoder aims for about 150 KB (`TARGET_BYTES`), because Satori's lossless PNG output (150 to 400 KB) is too heavy. Check sizes after any design change (see "Verify" below).

**Prebuilt at build time** where possible, so crawlers get a static JPEG with no cold start and cannot time out on a slow render: the preset routes have no dynamic input and are prerendered by `next build`; event images are prerendered for every event returned by `generateStaticParams` (new events render on first request). `revalidate` is `86400` for presets (also repairs an image built while Google Fonts was unreachable) and `300` for events, with the fetch tagged `event` and `event-<id>` so the webhook refreshes them.

**Behaviour for events:** the headline is the part of the title before a separator (` | `, an en or em dash, ` <> `, or ` · `), if that part is at least 14 characters, because the date and venue get their own rows. Only Latin text is drawn: an event whose title has no Latin letters or digits gets the headline "Rudhirsetu event" (the page title and description keep the full text). Dates are always India time. The photo is requested from the Sanity CDN as a JPEG (Satori cannot read WebP or AVIF), sized to its own aspect ratio (clamped, maximum 420 px side). With no usable photo a calendar illustration is drawn.

**Cache and failure behaviour:** `respond.ts` defines `CACHE_PRESET` (1 hour browser, 1 day shared, stale for 1 week), `CACHE_EVENT` (5 minutes browser, 1 hour shared) and `CACHE_DEGRADED` (60 seconds) used when a brand font, the logo or the event photo could not be loaded.

**Fallback banner:** `public/og-thumbnail.png` is served (with a short cache) when a dynamic image cannot be rendered at all. It is also the `ogImage` value in the unused `pageSEOConfigs` in `src/lib/seo.ts`.

**Verify a share image** (take the URL from the page's `og:image` tag, and replace `<url>`):

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type} %{size_download} bytes\n" "<url>"
```

Then paste the page URL into a link-preview debugger (Facebook Sharing Debugger, LinkedIn Post Inspector) and send it to yourself on WhatsApp. Platforms cache previews for days; use their re-scrape tools after changes.

Design reference for the image look: [BRAND.md section 10, "Social and share images"](./BRAND.md).

### 9.4 Sitemap, robots and manifest

- `public/sitemap.xml` is a **static, hand-maintained file** listing `/`, `/donations`, `/camp`, `/contact`, `/gallery` and `/social` (all `lastmod` 2025-06-29). It does not list `/event/[id]` pages. `layout.tsx` also links it with `<link rel="sitemap">`.
- `public/robots.txt` allows everything and points to the sitemap.
- `public/site.webmanifest` and `public/browserconfig.xml` handle app icons. Their theme/tile colour (`#450a0a`) matches the layout's `themeColor`; keep the three in sync.

---

## 10. Accessibility

What is implemented (keep it that way when adding UI):

- **Skip link:** the first focusable element is "Skip to content" in `Navbar.tsx` (hidden until focused). It targets `#main-content`, the `<main id="main-content" tabIndex={-1}>` in `layout.tsx`, and moves focus there.
- **Focus traps and focus return:** the mobile menu (`Navbar.tsx`) and the photo lightbox (`ImageLightbox` in `GalleryComponents.tsx`) are `role="dialog" aria-modal="true"`, move focus in on open, trap Tab and Shift+Tab, close on Escape (the lightbox also uses the arrow keys), restore focus to the opener on close and lock page scroll while open.
- **Reduced motion:** `MotionConfig reducedMotion="user"` wraps Navbar and every view. `CountUp` shows final values, the intro CSS animations switch off, the hero shader draws a still frame, the carousel does not autoplay and Lenis is not started.
- **Carousel semantics:** `role="region"`, `aria-roledescription="carousel"`, per-slide groups with "n of N", `inert` on inactive slides, autoplay paused on hover, focus and when offscreen.
- **Decorative imagery** uses `alt=""` plus `aria-hidden="true"`; meaningful images use CMS alt text with fallbacks (`imageAlt` in `image-utils.ts`).
- **Touch targets** of at least 44 px for controls (see the `h-11 w-11` buttons), visible `focus-visible` outlines throughout, `aria-current` on the active nav link, `aria-live` regions for pagination counts, external links announce "(opens in a new tab)".
- Headings: each page has a single `h1` (via `SectionHeader as="h1"` on inner pages, the hero on home).

---

## 11. Scripts and testing

| Script | Command | Notes |
| --- | --- | --- |
| `npm run dev` | `next dev` | Turbopack. Dev build output goes to `.next/dev` |
| `npm run build` | `next build` | Fails on type errors. Needs network (Google Fonts, Sanity, share-image fonts) |
| `npm start` | `next start` | Serves the production build |
| `npm run lint` | `eslint .` | Flat config in `eslint.config.js` (`next/core-web-vitals` and `next/typescript`; `@next/next/no-img-element` and `jsx-a11y/alt-text` are off) |
| `npm run analyze` | `next experimental-analyze` | Turbopack bundle analyzer |
| `npm test` | `jest` | **No Jest tests exist**, so it finds nothing |
| `npm run test:watch`, `npm run test:coverage` | `jest --watch`, `jest --coverage` | Coverage output goes to `coverage/` |
| `npm run test:e2e` | `playwright test` | See below |
| `npm run test:e2e:ui` | `playwright test --ui` | Interactive runner |
| `npm run test:a11y` | `jest --testPathPattern=accessibility` | Matches no files today |

There is no `typecheck` script; use `npx tsc --noEmit`.

### Jest

`jest.config.mjs` uses `next/jest`, the `jsdom` environment, `jest.setup.js` for setup, `testMatch` of `__tests__/**` and `*.test|spec.*`, and ignores `.next/`, `node_modules/` and `tests/e2e/`. `jest.setup.js` mocks `next/navigation`, `next/image`, `framer-motion` (only `motion.div/section/h1/h2/p`, `AnimatePresence`, `useScroll`, `useTransform`) and `IntersectionObserver`. That framer-motion mock is too small for the real views (they use `motion.article`, `motion.li`, `MotionConfig`, `useInView`, `useSpring` and more), so extend it before writing view tests. `jest-axe` is installed for accessibility assertions.

### Playwright

`playwright.config.ts`: tests in `tests/e2e`, `baseURL` `http://localhost:3000`, and a `webServer` that runs `npm run dev` (reusing a running server outside CI). Projects: `chromium`, `firefox`, `webkit`, `Mobile Chrome` (Pixel 5), `Mobile Safari` (iPhone 12). Reporter: HTML (`playwright-report/`, git-ignored).

- Run `npx playwright install` once per machine (and after upgrading Playwright) to download the browsers; add `--with-deps` on Linux CI.
- Specs hit the real dev server and the real Sanity dataset, so they need `.env.local` and network access.
- `tests/e2e/donation-flow.spec.ts` has a **pre-existing strict-mode failure**: `page.getByText(/donate/i)` matches several elements on `/donations`. Scope it (for example `getByRole('heading', ...)`).
- `tests/e2e/seo-accessibility.spec.ts` has assertions that conflict with the current markup: the "alt tags" test requires every `<img>` to have an alt longer than 3 characters, but decorative images deliberately use `alt=""`; the `og:image` check expects the host to contain `rudhirsetu.org`, which depends on `NEXT_PUBLIC_BASE_URL`; the structured-data test reads one `script[type="application/ld+json"]` with `.textContent()`, which fails (strict mode) as soon as the page has more than one JSON-LD script. Treat the e2e suite as a starting point, not a gate.

---

## 12. Deployment on Vercel

The site is deployed from the Git repository on Vercel (framework preset Next.js, default build command `next build`, output handled by Vercel).

1. **Project settings**: Node.js version 22.x; confirm the install step uses npm (see [section 1](#package-manager)).
2. **Environment variables** (Production, and Preview where sensible): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_BASE_URL` (the real origin of that environment), `SANITY_REVALIDATE_SECRET`; `NEXT_PUBLIC_SHOW_DEV_WARNING=true` on staging only. `NEXT_PUBLIC_*` changes need a redeploy.
3. **Sanity**: create the webhook ([4.6](#46-isr-tags-and-the-webhook)); add the production (and staging) origins to the project's CORS origins ([4.5](#45-browser-side-helpers-srcservicessanity-clientts)).
4. **Analytics**: `<Analytics />` and `<SpeedInsights />` are in `layout.tsx`, but data is collected only when Analytics and Speed Insights are enabled for the project in the Vercel dashboard.
5. **Build behaviour to expect**: `next build` fetches Sanity (event ids for `generateStaticParams` and event share images) and Google Fonts (share images, `next/font`). If Sanity is unreachable the build still succeeds with empty lists (a `console.error` is logged) and event pages are generated on first request; check the build log for `Error generating static params`, `Error listing events for share images` and `Sanity fetch failed`.
6. **After a deploy**: open `/`, a camp page and `/event/<some id>`; confirm the share image URL returns a JPEG under 600 KB ([9.3](#93-open-graph-images)); publish a trivial change in Studio and confirm the webhook returns 200.

**`_vercel/insights` 404s locally:** `@vercel/analytics` and `@vercel/speed-insights` request `/_vercel/insights/...` and `/_vercel/speed-insights/...`. Those endpoints exist only on Vercel deployments with the features enabled, so `next dev` and `next start` log 404s for them. They are harmless.

---

## 13. How to ...

### 13.1 Add a new page

1. **Read [DESIGN.md](./DESIGN.md)** first: tokens, `SectionHeader`, ledger rows, one script accent word per heading, transform-only reveals, no `backdrop-filter`.
2. **Create the route** `src/app/<route>/page.tsx` as a server component. Use `buildMetadata` (title without suffix, description, `path`), add page-specific `keywords` and `robots`, fetch data with a helper from `src/lib/data.ts`, and pass plain props to the client wrapper:

   ```tsx
   // src/app/volunteer/page.tsx
   import type { Metadata } from 'next';
   import VolunteerClient from './VolunteerClient';
   import { buildMetadata } from '../../lib/seo';
   import { getVolunteerSettings } from '../../lib/data'; // see 13.2

   export const metadata: Metadata = {
     ...buildMetadata({
       title: 'Volunteer',
       description: 'How to volunteer with Rudhirsetu Seva Sanstha.',
       path: '/volunteer',
     }),
     robots: { index: true, follow: true },
   };

   export default async function VolunteerPage() {
     const settings = await getVolunteerSettings();
     return <VolunteerClient settings={settings} />;
   }
   ```
3. **Create the wrapper** `src/app/<route>/<Route>Client.tsx` (`'use client'`, renders the view with the props) and **the view** `src/views/<View>.tsx`. Start the page with `pt-32 sm:pt-36 lg:pt-40` to clear the fixed navbar, use `SectionHeader as="h1"`, wrap in `<MotionConfig reducedMotion="user">`, and reveal with `sectionItemVariants`. Check it at 375 px.
4. **Optional JSON-LD:** add a constant to `src/lib/structured-data.ts` and render it with the escape (`JSON.stringify(data).replace(/</g, '\\u003c')`).
5. **Wire it into navigation:** `NAV_ITEMS` in `src/components/Navbar.tsx` and `quickLinks` in `src/components/Footer.tsx`; add it to the breadcrumb list in `src/lib/site-structured-data.ts` if it is a top-level page.
6. **Add it to `public/sitemap.xml`.**
7. **Share image** (verify: recently changed): add the route to the `OgRoute` type in `src/lib/seo.ts`, a preset in `src/app/_og/presets.ts` (with an illustration, see 13.3), and `src/app/<route>/opengraph-image.tsx` copied from a sibling (`createPresetImage('<route>')`).
8. **If the page shows CMS data:** add a content type (13.2) or reuse an existing tag so the webhook refreshes it.
9. **Test:** run it in Chrome and Firefox at desktop and 375 px, keyboard-tab through it, and try `prefers-reduced-motion`.

### 13.2 Add a Sanity content type end to end

The Sanity **schema lives in the separate Studio project**, deployed at https://rudhirsetu.sanity.studio, not in this repository. The steps that touch this repo:

1. **Schema (Studio project):** define the document type (use a singleton for settings), deploy Studio, and create a published test document. Field names there must match the TypeScript types and GROQ below.
2. **Types:** add an interface to `src/types/sanity.ts` (extend `SanityDocument`).
3. **Cache tag:** add the type name to `SANITY_TAGS` in `src/lib/sanity-cache.ts`. `SanityTag` and `isSanityTag()` pick it up automatically.
4. **Query:** add an entry with an explicit projection to `QUERIES` in `src/lib/queries.ts` (`*[_type == "volunteerSettings"][0]{ ... }` for a singleton).
5. **Server helper:** add a `cache()`-wrapped helper in `src/lib/data.ts` that calls `sanityFetch(QUERIES.x, [SANITY_TAGS.x])`.
6. **Use it** in the page's `page.tsx` and pass the result to the client wrapper and view (13.1).
7. **Webhook route:** in `src/app/api/revalidate/route.ts` add a `case SANITY_TAGS.x:` to `revalidateType` listing the paths that show the data, and update the doc comment and the manual GET help text.
8. **Sanity webhook:** add the `_type` to the webhook's Filter in sanity.io/manage ([4.6](#46-isr-tags-and-the-webhook)).
9. **Browser fetches:** if the view also queries in the browser, make sure CORS allows the site's origins.
10. **Docs:** describe the new fields in [CONTENT.md](./CONTENT.md) and, if staff will edit it, update `public/help.html`.
11. **Verify:** publish a change, confirm the webhook attempt returns `"revalidated": true`, and reload the page.

### 13.3 Add an illustration

Follow [BRAND.md, section 7 "Illustration"](./BRAND.md) (house style, naming, the asset inventory table) and use `scripts/generate-illustration.py` to render and trim a transparent WebP into `public/images/illustrations/` (it needs `pip install pillow numpy scipy` and an `OPENROUTER_API_KEY` environment variable; raw renders go to the git-ignored `scripts/.renders/`). Then:

- Use it as decorative imagery: `<img src="/images/illustrations/<name>.webp" alt="" aria-hidden="true" width=".." height=".." loading="lazy">` with real intrinsic dimensions.
- Keep files in the 20 to 100 KB range; never generate people, real places or real events (real photos come from Sanity).
- Add a row to the asset tables in BRAND.md and DESIGN.md.
- Share-image illustrations are different: they are PNGs in `public/og/`, loaded from disk by `src/app/_og/assets.ts` (BRAND.md section 10).

### 13.4 Change the numbers and copy that are not in the CMS

Not everything is editable in Sanity. These are hard-coded and need a code change and deploy:

- Home impact statistics and focus-area copy: `impactStats` and `keyAreas` in `src/views/Home.tsx`, and `impactStats` in `src/components/Hero.tsx` (the same figures appear in both, with slightly different labels).
- "Where your donation goes" on `/donations`: `uses` in `src/views/Donations.tsx` (includes "68+ patients").
- Footer blurb, hero text, page headings and descriptions: in the components and views themselves.
- Years of service is computed from 2010 (`new Date().getFullYear() - 2010`).

### 13.5 Change design tokens

Edit `@theme` in `src/styles/globals.css` (fonts and `--color-paper`; the red and gray scales are Tailwind's defaults). See the Turbopack cache note in [Troubleshooting](#14-troubleshooting) if the change does not show up.

---

## 14. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Edited `@theme` or `globals.css` and the dev server still shows old styles | Turbopack's dev cache is stale. Stop `next dev`, delete `.next/dev` (`rm -rf .next/dev` in Git Bash, `Remove-Item -Recurse -Force .next\dev` in PowerShell), restart. If it persists, delete all of `.next`. |
| `npx react-doctor` (or another tool with native binaries) fails with a missing `...-win32-x64-msvc` module | npm's optional-dependency bug on Windows when the lockfile was produced on another platform. Run the tool with `bunx` instead, or delete `node_modules` and reinstall. Also check the Node version: Node 20.16 satisfies Next but not the 20.19+ these tools need (use Node 22). |
| `next dev` crashes or serves odd errors right after `npm install` / `npm uninstall` | Changing `node_modules` under a running dev server can break Turbopack. Stop the dev server before touching dependencies, then start it again. |
| Git Bash changes values like `/api/revalidate` into `C:/Program Files/Git/api/revalidate` in env vars or arguments | MSYS path conversion. Prefix the command with `MSYS_NO_PATHCONV=1`, or use PowerShell. |
| An event page does not show the latest edit after 5 minutes | Check the webhook attempt log in Sanity; call `GET /api/revalidate?secret=...&eventId=<id>`; verify `SANITY_REVALIDATE_SECRET` matches on Vercel; redeploy as a last resort. |
| Webhook returns 401 | The secret does not match or was not sent. Check the Secret field in Sanity against Vercel's env var (no stray whitespace or quotes). |
| Webhook returns 500 `Server configuration error` | `SANITY_REVALIDATE_SECRET` is not set for that environment, or was set after the last deploy. |
| Webhook returns 200 with `revalidated:false` | The payload had no recognised `_type` (check the Projection `{_id, _type}` and the Filter). |
| Build or dev server fails with `Configuration must contain projectId` | `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing (the client is created at import time). Add it to `.env.local` or the Vercel environment. |
| Lists are empty and logs show `Sanity fetch failed (...)` | Wrong project ID or dataset name, dataset not public, or a network problem. Helpers swallow the error and render empty states on purpose. |
| Pagination or fallbacks fail in the browser only (CORS error in the console) | Add the site's origin to the Sanity project's CORS origins. |
| A map shows "Map not available" or "Map unavailable" | The CMS value is not a Google Maps **embed** URL (`https://www.google.com/maps/embed?...`). Short links and plain Share links are rejected by `safeMapsEmbedUrl`. |
| Share preview shows the generic banner or the wrong font | The dynamic renderer failed and served `public/og-thumbnail.png`, or Google Fonts was unreachable and the Poppins fallback was used. Check the build and function logs for `Error generating ... share image`. Degraded images are cached only briefly. |
| `GET /_vercel/insights/script.js` 404 in the console locally | Expected; see section 12. |
| Playwright says the browser executable does not exist | Run `npx playwright install`. |
| `next build` fails on a type error | `typescript.ignoreBuildErrors` is `false`. Run `npx tsc --noEmit` locally. |
| Hydration warnings mentioning the intro counter, `<html>` classes or numbers | Expected places for `suppressHydrationWarning` (`layout.tsx`, `LoadingScreen.tsx`, `CountUp.tsx`). A warning elsewhere is a real mismatch; check for time zone or `Date` use outside `src/components/events/format.ts` (event dates are always formatted in IST). |

---

## 15. Known gaps and tech debt

A snapshot as of 2026-10-07, so the next developer does not rediscover them. Remove items as they are fixed.

**Dead or duplicate code**
- Unused: the legacy helpers in `src/lib/seo.ts`, the `QUERIES` export in `src/lib/sanity.ts`, `galleryService` and two `settingsService` methods in `src/services/sanity-client.ts`, `getDonationSettings` in `src/lib/data.ts`, the `images` block in `next.config.mjs` (`next/image` is not used), and the `@/*` path alias. `public/favicon.ico` and `src/app/favicon.ico` are byte-identical (the second is the App Router convention).
- `src/views/Home.tsx` has its own `ContactRow` and map iframe instead of `src/components/contact/ContactRow.tsx` and `LazyMap.tsx`.
- Fetch and cache constants (`revalidate: 300`, tag literals, `PAGE_SIZE`, `baseUrl`) are repeated across `page.tsx` files instead of using `src/lib/data.ts` and `src/lib/sanity-cache.ts`.

**Content that cannot be edited in the CMS** is listed in 13.4. Contact details also appear hard-coded in `contact/page.tsx` metadata and social profile URLs in `social/page.tsx` and `site-structured-data.ts`; they can drift from the CMS values.

**Caching and operations**
- `public/sitemap.xml` is static, has no event URLs and stale `lastmod` dates.
- The code's default Sanity API version (`2023-05-03`) differs from `.env.example` (`2024-03-14`); check which one Vercel sets.
- Two lockfiles (`package-lock.json` and `bun.lockb`); see [Package manager](#package-manager). No `engines` field.

**Tests**
- No Jest tests; `test:a11y` matches nothing; the framer-motion mock is minimal; two Playwright specs have known issues (section 11).
