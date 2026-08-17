export type TechGroup = {
  /** Plain purpose, so the group needs no explaining. */
  purpose: string;
  items: string[];
  /** Renders the model row above the items. */
  showModels?: boolean;
};

/** Shown together to make one plain point: any of these, your choice. */
export const models: { name: string; color: string }[] = [
  { name: "Claude", color: "#d97757" },
  { name: "GPT", color: "#10a37f" },
  { name: "Gemini", color: "#4285f4" },
  { name: "Llama", color: "#a78bfa" },
  { name: "Mistral", color: "#ffaf3f" },
  { name: "Self-hosted", color: "#94a3b8" },
];

export const techGroups: TechGroup[] = [
  {
    purpose: "To build it",
    items: ["C#", ".NET", "ASP.NET", "React", "TypeScript", "REST APIs"],
  },
  {
    purpose: "To store your data",
    items: ["SQL Server", "SQL", "Migrations"],
  },
  {
    purpose: "To add AI",
    items: ["LLM Integration", "RAG", "AI Agents", "MCP", "Guardrails"],
    showModels: true,
  },
  {
    purpose: "To keep it running",
    items: ["Azure", "Docker", "GitHub", "CI/CD"],
  },
];
