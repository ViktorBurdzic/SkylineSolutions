export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Understand",
    description: "We analyze your existing software, data, and business workflow before proposing anything.",
  },
  {
    index: "02",
    title: "Identify",
    description: "We identify repetitive or expensive processes that are actually suitable for automation.",
  },
  {
    index: "03",
    title: "Integrate",
    description: "We connect AI agents to your existing CRM, APIs, databases, and internal tools.",
  },
  {
    index: "04",
    title: "Improve",
    description: "We monitor performance, security, accuracy, and cost, and continuously improve the system.",
  },
];
