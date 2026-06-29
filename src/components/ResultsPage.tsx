"use client";
import { useState, useRef } from "react";
import type { TrineResult } from "@/lib/compute";
import { clarityLabel } from "@/lib/compute";
import { TriangleDiagram } from "./TriangleDiagram";

const MBTI_COLOR  = "#8B93E8";
const ASTRO_COLOR = "#B98FE8";
const NUM_COLOR   = "#E592AE";

const ELEMENT_DESC: Record<string, string> = {
  Fire:  "Driven by passion and creative force — you act, initiate, and inspire. Fire carries warmth that others orbit around.",
  Earth: "Grounded in what is real and lasting — you build, endure, and stabilize. Earth carries a quiet, reliable power.",
  Air:   "Energized by ideas, connection, and exchange — you adapt, communicate, and bridge perspectives with ease.",
  Water: "Guided by feeling and intuition — you navigate by instinct and empathy. Water carries a profound emotional intelligence.",
};

const MODALITY_DESC: Record<string, string> = {
  Cardinal: "You initiate. When there is a gap, you step in and get things moving — you are most alive at the start of something new.",
  Fixed:    "You sustain. Your power is in depth and persistence — where others lose interest, you double down and see it through.",
  Mutable:  "You adapt. Transitions and change are your natural element — you translate, evolve, and bring people with you.",
};

const EXPRESSION_DESC: Record<number, string> = {
  1:  "Your outward presence reads as self-directed and pioneering — you project independence and originality.",
  2:  "Your outward presence reads as cooperative and attuned — you project sensitivity and a gift for partnership.",
  3:  "Your outward presence reads as expressive and magnetic — you project creativity and infectious enthusiasm.",
  4:  "Your outward presence reads as methodical and dependable — you project structure and a steady, reliable nature.",
  5:  "Your outward presence reads as dynamic and free-spirited — you project adaptability and an appetite for life.",
  6:  "Your outward presence reads as nurturing and responsible — you project warmth and a strong sense of duty.",
  7:  "Your outward presence reads as thoughtful and discerning — you project depth, precision, and quiet wisdom.",
  8:  "Your outward presence reads as authoritative and capable — you project ambition, power, and executive presence.",
  9:  "Your outward presence reads as generous and idealistic — you project compassion and a larger-than-self vision.",
  11: "Your outward presence reads as visionary and sensitive — you project an unusual depth of perception and inspiration.",
  22: "Your outward presence reads as exceptionally capable and visionary — you project the rare power to turn ambitious ideas into reality.",
  33: "Your outward presence reads as deeply compassionate and teaching — you project an ability to heal and elevate those around you.",
};

const LUNAR_DESC = (score: number) =>
  score >= 75 ? "Highly attuned to cycles and emotional currents — you feel the shifts before others name them. Tides, seasons, and collective energy move you." :
  score >= 50 ? "Moderately lunar — you are responsive to emotional rhythms and external atmospheres without being overwhelmed by them." :
  score >= 25 ? "Grounded and internally steady — you are influenced by the mood around you, but not defined by it." :
  "Largely independent of emotional tides — you maintain your own frequency regardless of collective mood shifts.";

const SOUL_DESC: Record<string, string> = {
  Achievement: "Your inner engine runs on growth, mastery, and impact. You are most at peace when you are building something meaningful — most restless when your potential feels untapped.",
  Connection:  "Your inner engine runs on love, belonging, and depth. You are most at peace when relationships are real and reciprocal — most restless when you feel unseen.",
};

const DESTINY_DESC: Record<string, string> = {
  "Self-made": "You sense that your path is yours to design. You trust your own agency above fate or circumstance, and you take ownership of where you end up.",
  "Called":    "You sense a thread running through your life — a pull toward something larger than any single decision. You are drawn by purpose as much as driven by will.",
};

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
      <span style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function BarRow({ label, pct, letter, color }: { label: string; pct: number; letter: string; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color, fontWeight: 500 }}>{letter} · {pct}%</span>
      </div>
      <div style={{ height: 6, background: "var(--border-light)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "var(--faint)" }}>{clarityLabel(pct)} preference</span>
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
      <section style={{ textAlign: "center", padding: "18px 0 46px", borderBottom: "1px solid var(--border-light)" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", color: ASTRO_COLOR, display: "block", marginBottom: 6 }}>
          {eyebrow}
        </span>
        {name && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "var(--faint)", display: "block", marginBottom: 14 }}>
            {name.toUpperCase()}
          </span>
        )}
        <h1 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.025em", margin: "0 0 20px" }}>
          {archetype}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--muted)", maxWidth: 560, margin: "0 auto 34px" }}>
          {tagline}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Pill color={MBTI_COLOR}  label="Myers–Briggs" value={mbti.type} />
          <Pill color={ASTRO_COLOR} label="Sun Sign"     value={`${astrology.symbol} ${astrology.sunSign}`} />
          <Pill color={NUM_COLOR}   label="Life Path"    value={String(numerology.lifePath)} />
        </div>
      </section>

      {/* ── PRIVACY / EXPORT NOTICE ──────────────────────────── */}
      <section className="no-print" style={{ padding: "26px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18,
          background: "rgba(99,179,133,0.08)", border: "1px solid rgba(99,179,133,0.25)",
          borderRadius: 14, padding: "18px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, maxWidth: 560 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M12 2.5 4 5.5v6c0 6 3.6 9 8 10 4.4-1 8-4 8-10v-6L12 2.5z" stroke="#63b385" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8.5 12 11 14.5 16 9" stroke="#63b385" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
              We don&apos;t collect or store any of your data. This reading lives only in your browser — once you close or refresh this tab, it&apos;s gone for good. Export a copy below if you want to keep it.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
              fontSize: 14, fontWeight: 500, color: "var(--bg)",
              background: "#63b385", border: "none", borderRadius: 99,
              padding: "11px 24px", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            ⤓ Export PDF
          </button>
        </div>
      </section>

      {/* ── TWO-COL: DIAGRAM + CONVERGENCES ─────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "48px 0 48px", borderBottom: "1px solid var(--border-light)", alignItems: "start" }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "var(--faint)", marginBottom: 24 }}>
            WHERE YOUR SYSTEMS CONVERGE
          </p>
          <TriangleDiagram result={result} />
        </div>

        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "var(--faint)", marginBottom: 24 }}>
            CONVERGENCE THEMES
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {convergences.map(c => (
              <div key={c.title} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
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
                      background: "#F3EEE614",
                      color: "var(--muted)",
                      border: "1px solid #F3EEE630",
                    }}>
                      CONVERGENCE
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: 17, margin: "0 0 8px" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE SYSTEM BREAKDOWNS ──────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: "48px 0", borderBottom: "1px solid var(--border-light)" }}>

        {/* MBTI */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${MBTI_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: MBTI_COLOR, margin: "0 0 6px" }}>MYERS–BRIGGS</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "0.03em", color: MBTI_COLOR, margin: "0 0 4px" }}>{mbti.type}</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>{mbti.description}</p>
          <p style={{ fontSize: 11.5, color: "var(--faint)", margin: "0 0 18px", lineHeight: 1.5 }}>
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
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${ASTRO_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: ASTRO_COLOR, margin: "0 0 6px" }}>ASTROLOGY</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 28, color: ASTRO_COLOR, margin: "0 0 2px" }}>
            {astrology.symbol} {astrology.sunSign}
          </h3>
          <p style={{ fontSize: 12, color: "var(--faint)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", margin: "0 0 6px" }}>
            {astrology.element} · {astrology.modality}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>{astrology.description}</p>

          {/* Element */}
          <div style={{ borderLeft: `2px solid ${ASTRO_COLOR}44`, paddingLeft: 12, marginBottom: 10 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: ASTRO_COLOR, margin: "0 0 3px" }}>{astrology.element.toUpperCase()} ELEMENT</p>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{ELEMENT_DESC[astrology.element] ?? ""}</p>
          </div>

          {/* Modality */}
          <div style={{ borderLeft: `2px solid ${ASTRO_COLOR}44`, paddingLeft: 12, marginBottom: 18 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: ASTRO_COLOR, margin: "0 0 3px" }}>{astrology.modality.toUpperCase()} MODALITY</p>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{MODALITY_DESC[astrology.modality] ?? ""}</p>
          </div>

          {/* Lunar sensitivity */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.06em", color: "var(--faint)", margin: 0 }}>LUNAR SENSITIVITY</p>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: ASTRO_COLOR }}>{astrology.lunarScore}/100</span>
            </div>
            <div style={{ height: 6, background: "var(--border-light)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${astrology.lunarScore}%`, background: ASTRO_COLOR, borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--faint)", margin: 0 }}>{LUNAR_DESC(astrology.lunarScore)}</p>
          </div>

          {/* Elemental lean from answers */}
          <p style={{ fontSize: 12, color: "var(--faint)", marginBottom: 14 }}>
            Answer pattern leans <strong style={{ color: "var(--muted)" }}>{astrology.elementFromAnswers}</strong>
            {astrology.elementFromAnswers.includes(astrology.element)
              ? " — aligned with your birth sign."
              : " — a different signature from your natal element, suggesting a complex blend."}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {astrology.traits.map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 10px", background: ASTRO_COLOR + "14", color: ASTRO_COLOR, borderRadius: 6 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Numerology */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 22px", borderTop: `3px solid ${NUM_COLOR}` }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: NUM_COLOR, margin: "0 0 6px" }}>NUMEROLOGY</p>
          <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 32, color: NUM_COLOR, margin: "0 0 2px" }}>
            {numerology.lifePath}
          </h3>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--faint)", letterSpacing: "0.06em", margin: "0 0 4px" }}>
            LIFE PATH · {numerology.lifePathTheme}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>{numerology.lifePathDesc}</p>

          {/* Expression number */}
          <div style={{ borderLeft: `2px solid ${NUM_COLOR}44`, paddingLeft: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: NUM_COLOR, margin: 0 }}>EXPRESSION NO.</p>
              <span style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{numerology.expressionNumber}</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
              {EXPRESSION_DESC[numerology.expressionNumber] ?? "How the world perceives your outward energy and natural gifts."}
            </p>
          </div>

          {/* Soul urge */}
          <div style={{ borderLeft: `2px solid ${NUM_COLOR}44`, paddingLeft: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: NUM_COLOR, margin: 0 }}>SOUL URGE</p>
              <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13 }}>{numerology.soulUrge}</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
              {SOUL_DESC[numerology.soulUrge] ?? ""}
            </p>
          </div>

          {/* Destiny lean */}
          <div style={{ borderLeft: `2px solid ${NUM_COLOR}44`, paddingLeft: 12, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: NUM_COLOR, margin: 0 }}>DESTINY LEAN</p>
              <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13 }}>{numerology.destinyLean}</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
              {DESTINY_DESC[numerology.destinyLean] ?? ""}
            </p>
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
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "var(--faint)", marginBottom: 16 }}>
          AI SYNTHESIS
        </p>
        {!aiText && !aiLoading && (
          <div className="no-print" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "Space Grotesk, var(--font-hanken), sans-serif", fontWeight: 600, fontSize: 22, margin: "0 0 8px" }}>
                Get your personal narrative
              </h3>
              <p style={{ fontSize: 15, color: "var(--muted)", margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
                A Claude-generated insight synthesizes all three systems into a rich, personalized portrait — who you are, your strengths, your blind spots, and what you&apos;re here to do.
              </p>
            </div>
            <button
              onClick={loadInsight}
              style={{
                fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--bg)",
                background: "var(--ink)",
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
          <div className="no-print" style={{ textAlign: "center", padding: "40px 0" }}>
            <svg width={40} height={40} viewBox="0 0 24 24" style={{ animation: "spin 3s linear infinite", margin: "0 auto 16px" }}>
              <polygon points="12,3 21,19 3,19" fill="none" stroke="var(--border)" strokeWidth="1.2" />
              <circle cx="12" cy="3" r="2.2" fill={MBTI_COLOR} />
              <circle cx="21" cy="19" r="2.2" fill={ASTRO_COLOR} />
              <circle cx="3" cy="19" r="2.2" fill={NUM_COLOR} />
            </svg>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--faint)", letterSpacing: "0.06em" }}>Synthesizing your profile…</p>
          </div>
        )}

        {aiText && (
          <div ref={aiRef} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px" }}>
            <p style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 20 }}>
              ✦ CLAUDE SYNTHESIS · {archetype.toUpperCase()}
            </p>
            <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
              {aiText}
              {!aiDone && <span style={{ animation: "pulse 1s infinite", display: "inline-block", width: 2, height: 18, background: ASTRO_COLOR, marginLeft: 2, verticalAlign: "middle" }} />}
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ACTIONS ───────────────────────────────────── */}
      <div className="no-print" style={{ textAlign: "center", paddingTop: 8 }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#63b385",
              background: "rgba(99,179,133,0.08)",
              border: "1px solid rgba(99,179,133,0.35)",
              borderRadius: 99,
              padding: "10px 26px",
              cursor: "pointer",
            }}
          >
            ⤓ Export PDF
          </button>
          <button
            onClick={onRestart}
            style={{
              fontFamily: "Space Grotesk, var(--font-hanken), sans-serif",
              fontSize: 14,
              color: "var(--muted)",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "10px 26px",
              cursor: "pointer",
            }}
          >
            ✦ Start a new reading
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: "var(--faint)", margin: 0 }}>
          Nothing on this page is saved anywhere — leaving or refreshing clears it for good.
        </p>
      </div>
    </div>
  );
}
