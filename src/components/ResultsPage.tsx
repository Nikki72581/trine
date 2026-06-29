"use client";
import { useState, useRef } from "react";
import type { TrineResult } from "@/lib/compute";
import { clarityLabel } from "@/lib/compute";
import { TriangleDiagram } from "./TriangleDiagram";

const MBTI_COLOR  = "#6E78C9";
const ASTRO_COLOR = "#9A6FD0";
const NUM_COLOR   = "#C77399";

function Pill({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      padding: "14px 22px",
      background: color + "18",
      borderRadius: 14,
      minWidth: 120,
    }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontSize: 22, fontWeight: 600, color: "#292521" }}>{value}</span>
    </div>
  );
}

function BarRow({ label, pct, letter, color }: { label: string; pct: number; letter: string; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#6E665E" }}>{label}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color, fontWeight: 500 }}>{letter} · {pct}%</span>
      </div>
      <div style={{ height: 6, background: "#ECE7E0", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "#9A938B" }}>{clarityLabel(pct)} preference</span>
    </div>
  );
}

interface Props {
  result: TrineResult;
  name: string;
  onRestart: () => void;
}

export function ResultsPage({ result, name, onRestart }: Props) {
  const { mbti, astrology, numerology, convergences, archetype, tagline, eyebrow } = result;
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const aiRef = useRef<HTMLDivElement>(null);

  async function loadInsight() {
    setAiLoading(true);
    setAiText("");
    setAiDone(false);
    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiText(prev => prev + dec.decode(value));
        aiRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      setAiDone(true);
    } catch (e) {
      setAiText("Sorry — couldn't generate insight right now. Make sure ANTHROPIC_API_KEY is set in your .env.local.");
      setAiDone(true);
    } finally {
      setAiLoading(false);
    }
  }

  const systemColors: Record<string, string> = { mbti: MBTI_COLOR, astro: ASTRO_COLOR, num: NUM_COLOR };
  const systemLabels: Record<string, string> = { mbti: "MBTI", astro: "Astrology", num: "Numerology" };

  return (
    <div style={{ width: "100%", maxWidth: 1040, flex: 1, paddingBottom: 90, animation: "fadeUp .55s ease both" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "18px 0 46px", borderBottom: "1px solid #ECE7E0" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", color: ASTRO_COLOR, display: "block", marginBottom: 6 }}>
          {eyebrow}
        </span>
        {name && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9A938B", display: "block", marginBottom: 14 }}>
            {name.toUpperCase()}
          </span>
        )}
        <h1 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.025em", margin: "0 0 20px" }}>
          {archetype}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#574F47", maxWidth: 560, margin: "0 auto 34px" }}>
          {tagline}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Pill color={MBTI_COLOR}  label="Myers–Briggs" value={mbti.type} />
          <Pill color={ASTRO_COLOR} label="Sun Sign"     value={`${astrology.symbol} ${astrology.sunSign}`} />
          <Pill color={NUM_COLOR}   label="Life Path"    value={String(numerology.lifePath)} />
        </div>
      </section>

      {/* ── TWO-COL: DIAGRAM + CONVERGENCES ─────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "48px 0 48px", borderBottom: "1px solid #ECE7E0", alignItems: "start" }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "#9A938B", marginBottom: 24 }}>
            WHERE YOUR SYSTEMS CONVERGE
          </p>
          <TriangleDiagram result={result} />
        </div>

        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "#9A938B", marginBottom: 24 }}>
            CONVERGENCE THEMES
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {convergences.map(c => (
              <div key={c.title} style={{
                background: "#fff",
                border: "1px solid #E2DCD3",
                borderRadius: 14,
                padding: "20px 22px",
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {c.systems.map(s => (
                    <span key={s} style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: systemColors[s] + "18",
                      color: systemColors[s],
                      border: `1px solid ${systemColors[s]}44`,
                    }}>
                      {systemLabels[s]}
                    </span>
                  ))}
                  {c.systems.length > 1 && (
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "#29252118",
                      color: "#574F47",
                      border: "1px solid #29252122",
                    }}>
                      CONVERGENCE
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: 17, margin: "0 0 8px" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#574F47", margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE SYSTEM BREAKDOWNS ──────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: "48px 0", borderBottom: "1px solid #ECE7E0" }}>

        {/* MBTI */}
        <div style={{ background: "#fff", border: "1px solid #E2DCD3", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${MBTI_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: MBTI_COLOR, margin: "0 0 6px" }}>MYERS–BRIGGS</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "0.03em", color: MBTI_COLOR, margin: "0 0 4px" }}>{mbti.type}</h3>
          <p style={{ fontSize: 13, color: "#6E665E", margin: "0 0 16px", lineHeight: 1.5 }}>{mbti.description}</p>
          <p style={{ fontSize: 11.5, color: "#9A938B", margin: "0 0 18px", lineHeight: 1.5 }}>
            Clarity reflects how consistently you leaned one way, not strength or skill — a slight preference is just as valid as a very clear one.
          </p>
          <BarRow label="Introvert / Extravert" pct={mbti.EI_pct} letter={mbti.EI} color={MBTI_COLOR} />
          <BarRow label="Sensing / Intuition"   pct={mbti.SN_pct} letter={mbti.SN} color={MBTI_COLOR} />
          <BarRow label="Thinking / Feeling"     pct={mbti.TF_pct} letter={mbti.TF} color={MBTI_COLOR} />
          <BarRow label="Judging / Perceiving"   pct={mbti.JP_pct} letter={mbti.JP} color={MBTI_COLOR} />
          <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {mbti.traits.map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 10px", background: MBTI_COLOR + "14", color: MBTI_COLOR, borderRadius: 6 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Astrology */}
        <div style={{ background: "#fff", border: "1px solid #E2DCD3", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${ASTRO_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: ASTRO_COLOR, margin: "0 0 6px" }}>ASTROLOGY</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 28, color: ASTRO_COLOR, margin: "0 0 2px" }}>
            {astrology.symbol} {astrology.sunSign}
          </h3>
          <p style={{ fontSize: 12, color: "#9A938B", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", margin: "0 0 4px" }}>
            {astrology.element} · {astrology.modality}
          </p>
          <p style={{ fontSize: 13, color: "#6E665E", margin: "0 0 22px", lineHeight: 1.5 }}>{astrology.description}</p>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "#9A938B", marginBottom: 6, letterSpacing: "0.06em" }}>LUNAR SENSITIVITY</p>
            <div style={{ height: 6, background: "#ECE7E0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${astrology.lunarScore}%`, background: ASTRO_COLOR, borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 11, color: "#9A938B", marginTop: 4 }}>{astrology.lunarScore}/100</p>
          </div>
          <p style={{ fontSize: 12, color: "#9A938B", marginBottom: 12 }}>
            Elemental lean: <strong style={{ color: "#574F47" }}>{astrology.elementFromAnswers}</strong>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {astrology.traits.map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 10px", background: ASTRO_COLOR + "14", color: ASTRO_COLOR, borderRadius: 6 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Numerology */}
        <div style={{ background: "#fff", border: "1px solid #E2DCD3", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${NUM_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: NUM_COLOR, margin: "0 0 6px" }}>NUMEROLOGY</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 32, color: NUM_COLOR, margin: "0 0 2px" }}>
            {numerology.lifePath}
          </h3>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#9A938B", letterSpacing: "0.06em", margin: "0 0 4px" }}>
            LIFE PATH · {numerology.lifePathTheme}
          </p>
          <p style={{ fontSize: 13, color: "#6E665E", margin: "0 0 16px", lineHeight: 1.5 }}>{numerology.lifePathDesc}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#9A938B", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>EXPRESSION NO.</span>
              <span style={{ fontWeight: 600, color: "#292521" }}>{numerology.expressionNumber}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#9A938B", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>SOUL URGE</span>
              <span style={{ fontWeight: 600, color: "#292521" }}>{numerology.soulUrge}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#9A938B", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>DESTINY LEAN</span>
              <span style={{ fontWeight: 600, color: "#292521" }}>{numerology.destinyLean}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {numerology.traits.map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 10px", background: NUM_COLOR + "14", color: NUM_COLOR, borderRadius: 6 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI INSIGHT ───────────────────────────────────────── */}
      <section style={{ padding: "48px 0" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "#9A938B", marginBottom: 16 }}>
          AI SYNTHESIS
        </p>
        {!aiText && !aiLoading && (
          <div style={{ background: "#fff", border: "1px solid #E2DCD3", borderRadius: 16, padding: "32px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: 22, margin: "0 0 8px" }}>
                Get your personal narrative
              </h3>
              <p style={{ fontSize: 15, color: "#574F47", margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
                A Claude-generated insight synthesizes all three systems into a rich, personalized portrait — who you are, your strengths, your blind spots, and what you&apos;re here to do.
              </p>
            </div>
            <button
              onClick={loadInsight}
              style={{
                fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "#FAF8F5",
                background: "#292521",
                border: "none",
                borderRadius: 99,
                padding: "13px 28px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Generate insight ✦
            </button>
          </div>
        )}

        {aiLoading && !aiText && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <svg width={40} height={40} viewBox="0 0 24 24" style={{ animation: "spin 3s linear infinite", margin: "0 auto 16px" }}>
              <polygon points="12,3 21,19 3,19" fill="none" stroke="#E2DCD3" strokeWidth="1.2" />
              <circle cx="12" cy="3" r="2.2" fill={MBTI_COLOR} />
              <circle cx="21" cy="19" r="2.2" fill={ASTRO_COLOR} />
              <circle cx="3" cy="19" r="2.2" fill={NUM_COLOR} />
            </svg>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#9A938B", letterSpacing: "0.06em" }}>Synthesizing your profile…</p>
          </div>
        )}

        {aiText && (
          <div ref={aiRef} style={{ background: "#fff", border: "1px solid #E2DCD3", borderRadius: 16, padding: "32px 28px" }}>
            <p style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", color: "#9A938B", marginBottom: 20 }}>
              ✦ CLAUDE SYNTHESIS · {archetype.toUpperCase()}
            </p>
            <div style={{ fontSize: 16, lineHeight: 1.8, color: "#33302B", whiteSpace: "pre-wrap" }}>
              {aiText}
              {!aiDone && <span style={{ animation: "pulse 1s infinite", display: "inline-block", width: 2, height: 18, background: "#9A6FD0", marginLeft: 2, verticalAlign: "middle" }} />}
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ACTIONS ───────────────────────────────────── */}
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <button
          onClick={onRestart}
          style={{
            fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
            fontSize: 14,
            color: "#6E665E",
            background: "none",
            border: "1px solid #E2DCD3",
            borderRadius: 99,
            padding: "10px 26px",
            cursor: "pointer",
          }}
        >
          ✦ Start a new reading
        </button>
      </div>
    </div>
  );
}
