export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  { index: "01", title: "Understand", description: "Learn your systems first." },
  { index: "02", title: "Identify", description: "Find what's worth automating." },
  { index: "03", title: "Integrate", description: "Connect AI to your stack." },
  { index: "04", title: "Improve", description: "Monitor, refine, repeat." },
];
