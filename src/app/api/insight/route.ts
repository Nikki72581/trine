import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { TrineResult } from "@/lib/compute";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result: TrineResult = body.result;

    const { mbti, astrology, numerology, convergences, archetype } = result;

    const prompt = `You are a thoughtful personality synthesist who reads across three systems: Myers-Briggs, Astrology, and Numerology. You write in a voice that is warm, literary, and precise — never vague or generic.

Here is a user's complete profile:

ARCHETYPE: ${archetype}

MYERS-BRIGGS: ${mbti.type} — ${mbti.description}
Dominant traits: ${mbti.traits.join(", ")}

ASTROLOGY: ${astrology.sunSign} (${astrology.element}, ${astrology.modality})
${astrology.description}
Lunar sensitivity score: ${astrology.lunarScore}/100

NUMEROLOGY: Life Path ${numerology.lifePath} — ${numerology.lifePathTheme}
${numerology.lifePathDesc}
Soul urge: ${numerology.soulUrge} | Destiny lean: ${numerology.destinyLean}

CONVERGENCE THEMES: ${convergences.map(c => c.title).join(", ")}

Write a rich, personal 3-paragraph narrative insight for this person. Paragraph 1: Who they are at their core (synthesize all three systems). Paragraph 2: Their greatest strength and their signature blind spot. Paragraph 3: What they are here to do — their deeper purpose as suggested by all three systems together.

Write directly to the person as "you." Be specific, not generic. Reference their actual numbers, sign, and type. Do not bullet points or headers — flowing prose only.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
}
