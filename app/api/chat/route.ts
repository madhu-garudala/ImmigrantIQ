import Anthropic from "@anthropic-ai/sdk";
import { FORM_EXPLAINER_SYSTEM_PROMPT } from "@/lib/prompts";

const client = new Anthropic();

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: FORM_EXPLAINER_SYSTEM_PROMPT,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
