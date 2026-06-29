"use client";

import { useState, useCallback } from "react";
import { TrineHeader } from "@/components/TrineHeader";
import { Logo } from "@/components/Logo";
import { ResultsPage } from "@/components/ResultsPage";
import { QUESTIONS } from "@/lib/questions";
import { computeAll, type TrineResult, type Answers, type AnswerValue } from "@/lib/compute";

type Screen = "intro" | "info" | "quiz" | "computing" | "results";

const MBTI_COLOR  = "#8B93E8";
const ASTRO_COLOR = "#B98FE8";
const NUM_COLOR   = "#E592AE";

const COMPUTE_LINES = [
  "Mapping your sun sign…",
  "Calculating life path number…",
  "Analysing cognitive preferences…",
  "Identifying elemental signature…",
  "Drawing convergence points…",
  "Assembling your archetype…",
];


export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(null);
  const [computeLine, setComputeLine] = useState(COMPUTE_LINES[0]);
  const [result, setResult] = useState<TrineResult | null>(null);

  const infoValid = name.trim() && month && day && year && year.length === 4;

  function toQuiz() {
    if (!infoValid) return;
    setQIndex(0);
    setAnswers({});
    setScreen("quiz");
  }

  function answerQuestion(val: AnswerValue) {
    if (selectedAnswer !== null) return; // prevent double-tap
    setSelectedAnswer(val);
    const q = QUESTIONS[qIndex];
    const updated = { ...answers, [q.id]: val };

    setTimeout(() => {
      setSelectedAnswer(null);
      if (qIndex < QUESTIONS.length - 1) {
        setAnswers(updated);
        setQIndex(i => i + 1);
      } else {
        // All answered — compute
        setScreen("computing");
        let lineIdx = 0;
        const iv = setInterval(() => {
          lineIdx++;
          if (lineIdx < COMPUTE_LINES.length) setComputeLine(COMPUTE_LINES[lineIdx]);
          else clearInterval(iv);
        }, 500);

        setTimeout(() => {
          clearInterval(iv);
          const computed = computeAll(
            updated,
            name,
            parseInt(month),
            parseInt(day),
            parseInt(year),
          );
          setResult(computed);
          setScreen("results");
        }, 3000);
      }
    }, 280);
  }

  function goBack() {
    if (screen === "quiz") {
      if (qIndex === 0) setScreen("info");
      else setQIndex(i => i - 1);
    } else if (screen === "info") {
      setScreen("intro");
    }
  }

  const restart = useCallback(() => {
    setScreen("intro");
    setName("");
    setMonth("");
    setDay("");
    setYear("");
    setAnswers({});
    setQIndex(0);
    setResult(null);
  }, []);

  const stepLabel =
    screen === "info" ? "01 / 03 — BASICS" :
    screen === "quiz" ? `02 / 03 — QUESTION ${qIndex + 1} OF ${QUESTIONS.length}` :
    screen === "computing" ? "SYNTHESIZING" :
    screen === "results" ? "YOUR READING" : "";

  const q = QUESTIONS[qIndex];
  const progressWidth = `${((qIndex + 1) / QUESTIONS.length) * 100}%`;
  const dimLabels: Record<string, string> = {
    EI: "ENERGY", SN: "PERCEPTION", TF: "JUDGMENT", JP: "LIFESTYLE",
    element: "ELEMENT", modality: "MODALITY", lunar: "LUNAR",
    destiny: "DESTINY", expression: "EXPRESSION", soul: "SOUL",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--ink)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 24px",
    }}>
      <TrineHeader stepLabel={stepLabel} />

      {/* ══ INTRO ══════════════════════════════════════════════ */}
      {screen === "intro" && (
        <main style={{
          width: "100%", maxWidth: 640, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "40px 0 80px", animation: "fadeUp .5s ease both",
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", color: ASTRO_COLOR, marginBottom: 20, display: "block" }}>
            A NEW MODEL OF SELF
          </span>
          <h1 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(40px, 8vw, 56px)", lineHeight: 1.04, letterSpacing: "-0.02em", margin: "0 0 22px" }}>
            Three systems.<br />One you.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--muted)", maxWidth: 520, margin: "0 0 38px" }}>
            Trine reads your personality through three lenses at once — then shows you where they converge. Answer {QUESTIONS.length} questions and we&apos;ll map the overlap between your psychology, your cosmos, and your numbers.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
            {[
              { color: MBTI_COLOR, label: "Myers–Briggs", shape: "square" },
              { color: ASTRO_COLOR, label: "Astrology",    shape: "circle" },
              { color: NUM_COLOR, label: "Numerology",   shape: "triangle" },
            ].map(({ color, label, shape }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", border: "1px solid var(--border-light)", borderRadius: 99, background: "var(--surface)" }}>
                {shape === "square"   && <span style={{ width: 9, height: 9, borderRadius: 2, background: color, display: "block" }} />}
                {shape === "circle"   && <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, display: "block" }} />}
                {shape === "triangle" && (
                  <svg width={10} height={9} viewBox="0 0 10 9">
                    <polygon points="5,0 10,9 0,9" fill={color} />
                  </svg>
                )}
                <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
          <div>
            <button
              onClick={() => setScreen("info")}
              style={{
                fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                fontSize: 16, fontWeight: 500,
                color: "var(--bg)", background: "var(--ink)",
                border: "none", borderRadius: 99, padding: "15px 34px",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10,
              }}
            >
              Begin your profile <span style={{ fontSize: 18 }}>→</span>
            </button>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "var(--faint)", margin: "16px 0 0" }}>
              ~6 minutes · {QUESTIONS.length} questions · no account needed
            </p>
          </div>
        </main>
      )}

      {/* ══ INFO ════════════════════════════════════════════════ */}
      {screen === "info" && (
        <main style={{
          width: "100%", maxWidth: 540, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "40px 0 80px", animation: "fadeUp .4s ease both",
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.16em", color: "var(--faint)", marginBottom: 14, display: "block" }}>
            STEP 01 — THE BASICS
          </span>
          <h2 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
            Let&apos;s start with you
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)", margin: "0 0 34px" }}>
            Your name personalizes the reading. Your birthdate is used to calculate your sun sign and life path number.
          </p>

          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "var(--faint)", display: "block", marginBottom: 8 }}>
            YOUR NAME
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="First and last name"
            style={{
              width: "100%", fontSize: 17, color: "var(--ink)", background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px",
              outline: "none", marginBottom: 24,
            }}
          />

          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "var(--faint)", display: "block", marginBottom: 8 }}>
            DATE OF BIRTH
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr", gap: 10, marginBottom: 36 }}>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              style={{ fontSize: 16, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 12px", outline: "none", cursor: "pointer", appearance: "none" }}
            >
              <option value="">Month</option>
              {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                <option key={m} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <input
              value={day}
              onChange={e => setDay(e.target.value)}
              placeholder="Day"
              inputMode="numeric"
              maxLength={2}
              style={{ fontSize: 16, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 12px", outline: "none", width: "100%" }}
            />
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              inputMode="numeric"
              maxLength={4}
              style={{ fontSize: 16, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 12px", outline: "none", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={goBack} style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontSize: 15, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: "6px 0" }}>
              ← Back
            </button>
            <button
              onClick={toQuiz}
              disabled={!infoValid}
              style={{
                fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                fontSize: 16, fontWeight: 500,
                color: infoValid ? "var(--bg)" : "var(--faint)",
                background: infoValid ? "var(--ink)" : "var(--border)",
                border: "none", borderRadius: 99, padding: "14px 30px",
                cursor: infoValid ? "pointer" : "not-allowed",
                flex: 1,
              }}
            >
              Continue →
            </button>
          </div>
        </main>
      )}

      {/* ══ QUIZ ════════════════════════════════════════════════ */}
      {screen === "quiz" && q && (() => {
        const accentColor = q.system === "mbti" ? "#a78bfa" : q.system === "astro" ? ASTRO_COLOR : NUM_COLOR;
        const accentBg    = q.system === "mbti" ? "rgba(167,139,250,0.08)" : q.system === "astro" ? "rgba(185,143,232,0.08)" : "rgba(229,146,174,0.08)";
        const accentBdr   = q.system === "mbti" ? "rgba(167,139,250,0.22)" : q.system === "astro" ? "rgba(185,143,232,0.22)" : "rgba(229,146,174,0.22)";

        return (
          <main style={{
            width: "100%", maxWidth: 600, flex: 1,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(1.5rem, 5vw, 3rem) 0",
          }}>
            {/* Counter */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: "0.1em", color: "var(--faint)" }}>
                {qIndex + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: "var(--border-light)", borderRadius: 99, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ height: "100%", width: progressWidth, background: accentColor, borderRadius: 99, transition: "width .35s cubic-bezier(.4,0,.2,1)" }} />
            </div>

            {/* Category tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7, alignSelf: "flex-start",
              background: accentBg, border: `1px solid ${accentBdr}`,
              borderRadius: 20, padding: "5px 12px", marginBottom: 36,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, display: "inline-block" }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: accentColor }}>
                {(dimLabels[q.dimension] ?? q.dimension).toUpperCase()} · {q.system.toUpperCase()}
              </span>
            </div>

            {/* Statement */}
            <h2 style={{
              fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 500,
              fontSize: "clamp(20px, 4.5vw, 28px)", lineHeight: 1.35, letterSpacing: "-0.01em",
              margin: "0 0 52px",
            }}>
              {q.text}
            </h2>

            {/* 5-point scale */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: "0.12em",
                color: "var(--faint)", whiteSpace: "nowrap", marginRight: 18, userSelect: "none",
              }}>
                INACCURATE
              </span>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {([1, 2, 3, 4, 5] as const).map(n => {
                  const isSelected = selectedAnswer === n;
                  const size = 28 + n * 3; // 31 → 46, grows toward "Accurate" end
                  return (
                    <button
                      key={n}
                      onClick={() => answerQuestion(n)}
                      aria-label={`Rating ${n} of 5`}
                      style={{
                        width: size, height: size,
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? accentColor : "var(--border)"}`,
                        background: isSelected ? accentColor : "transparent",
                        cursor: "pointer",
                        transition: "all .18s ease",
                        flexShrink: 0,
                        padding: 0,
                      }}
                      onMouseEnter={e => {
                        if (isSelected) return;
                        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
                        (e.currentTarget as HTMLElement).style.background = accentBg;
                      }}
                      onMouseLeave={e => {
                        if (isSelected) return;
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    />
                  );
                })}
              </div>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: "0.12em",
                color: "var(--faint)", whiteSpace: "nowrap", marginLeft: 18, userSelect: "none",
              }}>
                ACCURATE
              </span>
            </div>

            {/* Scale hint */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingLeft: 100, paddingRight: 92 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "var(--faint)", textAlign: "center", width: 28 + n * 3 }}>
                  {n}
                </span>
              ))}
            </div>

            <button onClick={goBack} style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontSize: 14, color: "var(--faint)", background: "none", border: "none", cursor: "pointer", padding: "8px 0", marginTop: 36, alignSelf: "flex-start" }}>
              ← Back
            </button>
          </main>
        );
      })()}

      {/* ══ COMPUTING ══════════════════════════════════════════ */}
      {screen === "computing" && (
        <main style={{
          width: "100%", maxWidth: 520, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          textAlign: "center", padding: "40px 0 90px",
        }}>
          <svg width={64} height={64} viewBox="0 0 24 24" style={{ animation: "spin 3s linear infinite", marginBottom: 34 }}>
            <polygon points="12,3 21,19 3,19" fill="none" stroke="var(--border)" strokeWidth="1.2" />
            <circle cx="12" cy="3" r="2.4" fill={MBTI_COLOR} style={{ animation: "pulse 1.4s ease-in-out infinite" }} />
            <circle cx="21" cy="19" r="2.4" fill={ASTRO_COLOR} style={{ animation: "pulse 1.4s ease-in-out infinite .45s" }} />
            <circle cx="3" cy="19" r="2.4" fill={NUM_COLOR} style={{ animation: "pulse 1.4s ease-in-out infinite .9s" }} />
          </svg>
          <h2 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", margin: "0 0 14px" }}>
            Synthesizing your profile
          </h2>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--faint)", letterSpacing: "0.04em", margin: 0, animation: "pulse 1.6s ease-in-out infinite" }}>
            {computeLine}
          </p>
        </main>
      )}

      {/* ══ RESULTS ════════════════════════════════════════════ */}
      {screen === "results" && result && (
        <ResultsPage result={result} name={name} onRestart={restart} />
      )}

      {/* Footer */}
      {screen !== "results" && (
        <footer style={{ paddingBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={14} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "var(--faint)" }}>
            TRINE · THREE SYSTEMS. ONE YOU.
          </span>
        </footer>
      )}
    </div>
  );
}