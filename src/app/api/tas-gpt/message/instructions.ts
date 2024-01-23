export type Instructions = {
  role: "system" | "user" | "assistant";
  content: any;
};

export const initialInstructions: Instructions[] = [
  {
    role: "system",
    content: "you are",
  },
  {
    role: "assistant",
    content: "content",
  },
];
