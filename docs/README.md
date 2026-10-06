# Documentation index

Everything written down about the Rudhirsetu Seva Sanstha website, and which file to open for which question.

| Document | Audience | What it covers |
| --- | --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Developers | The technical guide: stack and tooling, folder map, the page, client, view pattern, data flow and caching (Sanity, ISR, the revalidation webhook and its setup), environment variables, the measured performance decisions and why, cross-browser policy, SEO and Open Graph images, accessibility, scripts and tests, Vercel deployment, "how to" recipes, troubleshooting, known gaps |
| [DESIGN.md](./DESIGN.md) | Developers and designers | The UI system: design tokens, typography, layout rules, shared components, patterns (cards, ledger rows, bento grids, navbar, footer), motion, performance rules and cross-browser requirements. Read it before writing any UI |
| [BRAND.md](./BRAND.md) | Designers, communications, developers | The brand kit: essence, logo, colour, typography, voice, photography, illustration (with the asset inventory and how to make a new one with `scripts/generate-illustration.py`), icons, motion, social and share images |
| [CONTENT.md](./CONTENT.md) | NGO staff who edit the website (and developers who need to know what editors can do) | Every Sanity content type (events, gallery images, donation settings, contact settings, social media settings): fields, where each appears on the site, image sizes, how long changes take, what is not editable |
| [`public/help.html`](../public/help.html) | NGO staff | A printable web version of the basic editing steps, served on the site at `/help.html`. CONTENT.md is the fuller and more current reference |
| [Root README](../README.md) | Everyone | Project overview and quick start |

## Reading order for a new developer

1. [Root README](../README.md): what the project is, get it running (about 10 minutes).
2. [ARCHITECTURE.md](./ARCHITECTURE.md), sections 1 to 4: stack, folder map, the page, client, view pattern, and data flow and caching. These four sections explain most of how the site behaves.
3. [CONTENT.md](./CONTENT.md): what editors do in Sanity and what they see on the site. Quick to read, and it makes the data model concrete.
4. [DESIGN.md](./DESIGN.md): before touching any UI.
5. [ARCHITECTURE.md](./ARCHITECTURE.md), sections 5 to 12: environment variables, the performance rules (read section 6 before changing animation, scrolling, hero or caching code), SEO, tests, deployment.
6. [BRAND.md](./BRAND.md): when you work on logos, imagery, illustrations or share images.
7. Keep [ARCHITECTURE.md section 13 "How to ..."](./ARCHITECTURE.md#13-how-to-) and [section 14 "Troubleshooting"](./ARCHITECTURE.md#14-troubleshooting) at hand for the first real task.

## Keeping the docs true

- Changed an environment variable? Update ARCHITECTURE.md section 5 and `.env.example`.
- Added or changed a Sanity content type or field? Update CONTENT.md, `src/types/sanity.ts`, ARCHITECTURE.md (the webhook filter in 4.6) and, if staff edit it, `public/help.html`.
- Changed a performance-critical behaviour (intro, hero shader, scroll reveals, headers)? Update ARCHITECTURE.md section 6 or 7 and, if it is a UI rule, DESIGN.md.
- Fixed something listed in ARCHITECTURE.md section 15 "Known gaps"? Delete it from that list.
- Every claim in these docs cites a file path. If you move a file, search the docs for the old path.
