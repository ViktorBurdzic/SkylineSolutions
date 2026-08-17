export type Service = {
  tag: string;
  title: string;
  /** Which starting point this service answers. Drives the two-track split. */
  track: "existing" | "new";
  headline: string;
  before: string;
  after: string;
  points: string[];
};

export const services: Service[] = [
  {
    tag: "01",
    title: "AI Agents",
    track: "existing",
    headline: "Software that does the work, not just describes it.",
    before: "Five tabs open to answer one question",
    after: "An agent gathers it and drafts the reply",
    points: ["Reads your records", "Calls your APIs", "Completes real tasks", "Escalates when unsure"],
  },
  {
    tag: "02",
    title: "AI Modernization",
    track: "existing",
    headline: "Your systems already know the answer. Now they can say it.",
    before: "Ten years of data nobody can query",
    after: "Ask in plain language, get an answer",
    points: ["Layered over your CRM and ERP", "Documents made searchable", "No rebuild, no migration"],
  },
  {
    tag: "03",
    title: "Custom CRM & CMS",
    track: "new",
    headline: "A platform shaped around how you actually work.",
    before: "A spreadsheet doing a system's job",
    after: "A CRM built for your process",
    points: ["CRM, CMS, and portals", "AI automation from day one", "Yours to own and extend"],
  },
  {
    tag: "04",
    title: "Software Engineering",
    track: "new",
    headline: "Built properly, so it survives contact with reality.",
    before: "Off-the-shelf that almost fits",
    after: "Software that fits exactly",
    points: ["APIs and integrations", "Data models that hold up", "Whatever stack suits"],
  },
];

export const tracks = {
  existing: { label: "I already have systems", hint: "Add AI to what you run" },
  new: { label: "I'm starting fresh and need a new solution", hint: "Build something new" },
} as const;
