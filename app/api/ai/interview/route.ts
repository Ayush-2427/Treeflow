import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InterviewRequest {
  messages: Message[];
  facts?: Record<string, any>;
}

interface InterviewResponse {
  assistantMessage: string;
  facts: Record<string, any>;
  isReadyToGenerate: boolean;
}

const SYSTEM_PROMPT = `You are an expert roadmap planner.

Behavior:
- This is FAST mode for testing.
- Ask at most ONE question total.
- If you already asked one question and the user answered, stop asking questions.
- Then respond with "Ready to generate the roadmap." and set isReadyToGenerate = true.
- Be concise and friendly.
- No em dashes anywhere in any text.

Your job:
1) Extract and update facts from user messages.
2) If no question has been asked yet, ask ONE best clarifying question that most improves roadmap quality.
   Prefer multiple choice (2-4 options) or a short numeric answer.
3) If one question has already been asked and user replied, mark ready.

Facts shape (keep it compact):
{
  "goal": "string",
  "timeframe": "string",
  "weeklyHours": "string",
  "experienceLevel": "string",
  "constraints": "string",
  "notes": "string"
}

Response format (JSON only):
{
  "assistantMessage": "string",
  "facts": {...},
  "isReadyToGenerate": true/false
}

Return ONLY JSON. No markdown, no code blocks, no extra text.`;

function cleanJsonString(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\s*/i, "");
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*/i, "");
  if (cleaned.endsWith("```")) cleaned = cleaned.replace(/\s*```$/i, "");
  return cleaned.trim();
}

function countAssistantQuestions(messages: Message[]): number {
  // Treat lines ending with ? as a question. Good enough for FAST mode.
  return messages.filter((m) => m.role === "assistant" && m.content.trim().endsWith("?")).length;
}

function isRateLimitError(err: any): boolean {
  const msg = String(err?.message ?? err).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("resource exhausted") ||
    msg.includes("too many requests") ||
    msg.includes("quota")
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generateWithBackoff(model: any, prompt: string, attempts: number = 3) {
  let delayMs = 900;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (err: any) {
      if (i === attempts) throw err;
      if (isRateLimitError(err)) {
        await sleep(delayMs);
        delayMs *= 2;
        continue;
      }
      await sleep(200);
    }
  }
  throw new Error("Failed to call model after retries");
}

export async function POST(request: NextRequest) {
  try {
    const body: InterviewRequest = await request.json();
    const { messages, facts = {} } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // FAST MODE logic gate:
    // If we already asked 1 question AND there is at least one user message after that,
    // return ready immediately without calling Gemini (saves quota and speeds testing).
    const askedCount = countAssistantQuestions(messages);

    if (askedCount >= 1) {
      return NextResponse.json({
        assistantMessage: "Ready to generate the roadmap.",
        facts,
        isReadyToGenerate: true,
      } satisfies InterviewResponse);
    }

    // Only use small context to reduce tokens and avoid 429s
    const lastMessages = messages.slice(-6);
    const conversationHistory = lastMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    // Compact facts, no pretty print
    const compactFacts = JSON.stringify(facts);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

Current facts (compact JSON):
${compactFacts}

Conversation (recent only):
${conversationHistory}

Task:
- Update facts from the user's goal.
- Ask ONE best clarifying question that will help generate a good roadmap.
- Keep the question short.
- Prefer a multiple choice question, or ask for timeframe and weekly hours in one question.

Return ONLY the JSON object.`;

    const result = await generateWithBackoff(model, prompt, 3);
    const responseText = result.response.text();
    const cleanedText = cleanJsonString(responseText);

    let parsed: InterviewResponse;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedText);
      console.error("Parse error:", parseError);

      return NextResponse.json({
        assistantMessage:
          "Quick question: what is your timeframe and weekly hours? Example: 6 months, 8 hours per week.",
        facts,
        isReadyToGenerate: false,
      } satisfies InterviewResponse);
    }

    if (
      typeof parsed.assistantMessage !== "string" ||
      typeof parsed.facts !== "object" ||
      typeof parsed.isReadyToGenerate !== "boolean"
    ) {
      console.error("Invalid response structure:", parsed);

      return NextResponse.json({
        assistantMessage:
          "Quick question: what is your timeframe and weekly hours? Example: 6 months, 8 hours per week.",
        facts,
        isReadyToGenerate: false,
      } satisfies InterviewResponse);
    }

    // Enforce FAST mode: never allow the model to mark ready on the first turn
    // because we want exactly one question first, then ready next call.
    parsed.isReadyToGenerate = false;

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Interview API error:", error);

    if (isRateLimitError(error)) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT",
          message: "Gemini rate limit hit. Wait 10 to 30 seconds and try again.",
          details: String(error?.message ?? error),
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Failed to process interview request" }, { status: 500 });
  }
}
