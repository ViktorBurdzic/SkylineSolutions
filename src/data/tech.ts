export type TechGroup = {
  label: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  {
    label: "Core engineering",
    items: ["C#", ".NET", "ASP.NET", "SQL Server", "REST APIs", "Docker"],
  },
  {
    label: "AI & automation — active focus",
    items: ["LLM Integration", "RAG", "AI Agents", "MCP", "Workflow Automation"],
  },
  {
    label: "Platform & delivery",
    items: ["Azure", "GitHub", "CI/CD"],
  },
];
