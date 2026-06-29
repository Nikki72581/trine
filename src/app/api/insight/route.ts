import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { TrineResult } from "@/lib/compute";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result: TrineResult = body.result;

    const { mbti, astrology, numerology, convergences, archetype } = result;

    const prompt = `You are a sharp, witty friend who happens to know Myers-Briggs, Astrology, and Numerology cold. You don't write horoscope copy — you write like a clever person texting someone a read on who they are. Quick, human, a little funny, never generic.

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

Write a short, witty insight for this person in 2 tight paragraphs, max ~100 words total. Paragraph 1: who they are, with one sharp specific detail pulled from their actual type/sign/numbers. Paragraph 2: their one real strength and their one real blind spot, landed with a quick, dry sense of humor.

Write directly to the person as "you." Be specific, not generic — reference their actual numbers, sign, and type. No headers, no bullet points, no throat-clearing, no "in conclusion." Just flowing prose that sounds like a smart friend, not a fortune teller.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 250,
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
