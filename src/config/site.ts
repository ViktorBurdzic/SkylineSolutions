// Central place for values you'll want to update before/after launch.
// See README.md for the full configuration checklist.

export const SITE = {
  name: "Skyline Solutions",
  url: "https://viktorburdzic.github.io/SkylineSolutions", // TODO: swap for a custom domain once you own one (also update astro.config.mjs `site`/`base`)
  description:
    "Skyline Solutions integrates AI agents, automation, and modern software engineering into the CRM, ERP, and business software companies already run on.",
  email: "vburdzic@gmail.com",
  locale: "en",
};

// Web3Forms decides the destination inbox from the access key itself, not from
// anything sent with the request — so this key must be the one issued to
// vburdzic@gmail.com. Get it free at https://web3forms.com (no backend needed).
// Until it is filled in, every submission fails and the form shows an error.
export const WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_WEB3FORMS_ACCESS_KEY";
