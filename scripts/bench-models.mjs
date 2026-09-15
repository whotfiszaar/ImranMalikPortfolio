#!/usr/bin/env node
// Benchmark free OpenRouter models: time to first content token + total time.
const API_KEY = process.env.OPENROUTER_API_KEY || "";

const MODELS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "nex-agi/nex-n2.5-pro:free",
      "nex-agi/nex-n2.5-mini:free",
      "nvidia/nemotron-3.5-lightning:free",
      "z-ai/glm-5.2:free",
      "poolside/laguna-s-2.1:free",
      "dots-studio/dots-3-note-preview:free",
    ];

async function bench(model) {
  const t0 = Date.now();
  const controller = new AbortController();
  const killer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        max_tokens: 60,
        temperature: 0.7,
        reasoning: { enabled: false },
        messages: [
          { role: "system", content: "Answer in one short sentence." },
          { role: "user", content: "Who is the leader of retail operations? Just say a name style answer: 'A retail leader.'" },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.log(`${model}: HTTP ${res.status} after ${Date.now() - t0}ms`);
      clearTimeout(killer);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let firstToken = null;
    let text = "";
    let done = false;
    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const payload = t.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const j = JSON.parse(payload);
          const c = j.choices?.[0]?.delta?.content;
          if (typeof c === "string" && c.length > 0) {
            if (firstToken === null) firstToken = Date.now() - t0;
            text += c;
          }
        } catch {}
      }
    }
    console.log(
      `${model}: firstToken=${firstToken === null ? "NONE" : firstToken + "ms"} total=${Date.now() - t0}ms chars=${text.length} sample="${text.slice(0, 60).replace(/\n/g, " ")}"`
    );
  } catch (e) {
    console.log(`${model}: ERROR ${String(e).slice(0, 60)} after ${Date.now() - t0}ms`);
  } finally {
    clearTimeout(killer);
  }
}

for (const m of MODELS) {
  await bench(m);
}
