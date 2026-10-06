# Rudhirsetu Design System

The UI system for every page on the site. The brand kit (logo, colour, voice, illustration) is in [`BRAND.md`](./BRAND.md), and the technical guide is in [`ARCHITECTURE.md`](./ARCHITECTURE.md). The home page (`src/views/Home.tsx`), `Hero.tsx`, `Footer.tsx` and `EventCard.tsx` are the canonical implementations. When in doubt, copy what they do.

## Concept

*Rudhirsetu* means "bridge of blood". The site should feel **warm, editorial and trustworthy**, like a well-made annual report rather than a SaaS template. That means large confident type, generous whitespace, thin hairline rules instead of boxes, one brand colour family, and a single handwritten accent word per heading.

## Tokens

Defined in `src/styles/globals.css` (`@theme`) and loaded in `src/app/layout.tsx`.

| Role | Token / class | Value |
| --- | --- | --- |
| Display font (headings, big numbers) | `font-display` | Bricolage Grotesque 500–700 |
| Body font (default) | `font-sans` | Plus Jakarta Sans 400–700 |
| Script accent (one word per heading) | `font-script` via `<Accent>` | Pacifico |
| Paper surface | `bg-paper` | `#FBF6F4` |
| Ink | `text-gray-900` | headings |
| Body copy | `text-gray-600` (secondary `text-gray-500`) | |
| Brand accent | `text-red-700`, `bg-red-700` | `#B91C1C` |
| Primary button | `bg-red-600 hover:bg-red-700` | |
| Dark surface | `bg-red-950` | deep maroon, used for the feature tile and footer |
| Hairline on light | `border-red-900/10` | all dividers and card borders |
| Hairline on dark | `border-white/15` | |

**Colour rule:** reds and maroons only. No purple, emerald, blue or other accent hues, and no rainbow gradients. Greys only for text.

## Typography

- Section `h2`: `font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-gray-900`
- Page `h1` (inner pages): same as h2, or one step larger (`lg:text-7xl`)
- Card/tile `h3`: `font-display text-2xl font-bold tracking-tight`
- Big numbers: `font-display font-bold tracking-tight tabular-nums`
- Lead paragraph: `text-lg sm:text-xl text-gray-600 leading-relaxed`
- Small labels and indices: `text-sm font-semibold text-red-700/50 tabular-nums` showing `01`, `02` and so on.
- Uppercase micro-labels (used sparingly, mostly on dark surfaces): `text-sm font-semibold uppercase tracking-[0.15em] text-white/40`
- **Script accent:** wrap exactly one word per heading in `<Accent>` (for example "Our key `<Accent>`focus`</Accent>`"). Never more than one per heading, and never in body text or buttons.

## Layout

- Container: `max-w-7xl mx-auto`, with section padding `px-4 sm:px-6 lg:px-8`.
- Section rhythm: `py-20 sm:py-24 lg:py-32`.
- Alternate section backgrounds `bg-white` and `bg-paper` so sections separate without borders.
- Headers are **left-aligned and editorial**: eyebrow and title on the left, description and action on the right (`<SectionHeader>`). Avoid centred "badge / title / subtitle" stacks.
- Two-column editorial layouts use `grid lg:grid-cols-12`, typically a 5/7 split, with a `lg:sticky lg:top-32 self-start` intro column.
- Radii: tiles and cards `rounded-3xl`, inner media `rounded-2xl`, buttons `rounded-md`, pills and icon circles `rounded-full`. The hero is an inset card (`rounded-[2.5rem]`) and the footer has rounded top corners. These two framing shapes book-end every page.
- Every layout must work at 375px wide with no horizontal scroll.

## Shared components (`src/components/ui/Section.tsx`)

| Component | Use |
| --- | --- |
| `SectionHeader` | Every section header. Props: `icon`, `eyebrow`, `title` (ReactNode), `description`, `action`, `as` (`'h1'` for a page title). |
| `Eyebrow` | Red pill label above a heading (`dark` for maroon surfaces, `center` inside centred layouts such as the 404 and error pages). |
| `Accent` | The Pacifico accent word. |
| `SectionLink` | Text link with a sliding arrow, for section-level actions ("View all events"). |
| `sectionItemVariants` | Framer Motion item reveal. Pair it with a parent `motion.section` using `initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}` and a stagger container. |

## Patterns

**Buttons**
- Primary: `inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors`, with a trailing `ArrowRight` that nudges right on hover (`group-hover:translate-x-1`).
- Secondary on light: `border border-red-900/15 text-gray-900 hover:bg-paper`.
- On dark or red surfaces: white button `bg-white text-red-900 hover:bg-red-100`, plus an outline button `border border-white/25 text-white hover:bg-white/10`.

**Cards** (see `EventCard.tsx`): `bg-white rounded-3xl border border-red-900/10`, inset media `p-2.5` with `rounded-2xl`, and on hover `-translate-y-1` with a soft maroon shadow `shadow-[0_24px_48px_-24px_rgba(69,10,10,0.35)]`. No heavy drop shadows at rest.

**Ledger rows** (impact stats, contact details): a vertical list with `border-t` on the list and `border-b border-red-900/10` on each row. Rows have a numbered index or an icon circle. Use this instead of boxed stat cards.

**Icon circles**: `w-11 h-11` (or `w-14 h-14`) `rounded-full bg-paper text-red-700`. On a hovered parent, switch to `bg-red-700 text-white`.

**Dark feature surfaces**: `bg-red-950 text-white` with a soft glow made from a radial gradient (`bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(220,38,38,0.28),transparent_70%)]`), never a `blur-*` filter. Text uses `text-white/70`, hairlines `border-white/15`.

**Photo mosaic** (`components/gallery/FeaturedMosaic.tsx`, home "Moments that matter"): one 2x2 tile plus four squares, captions on hover only (uploads often carry their own text), and a "+N more photos" tile that opens the lightbox. The large tile goes to the sharpest landscape upload. Use it instead of a full-width carousel when photos are small or mixed-shape.

**Bento grids**: `grid md:grid-cols-4 gap-4 lg:gap-5`, with tiles in `rounded-3xl`. Mix one dark tile, one paper tile, one white bordered tile and at most one `bg-red-700` tile. Number tiles `01`–`04`.

**Navbar** (`Navbar.tsx`):
- At the top of a page it is transparent: white text over the dark home hero (routes in `DARK_TOP_ROUTES`), dark text elsewhere.
- Once scrolled it condenses into a centred, near-opaque white pill (no blur).
- It always stays visible (no hide-on-scroll; the owner preferred a constant bar).
- The active link is marked with a small dot; Donate is the only filled button.
- Mobile uses a full-screen maroon sheet with numbered links.

**Footer** (`Footer.tsx`, a server component):
- A CTA band.
- A brand/socials column, a two-column Explore list, and a Reach Us column led by a "Need blood urgently? 24/7" phone card.
- An SVG "Rudhirsetu" wordmark fitted to the content width, with the copyright bar set into its lower edge (stacked below it on phones).

**Empty and error states**: centred, using an illustration from `/images/illustrations/` (about `h-40`), a `font-display` title and one line of `text-gray-600`.

**Motion**: subtle reveal on scroll (30px rise, ease `[0.22, 1, 0.36, 1]`), hover lifts of at most 4px, and image scale/rotate on hover. Nothing loops except tiny status dots. Respect `prefers-reduced-motion`.

- Scroll reveals are **transform-only, with no opacity fade**. Fading containers that hold rounded, clipped images makes Firefox re-render them offscreen on every frame. It was measured as the cause of heavy scroll jank on /camp.
- The home hero entrance and the first-visit intro curtain are **CSS animations** (`hero-rise` and `intro-*` in `globals.css`, triggered by the inline script in `layout.tsx`), so they paint without waiting for JavaScript. Don't move them back into Framer Motion.

## Illustration assets (`public/images`)

The inventory, usage rules and the generator script are in [`BRAND.md` → Illustration](./BRAND.md#7-illustration). For developers:

- They are decorative: use `alt=""` and `aria-hidden="true"`.
- Give them explicit `width`/`height` attributes matching the file, so no layout shift.
- Use `loading="lazy"` below the fold and `decoding="async"`.
- Glass objects (`focus/blood-donation.webp`) are for dark surfaces only; on the red tile use an opaque clay object (`focus/eye-care.webp`), since glass blends into red.
- Never use AI imagery for real people, camps or events. Real photos come from Sanity.

## Data fetching

Prefer fetching on the server in `page.tsx` and passing the initial data as props to the client view, so pages render with content (good for SEO and LCP, with no skeleton flash). Use the Sanity `client` from `src/lib/sanity.ts` with `{ next: { revalidate: 300, tags: ['<sanity _type>'] } }`. The `/api/revalidate` webhook revalidates by tag. Client-side fetching is acceptable only for interactions such as pagination and filters.

## Performance rules

- Size Sanity images with `urlFor(img).width(n).height(m).auto('format').url()` to match their display size, and use `loading="lazy"` below the fold.
- Don't add new client-side libraries for things CSS can do.
- Every new image needs explicit dimensions or an aspect-ratio box (no layout shift).
- **No `backdrop-filter` / `backdrop-blur`.** Re-blurring content that scrolls under a fixed bar, or under pills on cards, caused the worst frame drops measured. Use near-opaque solid backgrounds (`bg-white/95`) instead.
- Don't put `filter` effects (grayscale, blur) on images inside scrolling lists.
- Avoid `overflow-hidden` + large radius on wrappers unless something actually needs clipping. Clip only the image frame.
- Transitions name their properties (`transition-[transform,box-shadow]`), not `transition-all`.
- The hero shader (`HeroShader.tsx`) renders at about 0.3–0.55x resolution with adaptive quality, pauses offscreen and in hidden tabs, and falls back to a CSS gradient. Keep any new WebGL to that standard, and never more than one canvas per page.
- Third-party shader libraries were evaluated (shaders.com): they are WebGPU-only (blank on many Safari/Firefox/Android devices) and about 100 KB gzipped. Prefer small hand-written WebGL1.

## Cross-browser requirements

The site must work in Chrome, Firefox, Safari (macOS and iOS) and Android browsers.

- Viewport units: `svh`/`dvh` always need a `vh` fallback, e.g. `min-h-screen supports-[height:100svh]:min-h-[100svh]`.
- `overflow: clip` is used on the home root so the sticky impact column works. Don't rely on it alone for anything that would otherwise overflow horizontally.
- Glows use `radial-gradient` backgrounds, not large `blur-*` filters, which are janky on Safari and Firefox.
- Don't use `backdrop-filter` (see Performance rules). It is also the slowest effect in Firefox.
- Form inputs need a font-size of at least 16px (stops iOS zoom), plus correct `type`, `inputMode` and `autoComplete`.
- Clipboard: fall back to `execCommand('copy')` when `navigator.clipboard` is unavailable.
- Hover is never required for function. Tailwind v4 already scopes `hover:` to `@media (hover: hover)`.
- `position: sticky` breaks inside `overflow: hidden` ancestors.
- Respect `prefers-reduced-motion` (CountUp, reveals, the WebGL hero).
- Test with Playwright projects `firefox`, `webkit`, `Mobile Safari` and `Mobile Chrome` (see `playwright.config.ts`).

## Don'ts

- Glassmorphism / `backdrop-blur` anywhere (performance, see above)
- Multi-colour accents, gradients on text, or emoji icons
- Centred hero-style header stacks for regular sections
- More than one script word per heading
- Boxed "stat cards"; use ledger rows or a hairline-divided strip instead
- Decorative SVG blobs at low opacity behind content (the old bento did this)
