// Central place for values you'll want to update before/after launch.
// See README.md for the full configuration checklist.

export const SITE = {
  name: "Skyline Solutions",
  // Must stay in sync with `site` in astro.config.mjs. Everything canonical is
  // derived from this: the canonical link, the OG/Twitter URLs and the
  // structured-data `url`. Pointing it anywhere else tells search engines the
  // real page lives elsewhere, which de-indexes this domain.
  url: "https://skylinesolutions.dev",
  description:
    "Skyline Solutions integrates AI agents, automation, and modern software engineering into the CRM, ERP, and business software companies already run on.",
  email: "skylinesolutionsai@gmail.com",
  locale: "en",
  /*
   * Profiles that represent this same business elsewhere. They become the
   * `sameAs` array in the structured data, which is how a search engine is told
   * that this site and those profiles are one entity rather than several — the
   * signal that matters most for a company name as contested as this one.
   * Only add profiles that are actually controlled and kept current.
   */
  profiles: [
    "https://www.linkedin.com/company/skyline-solutionsai/",
    "https://github.com/ViktorBurdzic",
  ],
};

// The site speaks as "we" (the company). This is the person behind it — used by
// the footer credit and the `founder` entry in Layout.astro's structured data,
// which is what ties the brand to a real, named human.
export const AUTHOR = {
  name: "Viktor Burdzic",
  role: "Founder — Senior .NET / C# Engineer",
  linkedin: "https://www.linkedin.com/in/viktor-burdzic-37092b229/",
};

// Web3Forms decides the destination inbox from the access key itself, not from
// anything sent with the request — so this key must be the one issued to
// skylinesolutionsai@gmail.com. Get it free at https://web3forms.com.
// This key is public by design: it ships in the client bundle and only grants
// the ability to send mail to the inbox it is registered to.
export const WEB3FORMS_ACCESS_KEY = "0d8c8a37-2011-4c1d-b3e7-fb54b03ea3ec";
