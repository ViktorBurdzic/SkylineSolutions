export type Track = keyof typeof tracks;

export type Service = {
  tag: string;
  title: string;
  /** Which starting point this service answers. Drives the track split. */
  track: Track;
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
  {
    tag: "05",
    title: "Design & UX",
    track: "team",
    headline: "Screens that explain themselves.",
    before: "A system only its builder can navigate",
    after: "Software your team learns in a morning",
    points: ["UX and interface design", "Design systems", "Clickable prototypes first", "Accessible by default"],
  },
  {
    tag: "06",
    title: "QA & Testing",
    track: "team",
    headline: "Found before your customers find it.",
    before: "Your users report the bugs",
    after: "Releases that hold up on day one",
    points: ["Test plans and coverage", "Automated regression", "Release sign-off", "Bug triage and retests"],
  },
  {
    tag: "07",
    title: "Project Management",
    track: "team",
    headline: "Someone whose actual job is the deadline.",
    before: "Status updates you have to chase",
    after: "One person accountable for delivery",
    points: ["Scope and milestones", "Sprint planning", "A single point of contact", "Change and risk control"],
  },
];

/**
 * The tracks are written in the visitor's voice — they are the sentence a
 * visitor would use to describe themselves, not a category name.
 */
export const tracks = {
  existing: { label: "I already have systems", hint: "Add AI to what you run" },
  new: { label: "I'm starting fresh and need a new solution", hint: "Build something new" },
  team: { label: "I need a full delivery team", hint: "Design, QA, and delivery" },
} as const;
