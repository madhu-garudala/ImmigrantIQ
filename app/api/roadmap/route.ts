import Anthropic from "@anthropic-ai/sdk";
import { ROADMAP_SYSTEM_PROMPT } from "@/lib/prompts";
import { SCENARIO_ROADMAPS } from "@/lib/scenarios";
import type { IntakeAnswers } from "@/types";

const client = new Anthropic();

export async function POST(req: Request) {
  const answers: IntakeAnswers = await req.json();

  const userMessage = `Intake answers:
- Current visa status: ${answers.visaStatus}
- Goal: ${answers.goal}
${answers.additionalInfo ? `- Additional context: ${answers.additionalInfo}` : ""}
${answers.hasI140 !== undefined ? `- Has approved I-140: ${answers.hasI140}` : ""}
${answers.priorityDateCurrent !== undefined ? `- Priority date current: ${answers.priorityDateCurrent}` : ""}

Determine the correct scenario and return JSON only.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 256,
    system: ROADMAP_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  let parsed: { scenarioKey: string; confidence: string; note?: string };
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch?.[0] ?? text);
  } catch {
    return Response.json({ error: "Failed to parse agent response" }, { status: 500 });
  }

  if (parsed.scenarioKey === "unsupported") {
    return Response.json({ unsupported: true, note: parsed.note });
  }

  const roadmap = SCENARIO_ROADMAPS[parsed.scenarioKey];
  if (!roadmap) {
    return Response.json({ error: "Unknown scenario" }, { status: 400 });
  }

  return Response.json({ roadmap, note: parsed.note });
}
