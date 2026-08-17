/** Which animated scene a beat plays. See CaseStudyReel.astro. */
export type Scene = "pile" | "pipe" | "guard" | "result";

export type CaseStudy = {
  /** Mono reference in the header, e.g. "Case 01". */
  ref: string;
  /** Sector and systems — vague enough to survive an NDA. */
  context: string;
  title: string;
  /**
   * The reel, in play order. Keep `line` to roughly six words: it is a caption
   * over a moving scene, not a paragraph. The prose version of this case study
   * lives in the pitch, not on the page.
   */
  beats: { scene: Scene; label: string; line: string }[];
  /** `value` drives the count-up and the arc; `display` is what it lands on. */
  result: { value: number; display: string; unit?: string; label: string };
  stack: string[];
  /**
   * Marks the reel as a worked example rather than delivered work, and renders
   * a visible badge. Delete this line only when it describes a real engagement
   * — the badge is the difference between showing how we think and claiming a
   * result we didn't produce.
   */
  illustrative?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    ref: "Case 01",
    context: "Distribution · ERP",
    title: "Invoices that file themselves",
    beats: [
      { scene: "pile", label: "Before", line: "300 a week. Typed by hand." },
      { scene: "pipe", label: "Built", line: "An agent reads, matches, files." },
      { scene: "guard", label: "Guardrail", line: "Unsure? A human decides." },
      { scene: "result", label: "After", line: "Cleared untouched." },
    ],
    result: {
      value: 90,
      display: "90",
      unit: "%",
      label: "no human touch",
    },
    stack: ["C#", ".NET", "SQL Server", "Azure", "Claude"],
    illustrative: true,
  },
];
