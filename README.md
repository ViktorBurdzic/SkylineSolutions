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
│   ├── Nav.astro, Footer.astro, Button.astro, SectionHeading.astro
│   └── SystemDiagram.astro  # The animated architecture diagram (hero + full variants)
├── config/site.ts      # Site name, URL, contact email, form access key
├── data/                # Content arrays (services, automation examples, process, tech)
├── layouts/Layout.astro # SEO/OG/structured data, nav, footer, scroll-reveal script
└── pages/
    ├── index.astro
    ├── contact.astro
    └── 404.astro
```

## Before you launch — configuration checklist

1. **Domain** — `src/config/site.ts` and `astro.config.mjs` both currently use the placeholder
   `https://www.skylinesolutions.dev`. Replace with your real domain in both places, and update the
   `Sitemap:` line in `public/robots.txt` to match.
2. **Contact email** — replace the placeholder address in `src/config/site.ts` (`SITE.email`).
3. **Contact form delivery** — the form posts to [Web3Forms](https://web3forms.com) (no backend required).
   Sign up for a free access key and paste it into `WEB3FORMS_ACCESS_KEY` in `src/config/site.ts`. Until you
   do, submissions will fail with an error message shown to the user.
4. **Logo** — replace `public/images/logo-mark.svg` with your real logomark (used in the nav, footer, and
   favicon). Keep the filename the same and it'll show up everywhere automatically. If your real logo also
   has a wordmark built in, you can swap the `<img>` + text pairing in `src/components/Nav.astro` and
   `Footer.astro` for a single logo image instead.
5. **Director photo** — add your professional photo as `public/images/director.jpg`, then in
   `src/components/sections/About.astro` change the `src` from `/images/director-placeholder.svg` to
   `/images/director.jpg`.
6. **OG social preview image** — `public/images/og-cover.svg` is a generated placeholder. SVG has patchy
   support as an `og:image` on some platforms (notably Twitter/X). For best results, export a 1200×630 PNG/JPG
   version and point `ogImageURL` in `src/layouts/Layout.astro` at it.

## Notes

- All copy avoids inventing clients, testimonials, or case studies, per the project brief — the "Selected
  Capabilities" section on the homepage is intentionally framed as capability, not completed client work.
- Animations respect `prefers-reduced-motion`.
- Node.js was not previously installed on this machine — it was installed via `winget install OpenJS.NodeJS.LTS`
  as part of setting this project up.
