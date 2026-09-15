import { NextRequest } from "next/server";
import { buildAssistantPrompt } from "@/lib/bio-data";

export const runtime = "nodejs";
export const maxDuration = 60;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

// Hardcoded safety net in case the live model list cannot be fetched.
// Ordered by measured first-token latency.
const FALLBACK_MODELS = [
  "nvidia/nemotron-3.5-lightning:free",
  "nex-agi/nex-n2.5-pro:free",
  "dots-studio/dots-3-note-preview:free",
  "z-ai/glm-5.2:free",
  "openrouter/free",
];
interface ModelInfo {
  id: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { modality?: string; input_modalities?: string[]; output_modalities?: string[] };
}

let modelCache: { models: string[]; fetchedAt: number } | null = null;
const MODEL_CACHE_MS = 1000 * 60 * 30; // 30 minutes: picks up new fast models quickly

// Preference ranking for free chat models. Speed matters as much as
// quality here: compact, high-throughput models rank first so the
// visitor sees the first token as early as possible. Benchmarked live:
// nemotron-3.5-lightning and dots-3-note consistently answer in under
// one second with reasoning disabled.
const PREFERENCE_RULES: { pattern: RegExp; score: number }[] = [
  { pattern: /nemotron-3\.5-lightning/i, score: 100 },
  { pattern: /nex-n2\.5-pro/i, score: 96 },
  { pattern: /dots-3-note/i, score: 94 },
  { pattern: /glm-5/i, score: 92 },
  { pattern: /nex-n2\.5-mini/i, score: 90 },
  { pattern: /gemini.*flash/i, score: 87 },
  { pattern: /nemotron-3-super/i, score: 84 },
  { pattern: /ling-3\.0-flash(?!-(fin|sante|vl))/i, score: 82 },
  { pattern: /gemma-4.*31b/i, score: 80 },
  { pattern: /deepseek.*(v3|chat)/i, score: 79 },
  { pattern: /llama.*(70b|3\.3)/i, score: 75 },
  { pattern: /gemma-4.*26b/i, score: 72 },
  { pattern: /laguna-s/i, score: 68 },
  { pattern: /laguna-xs/i, score: 66 },
  { pattern: /openrouter\/free/i, score: 65 },
  { pattern: /qwen.*(72b|32b)/i, score: 62 },
  { pattern: /mistral/i, score: 58 },
  { pattern: /gemma.*(27b|2)\b/i, score: 56 },
  { pattern: /ling-3.*flash/i, score: 55 }, // domain-tuned siblings, usable
  { pattern: /glm/i, score: 50 },
  { pattern: /cohere/i, score: 40 },
];

// Models that must never serve this chat: code-only, safety classifiers,
// vision-first variants, or models that hard-require reasoning.
const BLACKLIST = [
  /north-mini-code/i,
  /content-safety/i,
  /ling-3\.0-flash-vl/i,
  /lfm/i,
  /inkling/i,
  /nemotron-3-nano-omni/i,
  /nemotron-3-ultra/i,
];

function scoreModel(model: ModelInfo): number {
  if (BLACKLIST.some((pattern) => pattern.test(model.id))) return -999;
  let score = 10;
  for (const rule of PREFERENCE_RULES) {
    if (rule.pattern.test(model.id)) {
      score = rule.score;
      break;
    }
  }
  const ctx = model.context_length ?? 0;
  if (ctx >= 128000) score += 6;
  else if (ctx >= 32000) score += 3;
  if (ctx > 0 && ctx < 16000) score -= 30;
  if (model.id.includes(":free-online")) score -= 20;
  return score;
}

function isFreeChatModel(model: ModelInfo): boolean {
  const pricing = model.pricing ?? {};
  const promptFree = pricing.prompt === "0" || pricing.prompt === "0.0";
  const completionFree = pricing.completion === "0" || pricing.completion === "0.0";
  const idFree = model.id.endsWith(":free") || model.id === "openrouter/free";
  if (!(idFree || (promptFree && completionFree))) return false;
  // Chat only: single output modality, text
  const outputs = model.architecture?.output_modalities;
  if (!outputs || outputs.length !== 1 || outputs[0] !== "text") return false;
  return true;
}

// Runtime health tracking: models that just failed (429, 503, timeout,
// empty stream) are deprioritized for 10 minutes so the chain always
// leans toward what is actually healthy right now.
const modelHealth = new Map<string, number>();
const HEALTH_PENALTY_MS = 1000 * 60 * 10;

function noteModelFailure(model: string): void {
  modelHealth.set(model, Date.now());
  if (modelHealth.size > 60) {
    const cutoff = Date.now() - HEALTH_PENALTY_MS;
    for (const [key, ts] of modelHealth) {
      if (ts < cutoff) modelHealth.delete(key);
    }
  }
}

function isModelCoolingDown(model: string): boolean {
  const failedAt = modelHealth.get(model);
  return typeof failedAt === "number" && Date.now() - failedAt < HEALTH_PENALTY_MS;
}

async function getFreeModelCandidates(): Promise<string[]> {
  const now = Date.now();
  if (modelCache && now - modelCache.fetchedAt < MODEL_CACHE_MS) {
    return reorderForHealth(modelCache.models);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${OPENROUTER_BASE}/models`, {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`models fetch failed: ${res.status}`);
    const json = (await res.json()) as { data?: ModelInfo[] };
    const models = (json.data ?? []).filter(isFreeChatModel);
    models.sort((a, b) => scoreModel(b) - scoreModel(a));
    let ids = models.slice(0, 8).map((m) => m.id);
    if (ids.length === 0) ids = [...FALLBACK_MODELS];
    modelCache = { models: ids, fetchedAt: now };
    return reorderForHealth(ids);
  } catch {
    modelCache = { models: [...FALLBACK_MODELS], fetchedAt: now - MODEL_CACHE_MS + 60000 };
    return reorderForHealth(FALLBACK_MODELS);
  }
}

// Healthy models first, cooling-down models pushed to the back.
function reorderForHealth(models: string[]): string[] {
  const healthy = models.filter((m) => !isModelCoolingDown(m));
  const cooling = models.filter((m) => isModelCoolingDown(m));
  return [...healthy, ...cooling];
}

// Clean assistant output: no em dashes, no en dashes, no attribution text.
// Never trims: whitespace-only deltas carry real spaces between words.
function sanitize(text: string): string {
  return text
    .replace(/[\u2014\u2013\u2012]/g, "-")
    .replace(/powered\s+by\s+[^\n.!]*/gi, "")
    .replace(/via\s+openrouter/gi, "");
}

// Some free models leak their chain of thought into the content stream.
// These starters are specific enough that normal answers stay untouched.
const THINKING_LEAK = [
  /^here'?s (a |my )?thinking/i,
  /^thinking (process|through)/i,
  /^\*\*thinking\*\*/i,
  /^let me (think|analy[sz]e|process|work through|start by)/i,
  /^i'?ll (think|analy[sz]e|work through)/i,
  /^(analysis|analyzing)\s*[:*]/i,
  /^(step\s*1|first step)\s*[:.]/i,
  /^\d+\.\s+\*\*(analy|identify|understand|review)/i,
];

function looksLikeThinking(text: string): boolean {
  const trimmed = text.replace(/^[\s\ufeff]+/, "");
  return THINKING_LEAK.some((pattern) => pattern.test(trimmed));
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Very light in-memory rate limit: 30 requests per IP per 60 seconds
const rateMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60000;
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < window);
  hits.push(now);
  rateMap.set(ip, hits);
  if (rateMap.size > 500) {
    for (const [key, times] of rateMap) {
      if (times.every((t) => now - t > window)) rateMap.delete(key);
    }
  }
  return hits.length > 30;
}

function friendlyFallback(): string {
  const options = [
    "I am stepping away for a moment. Please try again shortly.",
    "My connection is taking a short break. Please ask me again in a little while.",
    "I could not finish that thought. Kindly try again in a moment.",
  ];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Local knowledge base. When every upstream model is unavailable
 * (quota exhausted, network down, provider outage), the assistant still
 * answers from Imran's bio so the visitor is never left with an error.
 * Same voice and rules as the model prompt: warm, short, no em dashes.
 */
function localAnswer(history: ChatMessage[]): string {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const q = (lastUser?.content ?? "").toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hello", "hi there", "hey", "namaste", "good morning", "good afternoon", "good evening") && q.length < 25) {
    return "Hello. I am Imran's AI assistant. Ask me about his roles, brands, skills, or how to reach him.";
  }
  if (has("who are you", "what are you", "are you ai", "are you a bot", "your name")) {
    return "I am the AI assistant on Imran Malik's portfolio website, trained on his professional journey. I can tell you about his career, brands, education, and how to contact him.";
  }
  if (has("contact", "email", "phone", "reach", "number", "whatsapp", "linkedin", "get in touch", "connect")) {
    return "You can reach Imran at imrankn22@gmail.com or +91 91684 22339. He is based in Mumbai, India. His LinkedIn is linkedin.com/in/imran-kn.";
  }
  if (has("current", "right now", "present", "now at", "working as", "today")) {
    return "Since November 2025, Imran is Operations Manager at Tira Beauty, heading retail sales and operations. Before this he was a Store Director with Tira during its rapid expansion phase.";
  }
  if (has("tira")) {
    return "Imran has been one of the early Store Directors at Tira Beauty, India's fast-growing beauty retail brand by Reliance. He contributed to new store openings and drove stores to hit milestone targets. Since November 2025 he is Operations Manager at Tira, heading retail sales and operations.";
  }
  if (has("ikea")) {
    return "Imran was the IKEA Family Leader and City Marketing Manager at IKEA from 2021 to 2022. He ran loyalty programs, city-wide customer engagement, and community events that grew store traffic and member participation.";
  }
  if (has("kama")) {
    return "Imran spent about six years at Kama Ayurveda, growing from Retail Store Manager to Retail Operations Manager between 2015 and 2021. He led new store openings, regional operations for West and South India, and sales planning.";
  }
  if (has("forest essentials", "forest")) {
    return "Imran began his retail career at Forest Essentials, managing the luxury Ayurveda store at Mumbai International Airport Terminal 2 from 2013 to 2015. He grew the store's revenue and delivered premium customer experiences.";
  }
  if (has("education", "study", "degree", "qualification", "llb", "law", "diploma", "pgdm", "bba", "college", "university", "studied")) {
    return "Imran holds a Bachelor of Law (LLB) from University of Mumbai, a PGDM in Marketing Management from iFEEL with a CGPA of 3.7 out of 4.0, a BBA in Marketing Management from Sinhgad Institute of Management, and a Diploma in Innovation and Entrepreneurship.";
  }
  if (has("experience", "career", "journey", "background", "how long", "years", "work history")) {
    return "Imran has more than ten years in India's beauty, luxury, and organized retail. He has led teams at Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials, across eight roles from Store Manager to Operations Manager.";
  }
  if (has("skill", "strength", "expert", "good at", "specialize")) {
    return "Imran's core strengths are retail operations, multi-store leadership, P&L management, new store launches, customer experience, and team coaching. Colleagues also praise his analytical mindset and creative marketing sense.";
  }
  if (has("recommend", "reference", "testimonial", "people say", "colleague")) {
    return "Twelve colleagues and leaders have recommended Imran, including a Consulting Business Head who managed him at Tira, an IKEA brand leader, and a DGM at Hindustan Times. They highlight his ownership, team spirit, and ability to grow sales.";
  }
  if (has("where", "location", "based", "mumbai", "live")) {
    return "Imran is based in Mumbai, India, and has led retail operations across West and South India.";
  }
  if (has("thank", "thanks", "great", "awesome", "nice")) {
    return "You are most welcome. If you would like to connect with Imran, his email is imrankn22@gmail.com.";
  }
  return "Imran Malik is a Retail Operations and Business Management Leader in Mumbai with more than ten years across Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials. Ask me about his roles, education, or skills, or reach him at imrankn22@gmail.com.";
}

// Warm the model list as soon as the route module loads so the first
// visitor never pays the catalog-fetch latency.
getFreeModelCandidates().catch(() => {});

/**
 * Try one model. Returns a clean text stream, or null when the model
 * failed, returned nothing, or leaked chain-of-thought into content.
 * firstTokenMs caps how long we wait for the first visible characters;
 * healthy free models answer in under two seconds, so the defaults are
 * deliberately tight to keep failovers quick.
 */
async function tryModel(
  model: string | string[],
  messages: Array<{ role: string; content: string }>,
  firstTokenMs = 8000
): Promise<ReadableStream<Uint8Array> | null> {
  const controller = new AbortController();
  let watchdog: ReturnType<typeof setTimeout> | null = null;
  const bump = (ms: number) => {
    if (watchdog) clearTimeout(watchdog);
    watchdog = setTimeout(() => controller.abort(), ms);
  };
  const cleanup = () => {
    if (watchdog) clearTimeout(watchdog);
    watchdog = null;
  };

  try {
    bump(firstTokenMs); // headers plus first content token within the cap
    // Reasoning is disabled: free models burn their token budget on
    // hidden chain-of-thought otherwise, delaying the first visible
    // word by seconds and leaking thinking into some streams.
    const body: Record<string, unknown> = {
      stream: true,
      max_tokens: 420,
      temperature: 0.7,
      reasoning: { enabled: false },
      messages,
    };
    if (Array.isArray(model)) {
      body.models = model;
      body.route = "fallback";
    } else {
      body.model = model;
    }
    const upstream = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-OpenRouter-Title": "Imran Malik Portfolio",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      cleanup();
      return null;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Stateful SSE parser: buffers partial lines across network chunks.
    // Also watches for the [DONE] sentinel: some providers keep the
    // socket open after it, so EOF alone is not a reliable end signal.
    let lineBuffer = "";
    let sawDone = false;
    function parseChunk(raw: string): string {
      lineBuffer += raw;
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";
      let text = "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload) continue;
        if (payload === "[DONE]") {
          sawDone = true;
          continue;
        }
        try {
          const json = JSON.parse(payload);
          const choices = json.choices;
          if (!Array.isArray(choices) || choices.length === 0) continue;
          const content = choices[0]?.delta?.content;
          if (typeof content === "string") text += content;
        } catch {
          // partial or keepalive line, ignore
        }
      }
      return text;
    }

    // Phase 1: gather the start of the visible answer (about 60 characters)
    // so chain-of-thought leaks can be detected before anything reaches the user.
    let firstText = "";
    while (!sawDone && firstText.length < 60) {
      const { done, value } = await reader.read();
      if (done) {
        sawDone = true;
        break;
      }
      firstText += parseChunk(decoder.decode(value, { stream: true }));
    }

    if (firstText.length === 0) {
      cleanup();
      reader.cancel().catch(() => {});
      return null; // empty response
    }
    if (looksLikeThinking(firstText)) {
      cleanup();
      reader.cancel().catch(() => {});
      return null; // thinking leak, try the next model
    }

    // Phase 2: stream the rest. Everything is pumped inside start() so the
    // stream closes deterministically on upstream EOF, the [DONE] sentinel,
    // or an error, no matter what the socket does afterwards.
    return new ReadableStream<Uint8Array>({
      async start(streamController) {
        try {
          streamController.enqueue(encoder.encode(sanitize(firstText)));
          while (!sawDone) {
            bump(30000); // each further chunk within 30 seconds
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = parseChunk(decoder.decode(value, { stream: true }));
            if (chunk.length > 0) {
              streamController.enqueue(encoder.encode(sanitize(chunk)));
            }
          }
        } catch {
          // upstream dropped mid-stream: deliver what we have, then close
        } finally {
          cleanup();
          try {
            streamController.close();
          } catch {
            // already closed
          }
        }
      },
      cancel() {
        cleanup();
        reader.cancel().catch(() => {});
      },
    });
  } catch {
    cleanup();
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    if (isRateLimited(ip)) {
      return Response.json(
        { reply: "You are sending messages very quickly. Please take a short pause and try again." },
        { status: 200 }
      );
    }

    const body = (await req.json()) as { messages?: ChatMessage[] };
    const history = (body.messages ?? [])
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-8); // keep the last 8 turns: shorter prefill, faster answers

    if (history.length === 0) {
      return Response.json({ reply: "Ask me anything about Imran Malik and his career." });
    }

    const systemPrompt = buildAssistantPrompt();
    const messages = [{ role: "system", content: systemPrompt }, ...history];
    const candidates = await getFreeModelCandidates();

    // Total time budget: the visitor should never wait longer than this
    // before getting a useful answer, no matter how unhealthy the free
    // model pool is at the moment.
    const startedAt = Date.now();
    const BUDGET_MS = 22000;

    // First attempt: top candidates passed together (max 3, an OpenRouter
    // limit) so the platform can fail over between them server-side
    // without extra round trips.
    const group = candidates.slice(0, 3);
    const groupStream = await tryModel(group, messages);
    if (groupStream) {
      return new Response(groupStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }
    group.forEach(noteModelFailure);

    // Server-side fallback group failed or returned unusable content: try the
    // remaining candidates one by one, within the time budget.
    for (const model of candidates.slice(3, 8)) {
      if (Date.now() - startedAt > BUDGET_MS) break;
      const stream = await tryModel(model, messages, 6000);
      if (stream) {
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      }
      noteModelFailure(model);
    }

    // All models failed (quota, outage, network): answer from the local
    // knowledge base so the visitor always gets a useful reply.
    return Response.json({ reply: localAnswer(history) });
  } catch {
    return Response.json({ reply: friendlyFallback() });
  }
}
