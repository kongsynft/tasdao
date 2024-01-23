import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistantId = process.env.ASSISTANT_ID as string;

export async function POST(request: Request) {
  const { content } = await request.json();

  const assistant = await openai.beta.assistants.retrieve(assistantId);
  const thread = await openai.beta.threads.create();
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  const intervalId = setInterval(async () => {
    const run_info = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (run_info.status === "completed") {
      console.log(run_info);
      clearInterval(intervalId);
    } else if (run_info.status === "in_progress") {
      console.log("Run is in progress, checking again in 1 second...");
    } else {
      console.log("Unexpected status: ", run_info.status);
      clearInterval(intervalId);
    }
  }, 1000);

  return new Response();
}
