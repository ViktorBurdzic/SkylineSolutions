export type JobMode = "automate" | "build";

export type Job = {
  title: string;
  /** Mono label shown in the console header. */
  agent: string;
  mode: JobMode;
  /** The work, broken into the steps actually walked through. */
  steps: string[];
};

export const jobModes: Record<JobMode, { label: string; hint: string; running: string; done: string }> = {
  automate: {
    label: "Automate what you already do",
    hint: "AI agents on your existing systems",
    running: "running",
    done: "done",
  },
  build: {
    label: "Build what you don't have yet",
    hint: "CRM, portals, integrations, migrations",
    running: "building",
    done: "shipped",
  },
};

/**
 * Automation jobs are ordered by commercial demand: lead qualification and
 * customer support are the most-requested agent workflows, invoice processing
 * and contract review the highest-volume document jobs.
 */
export const jobs: Job[] = [
  {
    title: "Lead Qualification",
    agent: "lead-agent",
    mode: "automate",
    steps: [
      "Catch the new enquiry",
      "Enrich it from public sources",
      "Score it against your ideal customer",
      "Route the hot ones to sales",
      "Start follow-up on the rest",
    ],
  },
  {
    title: "Customer Support",
    agent: "support-agent",
    mode: "automate",
    steps: [
      "Read the incoming ticket",
      "Retrieve the customer's history",
      "Search documentation for the answer",
      "Draft a reply in your tone",
      "Hand the tricky ones to a person",
    ],
  },
  {
    title: "Invoice Processing",
    agent: "invoice-agent",
    mode: "automate",
    steps: [
      "Read the incoming invoice",
      "Pull out line items and totals",
      "Match it to the purchase order",
      "Flag whatever fails to reconcile",
      "Queue the rest for payment",
    ],
  },
  {
    title: "Contract Review",
    agent: "contract-agent",
    mode: "automate",
    steps: [
      "Ingest the document",
      "Find the clauses that matter",
      "Compare against your standard terms",
      "Highlight every deviation",
      "Summarise the risk for legal",
    ],
  },
  {
    title: "Collections",
    agent: "dunning-agent",
    mode: "automate",
    steps: [
      "Scan open invoices",
      "Flag the accounts past due",
      "Weigh payment history and risk",
      "Draft the right next action",
      "Escalate the exceptions to a human",
    ],
  },

  {
    title: "Custom CRM",
    agent: "crm-build",
    mode: "build",
    steps: [
      "Map how your team actually works",
      "Model the data behind it",
      "Build the screens and workflows",
      "Wire in AI where it saves time",
      "Migrate your data and go live",
    ],
  },
  {
    title: "Customer Portal & CMS",
    agent: "portal-build",
    mode: "build",
    steps: [
      "Decide what customers can self-serve",
      "Design the pages and permissions",
      "Build a CMS your team can edit",
      "Connect it to your back office",
      "Ship it and hand over the keys",
    ],
  },
  {
    title: "System Integration",
    agent: "integration-build",
    mode: "build",
    steps: [
      "Inventory the systems in play",
      "Agree the single source of truth",
      "Build the APIs between them",
      "Reconcile the data that disagrees",
      "Monitor it once it is live",
    ],
  },
  {
    title: "Legacy Migration",
    agent: "migration-build",
    mode: "build",
    steps: [
      "Read the code nobody wants to touch",
      "Document what it really does",
      "Rebuild it on a modern stack",
      "Run both in parallel to prove it",
      "Retire the old system",
    ],
  },
];
