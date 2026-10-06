# Rudhirsetu Brand Kit

How Rudhirsetu Seva Sanstha looks, sounds and shows up online. Use this for anything with the name on it: website pages, social posts, posters, decks.

Developers should also read [`DESIGN.md`](./DESIGN.md), which turns this kit into Tailwind tokens and React patterns.

---

## 1. Essence

**Rudhirsetu** (रुधिरसेतु) joins *rudhir* (blood) and *setu* (bridge): **a bridge of blood**. Since 2010 the organisation has connected donors with people who need blood. It also runs free healthcare camps: eye care, thalassemia support, and cervical and breast cancer awareness.

| | |
| --- | --- |
| **We are** | warm, trustworthy, community-rooted, hopeful, quietly confident |
| **We are not** | clinical, alarmist, guilt-driven, flashy, corporate |
| **Visual idea** | an editorial annual report: big confident type, generous space, one deep red family, a single handwritten word for warmth |

**Lines in use**
- "Transforming *Lives*, *Empowering* Communities" (home hero)
- "Rudhirsetu means bridge of blood" (eyebrow / loading screen)
- "Be a part of the *bridge*." (footer call to action)

---

## 2. Logo

| File | Use on | Notes |
| --- | --- | --- |
| `public/images/logo-light.svg` | dark surfaces (maroon, photos with a dark overlay) | white Devanagari wordmark with the red flame mark |
| `public/images/logo-dark.svg` | light surfaces (white, paper) | black wordmark with the red flame mark |
| `public/images/monogram.svg` | small spaces: navbar, favicons, avatars | flame mark only, in logo red |
| `public/icons/*` | favicons and app icons | generated from the monogram |

**Rules**
- **Clear space:** keep space equal to the height of the flame's top drop free on every side.
- **Minimum size:** 24px tall for the monogram and 64px tall for the full logo.
- The flame is always **logo red `#ED1B24`**, or white for single-colour use on dark surfaces. The navbar turns it white with the CSS filter `brightness-0 invert` over the hero.
- The English lock-up in the navbar ("Rudhirsetu / Seva Sanstha") is set in Bricolage Grotesque with "Seva Sanstha" in red. Use it beside the monogram, never on its own as a logo.
- **Don't:** stretch, rotate, outline, add shadows or glows, recolour the wordmark, or place it on busy photos without a dark overlay.
- `#ED1B24` belongs to the logo only. UI elements use the palette below.

---

## 3. Colour

| Name | Hex | Tailwind | Use |
| --- | --- | --- | --- |
| Maroon | `#450A0A` | `red-950` | dark surfaces: footer, feature tiles, intro curtain, mobile menu |
| Deep red | `#7F1D1D` | `red-900` | text on light red, hero base |
| Crimson | `#B91C1C` | `red-700` | brand accent: accent words, links, icons, active states |
| Action red | `#DC2626` | `red-600` | primary buttons only |
| Rose | `#FCA5A5` | `red-300` | accents on maroon (eyebrows, script words) |
| Blush | `#FEE2E2` | `red-100` | eyebrow pills on light surfaces |
| Paper | `#FBF6F4` | `paper` | alternate section background |
| White | `#FFFFFF` | `white` | main background |
| Ink | `#111827` | `gray-900` | headings |
| Body | `#4B5563` | `gray-600` | paragraphs |
| Hairline | `#7F1D1D` at 10% | `red-900/10` | dividers and card borders on light surfaces |

**Proportion:** about 60% white/paper, 30% maroon/ink, 10% crimson. Red works because it is used sparingly.

**One family only.** No blues, greens, purples, oranges or rainbow gradients, including on social posts.

**Contrast (WCAG AA needs 4.5:1 for body text):**

| Pair | Ratio |
| --- | --- |
| white on Action red | 4.83 ✓ |
| white on Crimson | 6.47 ✓ |
| Crimson on white | 6.47 ✓ |
| Crimson on paper | 6.04 ✓ |
| Body grey on paper | 7.05 ✓ |
| Rose on maroon | 8.51 ✓ |
| white/70 on maroon | 8.30 ✓ |
| white/50 on maroon | 4.74 ✓ (minimum for small text) |
| white/40 on maroon | 3.48 ✗ (decorative only) |

---

## 4. Typography

| Role | Typeface | Weights | Where |
| --- | --- | --- | --- |
| Display | **Bricolage Grotesque** | 500–700 | headings, big numbers, navbar wordmark |
| Text / UI | **Plus Jakarta Sans** | 400–700 | paragraphs, buttons, labels |
| Accent | **Pacifico** | 400 | exactly one word per heading, never body text |

All three are free Google Fonts, self-hosted on the site via `next/font`.

- **Headlines** are big, tight (`tracking-tight`, line-height about 1.05) and set in sentence case: "Our key *focus*", not "Our Key Focus".
- **The accent word** carries the feeling: *Lives*, *focus*, *help*, *making*, *matter*, *difference*, *bridge*. Use it in crimson on light, or rose/blush on dark.
- **Small uppercase labels** (`tracking-[0.2em]`) are for micro-headings and eyebrows only.
- **Numbers** are set in the display face with tabular figures, so counters don't jitter.

---

## 5. Voice and words

- **Plain, warm, specific.** Write "Join our next blood donation camp", not "Engage with our initiatives".
- **Never invent numbers or claims.** The only figures in use are below. Update them here first, then in `src/lib/impact.ts`, the single file every page reads them from (labels included, so wording stays consistent).

  | Fact | Figure |
  | --- | --- |
  | Founded | 2010 |
  | Blood donation camps | 50+ every year |
  | Emergencies supported | 9,800+ |
  | Eye checkups | 15,000+ |
  | Women reached through cancer awareness | 20,000+ |
  | Thalassemia patients supported | 68+ |
  | Emergency support | 24/7 |

- **Hope, not fear.** No guilt, no graphic blood or injury, no "people will die if you don't". Show the bridge being built, not the gap.
- **Indian English spelling** (organise, centre, programme). The site still has a few US spellings to clean up over time.
- **Standard button labels** (keep them consistent):
  - "Donate Now"
  - "Join Our Next Camp"
  - "Get Involved"
  - "Contact Us"
  - "View all events"
  - "View full gallery"
  - "Back to top"
- **Bilingual:** the Devanagari wordmark is part of the identity. Hindi or Marathi copy is welcome on posters and social posts, kept in the same calm tone.

---

## 6. Photography

- **Real only.** Event and gallery photos come from Sanity and must be real Rudhirsetu events with participants' consent.
- **Prefer** warm, natural light; people helping people; volunteers, donors and doctors at work; faces with dignity.
- **Avoid** needles in close-up, blood bags as the hero, distressed patients, and heavy filters.
- **Size:**
  - Featured or carousel photos at least 1600px wide; the carousel is 21:9 on desktop.
  - Event images at least 1200px wide. Posters are fine, since cards crop from the top.
- **On the site:** photos sit in `rounded-2xl`/`rounded-3xl` frames with a hairline border.
- **Text on photos:** only over a maroon gradient overlay.

---

## 7. Illustration

The site uses a small family of **3D clay and frosted-glass objects in the crimson palette**, on transparent backgrounds. They stand in for concepts (focus areas, empty states, page heroes), never for real people or events.

### Inventory (`public/images/`)

| File | Shows | Best on | Used for |
| --- | --- | --- | --- |
| `focus/blood-donation.webp` | glass blood drop with a heartbeat line | dark only | home bento, camp call to action |
| `focus/eye-care.webp` | rose clay spectacles with crimson lenses and a small heart | red or any | home bento (red tile) |
| `focus/cancer-awareness.webp` | glossy crimson awareness ribbon | any | home bento |
| `focus/thalassemia.webp` | three bright glossy red blood cells | any | home bento |
| `illustrations/donate.webp` | slender hands cradling a glowing heart | any | donations page |
| `illustrations/contact.webp` | envelope with a heart wax seal | any | contact page |
| `illustrations/empty-events.webp` | calendar with a blood drop | light | no events / camps empty state |
| `illustrations/empty-gallery.webp` | clay camera | light | empty gallery state |
| `illustrations/not-found.webp` | blood-drop character holding a map, looking lost | light | 404 pages |
| `illustrations/social.webp` | two speech bubbles with a heart | any | social page |

Glass objects (`--bg black`) only read well on maroon or red. On white they wash out.

### Making a new one

Use `scripts/generate-illustration.py`. It appends the house style, renders with OpenRouter (`google/gemini-nano-banana-2.1`), removes the background and saves a trimmed, transparent WebP.

```bash
pip install pillow numpy scipy
python scripts/generate-illustration.py --name empty-volunteers --subject "A small clay clipboard with a glossy crimson heart pinned to it, three-quarter view" --variants 2
```

The house style string (kept in the script) is:

> Soft 3D render, smooth matte clay with subtle frosted-glass highlights, monochrome crimson palette (deep maroon #450A0A, crimson #B91C1C, soft rose highlights), gentle studio lighting, single centered object with generous empty space around it, premium minimal healthcare-NGO brand illustration. No text, no letters, no numbers, no logos, no real people.

**Prompt tips**
- Describe one object with one idea, and add "three-quarter view".
- Name the materials: "matte rose clay", "glossy crimson", "pale rose porcelain", "frosted glass".
- Tie objects to the cause with a small blood-drop or heart detail.
- Avoid hands with many fingers in view, multiple objects, scenes, and anything that could read as a real person or place.

**Review before shipping**
- Look at it on maroon, paper and white.
- Check the edges for white halos on maroon.
- Check there's no text, no extra objects and the palette is right.
- Export at a maximum of 800px; the file should come in under about 100 KB.

**Cost:** about $0.05 per image at 2K. Generate 2–4 variants and keep one.

---

## 8. Icons

- [Lucide](https://lucide.dev) via `lucide-react`, at the default stroke, in sizes 16, 20 and 24px.
- Standalone icons sit in **icon circles**:
  - 44–56px round, paper background, crimson icon.
  - Hover inverts them to crimson with a white icon.
- No emoji in UI, no filled or duotone icon sets, and no brand-coloured social icons. Social icons stay monochrome.

---

## 9. Motion

Calm and physical; motion should feel like settling, not bouncing.

- **Reveals:** rise about 30px with `cubic-bezier(0.22, 1, 0.36, 1)`, staggered 100–120ms.
- **Hover:** lift by at most 4px; images may scale to 1.05 and rotate a few degrees.
- **Hero:** slow-moving crimson silk (WebGL) with a faint heartbeat pulse every 3.2s.
- **Respect `prefers-reduced-motion`:** everything falls back to still frames.

---

## 10. Social and share images

Link previews (WhatsApp, Facebook, LinkedIn, X) use generated share images in the same system:

- maroon background with a crimson glow;
- the light logo;
- a Bricolage headline with one Pacifico accent word;
- an illustration where useful.

They're built from code (see [`ARCHITECTURE.md`](./ARCHITECTURE.md), SEO/OG section). Keep each one **under 600 KB** (WhatsApp's limit), ideally 300 KB or less, at 1200×630.

For hand-made posts, use the same recipe:
- maroon or paper background;
- one headline with one accent word;
- real photo or one illustration;
- logo bottom-left or top-left with clear space;
- no more than two reds plus white.
