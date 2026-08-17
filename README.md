# Skyline Solutions — Website

Marketing site for Skyline Solutions, built with [Astro](https://astro.build) + React islands + Tailwind CSS v4.

## Stack

- **Astro** — static-first site generation, near-zero JS by default
- **React** — used only where interactive (the contact form)
- **Tailwind CSS v4** — CSS-first theme config in `src/styles/global.css`
- **@astrojs/sitemap** — automatic `sitemap-index.xml` at build time

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm install`       | Install dependencies                         |
| `npm run dev`       | Start local dev server at `localhost:4321`   |
| `npm run build`     | Type-check and build to `./dist/`            |
| `npm run preview`   | Preview the production build locally         |

## Project structure

```
src/
├── components/
│   ├── sections/       # One component per homepage section
│   ├── ContactForm.tsx # React island — the only hydrated component
│   ├── CaseStudyReel.astro  # One case study, played as four animated beats
│   ├── HeroScene.astro      # The scroll-driven flow scene (WebGL field is code-split)
│   └── Nav.astro, Footer.astro, Button.astro, SectionHeading.astro
├── config/site.ts      # Site name, URL, contact email, form access key, founder details
├── data/                # Content arrays (services, automation, case studies, tech)
├── layouts/Layout.astro # SEO/OG/structured data, nav, footer, scroll-reveal script
├── scripts/
│   ├── flowfield.ts     # three.js particle field behind the hero
│   └── motion.ts        # Shared motion primitives, opt-in per element (see below)
└── pages/
    ├── index.astro
    ├── contact.astro
    └── 404.astro
```

## Before you launch — configuration checklist

1. **Domain** — `src/config/site.ts` (`SITE.url`) and `astro.config.mjs` (`site` / `base`) currently point at
   the GitHub Pages project URL. Replace both with your real domain once you own one, and update the
   `Sitemap:` line in `public/robots.txt` to match.
2. **Contact email** — replace the placeholder address in `src/config/site.ts` (`SITE.email`).
3. **Contact form delivery** — the form posts to [Web3Forms](https://web3forms.com) (no backend required).
   Sign up for a free access key and paste it into `WEB3FORMS_ACCESS_KEY` in `src/config/site.ts`.

   **Web3Forms decides the destination inbox from the key alone** — nothing in this repo can point it at a
   different address. Failure modes, and how to tell them apart:
   - *Visitor sees an error* → the key is wrong, expired, or missing.
   - *Visitor sees "Thanks", nothing arrives* → **not a code problem.** Check the Web3Forms dashboard:
     - the address may be on their **suppression list** (this happened here, Aug 2026). Once an address
       bounces — typically when a key is created before the email is confirmed — Web3Forms blocks every
       later send to it while still returning `success: true`. Only their support can lift it:
       https://web3forms.com/help?contact=true
     - or the key belongs to a different inbox than `SITE.email`.

   Submissions are stored in the dashboard under *Form → Submissions* regardless of whether the email went
   out, so nothing is actually lost while delivery is broken. Check Spam and Promotions too.
4. **Logo** — replace `public/images/logo-mark.svg` with your real logomark (used in the nav, footer, and
   favicon). Keep the filename the same and it'll show up everywhere automatically. If your real logo also
   has a wordmark built in, you can swap the `<img>` + text pairing in `src/components/Nav.astro` and
   `Footer.astro` for a single logo image instead.
5. **Case study** — `src/data/caseStudies.ts` holds one *illustrative* entry: a realistic worked example, not a
   delivered engagement. It renders with an amber "Illustrative" badge for exactly that reason. When you have
   real work to show, replace the fields and delete the `illustrative: true` line — that flag is the only thing
   separating "here's how we think" from a claim we can't back. Emptying the array removes the whole Work
   section from the page on its own.
   Each beat's `line` is a caption over a moving scene — keep it to about six words. The four `scene` keys
   (`pile`, `pipe`, `guard`, `result`) select which animation plays; a new case study reuses them by name.
6. **OG social preview image** — `public/images/og-cover.svg` is a generated placeholder. SVG has patchy
   support as an `og:image` on some platforms (notably Twitter/X). For best results, export a 1200×630 PNG/JPG
   version and point `ogImageURL` in `src/layouts/Layout.astro` at it.

## Notes

- **Voice:** the site speaks as "we" — the company, not the individual. Keep it consistent when adding copy.
  Two deliberate exceptions: the service **track labels** in `data/services.ts` ("I already have systems") are
  the *visitor* speaking, not Skyline; and the footer credit names Viktor directly. Avoid copy that claims
  headcount ("our team of engineers") — the corporate "we" is a convention, an invented staff is a lie.
- All copy avoids inventing clients or testimonials, per the project brief. The Services and "What Can I Take
  On?" sections are framed as capability, and the case study is badged as illustrative until it describes real
  delivered work.
- Text colours are checked against WCAG AA for body text (4.5:1) on the surfaces they're used on.
  `--color-text-faint` in particular is at its floor — don't darken it.
- **Motion** is opt-in per element via `data-*`, backed by `src/scripts/motion.ts` and the primitives at the
  bottom of `global.css`:
  | Attribute | Effect |
  | --- | --- |
  | `data-reveal` | Fade + rise when scrolled into view (handled in `Layout.astro`) |
  | `data-split` | Heading rises word by word, staggered |
  | `data-count="90"` | Number ticks up to the value when it enters the viewport |
  | `data-magnetic="0.2"` | Element leans toward the cursor and springs back |
  | `data-tilt="3"` | Card tips in 3D toward the pointer (degrees) |
  | `data-progress` | Scroll-progress bar (one per page, in the nav) |
  Never put `data-reveal` and `data-tilt` on the same element — both animate `transform` and the reveal wins.
- Every animation respects `prefers-reduced-motion`; `motion.ts` returns early, and each section's CSS has a
  reduced-motion block. Nothing depends on JS to be readable.
- Node.js was not previously installed on this machine — it was installed via `winget install OpenJS.NodeJS.LTS`
  as part of setting this project up.
