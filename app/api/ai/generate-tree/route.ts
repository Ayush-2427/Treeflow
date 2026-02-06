// FILE 2: app/api/ai/generate-tree/route.ts
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

interface GenerateTreeRequest {
  messages: Message[];
  facts: Record<string, any>;
  constraints?: {
    maxDepth?: number;
    maxNodes?: number;
    maxBranches?: number;
  };
}

interface TreeNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    notes: string;
    completed: boolean;
    color: string;
    nodeType: string;
  };
}

interface TreeEdge {
  id: string;
  source: string;
  target: string;
}

interface TreeOutput {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

const TREE_GENERATION_PROMPT = `You are a decision tree architect. Generate a complete, actionable tree structure based on the interview facts.

Requirements:
- Maximum depth: 3 levels (root + 2 levels of children)
- Maximum total nodes: 25
- Create 2-4 main branches from the root
- Node titles: 3-9 words, actionable and specific
- Node descriptions: 1 short sentence, maximum 15 words
- No em dashes anywhere in any text

Node types to use:
- "process": Regular action/task steps (most common)
- "decision": Decision points or choice nodes
- "start": Use only for the root node
- "end": Final outcome or completion nodes
- "note": Supporting information or reminders

Color palette (use hex codes):
- "#3B82F6" (blue) - default for process nodes
- "#8B5CF6" (purple) - for decision nodes
- "#10B981" (green) - for start/positive outcomes
- "#EF4444" (red) - for end/critical paths
- "#F59E0B" (amber) - for notes/warnings

Positions:
- Set every node position to {"x": 0, "y": 0}.
- Do not attempt layout. The client will layout the graph.

Node ID format: "root", "node-1", "node-2", etc.
Edge ID format: "{sourceId}-{targetId}"

Output JSON schema:
{
  "nodes": [
    {
      "id": "string",
      "type": "string",
      "position": {"x": 0, "y": 0},
      "data": {
        "title": "string",
        "description": "string",
        "notes": "string",
        "completed": false,
        "color": "string",
        "nodeType": "string"
      }
    }
  ],
  "edges": [
    {"id": "string", "source": "string", "target": "string"}
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no extra text. Just the JSON object with nodes and edges arrays.`;

function cleanJsonString(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\s*/i, "");
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*/i, "");
  if (cleaned.endsWith("```")) cleaned = cleaned.replace(/\s*```$/i, "");
  return cleaned.trim();
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

function validateTreeOutput(parsed: TreeOutput) {
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || parsed.nodes.length === 0) {
    throw new Error("Invalid tree structure: missing or empty nodes/edges");
  }

  for (const node of parsed.nodes) {
    if (
      !node.id ||
      !node.type ||
      !node.position ||
      typeof node.position.x !== "number" ||
      typeof node.position.y !== "number" ||
      !node.data ||
      typeof node.data.title !== "string" ||
      typeof node.data.description !== "string" ||
      typeof node.data.notes !== "string" ||
      typeof node.data.completed !== "boolean" ||
      typeof node.data.color !== "string" ||
      typeof node.data.nodeType !== "string"
    ) {
      throw new Error(`Invalid node structure: ${JSON.stringify(node)}`);
    }
  }

  const nodeIds = new Set(parsed.nodes.map((n) => n.id));
  for (const edge of parsed.edges) {
    if (!edge.id || !edge.source || !edge.target) {
      throw new Error(`Invalid edge structure: ${JSON.stringify(edge)}`);
    }
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error(`Edge references missing node: ${JSON.stringify(edge)}`);
    }
  }
}

async function generateTreeWithBackoff(model: any, basePrompt: string, maxAttempts: number = 3) {
  let delayMs = 1200;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const prompt =
        attempt === 1
          ? basePrompt
          : `${basePrompt}\n\nFix ONLY the JSON to match the schema exactly. Return ONLY valid JSON.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanedText = cleanJsonString(responseText);

      const parsed: TreeOutput = JSON.parse(cleanedText);
      validateTreeOutput(parsed);

      return parsed;
    } catch (error: any) {
      console.error(`Tree generation attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) throw error;

      if (isRateLimitError(error)) {
        await sleep(delayMs);
        delayMs *= 2;
        continue;
      }

      await sleep(300);
    }
  }

  throw new Error("Failed to generate valid tree after retries");
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTreeRequest = await request.json();
    const { messages, facts, constraints } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    if (!facts || Object.keys(facts).length === 0) {
      return NextResponse.json({ error: "Facts object is required" }, { status: 400 });
    }

    const maxDepth = constraints?.maxDepth ?? 3;
    const maxNodes = constraints?.maxNodes ?? 25;
    const maxBranches = constraints?.maxBranches ?? 4;

    const lastMessages = messages.slice(-4);
    const recentContext = lastMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const compactFacts = JSON.stringify(facts);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${TREE_GENERATION_PROMPT}

Interview facts (compact JSON):
${compactFacts}

Recent context (last turns only):
${recentContext}

Constraints:
- Max depth: ${maxDepth}
- Max total nodes: ${maxNodes}
- Main branches from root: 2-${maxBranches}

Generate a complete, actionable decision tree. Return ONLY the JSON with nodes and edges arrays.`;

    const tree = await generateTreeWithBackoff(model, prompt, 3);

    return NextResponse.json({ tree });
  } catch (error: any) {
    const msg = String(error?.message ?? error);

    if (isRateLimitError(error)) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT",
          message: "Gemini rate limit hit. Wait 30 to 60 seconds and try again.",
          details: msg,
        },
        { status: 429 }
      );
    }

    console.error("Generate tree API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate tree",
        details: msg,
      },
      { status: 500 }
    );
  }
}
