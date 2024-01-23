import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { content } = await request.json();

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo-1106",
    stream: true,
    max_tokens: 4096,
  });

  const stream = OpenAIStream(chatCompletion);
  return new StreamingTextResponse(stream);
}
