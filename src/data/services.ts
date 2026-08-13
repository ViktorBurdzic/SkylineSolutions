export type Service = {
  tag: string;
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    tag: "01",
    title: "AI Agents & Business Automation",
    description:
      "We build AI-powered workflows that do real work inside your business — not chat widgets that answer questions and stop there.",
    points: [
      "Retrieve and cross-reference business information on request",
      "Call internal and third-party APIs to complete tasks",
      "Analyze customer and account data for patterns and risk",
      "Prepare drafts, summaries, and communications for review",
      "Create tasks and trigger downstream processes",
      "Operate with human approval where the outcome requires it",
    ],
  },
  {
    tag: "02",
    title: ".NET & Enterprise Software",
    description:
      "The engineering foundation everything else depends on: reliable, well-structured software built on a mature stack.",
    points: [
      "C#, .NET, and ASP.NET application development",
      "SQL Server schema design and query optimization",
      "REST API design and integration",
      "Enterprise and line-of-business applications",
      "Legacy system modernization and refactoring",
    ],
  },
  {
    tag: "03",
    title: "AI-Powered Modernization",
    description:
      "Your existing software contains years of business knowledge. You don't need to replace it to make that knowledge usable — you need to connect it.",
    points: [
      "AI capabilities layered around existing CRM and ERP systems",
      "Structured and unstructured data made queryable",
      "Internal documentation turned into an answerable knowledge base",
      "Legacy applications extended without a rebuild",
    ],
  },
];
