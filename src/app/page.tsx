"use client";

import { useState, useCallback } from "react";
import { TrineHeader } from "@/components/TrineHeader";
import { Logo } from "@/components/Logo";
import { ResultsPage } from "@/components/ResultsPage";
import { QUESTIONS } from "@/lib/questions";
import { computeAll, type TrineResult, type Answers, type AnswerValue } from "@/lib/compute";

type Screen = "intro" | "info" | "quiz" | "computing" | "results";

const COMPUTE_LINES = [
  "Mapping your sun sign…",
  "Calculating life path number…",
  "Analysing cognitive preferences…",
  "Identifying elemental signature…",
  "Drawing convergence points…",
  "Assembling your archetype…",
];

// Deterministically varies which statement displays first per question, so
// the answer that happens to be listed first isn't always the same letter —
// a real source of bias when every question puts the same side on top.
function swapOrder(id: string): boolean {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (h & 1) === 0;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);
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
    const q = QUESTIONS[qIndex];
    const updated = { ...answers, [q.id]: val };
    setAnswers(updated);

    if (qIndex < QUESTIONS.length - 1) {
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
  const orderedOptions = q && swapOrder(q.id) ? [q.b, q.a] : q ? [q.a, q.b] : [];
  const progressWidth = `${((qIndex + 1) / QUESTIONS.length) * 100}%`;
  const dimLabels: Record<string, string> = {
    EI: "ENERGY", SN: "PERCEPTION", TF: "JUDGMENT", JP: "LIFESTYLE",
    element: "ELEMENT", modality: "MODALITY", lunar: "LUNAR",
    destiny: "DESTINY", expression: "EXPRESSION", soul: "SOUL",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF8F5",
      color: "#292521",
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
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", color: "#9A6FD0", marginBottom: 20, display: "block" }}>
            A NEW MODEL OF SELF
          </span>
          <h1 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(40px, 8vw, 56px)", lineHeight: 1.04, letterSpacing: "-0.02em", margin: "0 0 22px" }}>
            Three systems.<br />One you.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#574F47", maxWidth: 520, margin: "0 0 38px" }}>
            Trine reads your personality through three lenses at once — then shows you where they converge. Answer {QUESTIONS.length} questions and we&apos;ll map the overlap between your psychology, your cosmos, and your numbers.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
            {[
              { color: "#6E78C9", label: "Myers–Briggs", shape: "square" },
              { color: "#9A6FD0", label: "Astrology",    shape: "circle" },
              { color: "#C77399", label: "Numerology",   shape: "triangle" },
            ].map(({ color, label, shape }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", border: "1px solid #ECE7E0", borderRadius: 99, background: "#fff" }}>
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
                color: "#FAF8F5", background: "#292521",
                border: "none", borderRadius: 99, padding: "15px 34px",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10,
              }}
            >
              Begin your profile <span style={{ fontSize: 18 }}>→</span>
            </button>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#9A938B", margin: "16px 0 0" }}>
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
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.16em", color: "#9A938B", marginBottom: 14, display: "block" }}>
            STEP 01 — THE BASICS
          </span>
          <h2 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
            Let&apos;s start with you
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "#6E665E", margin: "0 0 34px" }}>
            Your name personalizes the reading. Your birthdate is used to calculate your sun sign and life path number.
          </p>

          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9A938B", display: "block", marginBottom: 8 }}>
            YOUR NAME
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="First and last name"
            style={{
              width: "100%", fontSize: 17, color: "#292521", background: "#fff",
              border: "1px solid #E2DCD3", borderRadius: 12, padding: "14px 16px",
              outline: "none", marginBottom: 24,
            }}
          />

          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9A938B", display: "block", marginBottom: 8 }}>
            DATE OF BIRTH
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr", gap: 10, marginBottom: 36 }}>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              style={{ fontSize: 16, color: "#292521", background: "#fff", border: "1px solid #E2DCD3", borderRadius: 12, padding: "14px 12px", outline: "none", cursor: "pointer", appearance: "none" }}
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
              style={{ fontSize: 16, color: "#292521", background: "#fff", border: "1px solid #E2DCD3", borderRadius: 12, padding: "14px 12px", outline: "none", width: "100%" }}
            />
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              inputMode="numeric"
              maxLength={4}
              style={{ fontSize: 16, color: "#292521", background: "#fff", border: "1px solid #E2DCD3", borderRadius: 12, padding: "14px 12px", outline: "none", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={goBack} style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontSize: 15, color: "#6E665E", background: "none", border: "none", cursor: "pointer", padding: "6px 0" }}>
              ← Back
            </button>
            <button
              onClick={toQuiz}
              disabled={!infoValid}
              style={{
                fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                fontSize: 16, fontWeight: 500,
                color: "#FAF8F5",
                background: infoValid ? "#292521" : "#C9C1B8",
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
      {screen === "quiz" && q && (
        <main style={{
          width: "100%", maxWidth: 620, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "30px 0 70px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: "0.1em", color: "#9A938B" }}>
              QUESTION {qIndex + 1} / {QUESTIONS.length}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: "0.1em", color: "#C9C1B8" }}>
              {dimLabels[q.dimension] ?? q.dimension} · {q.system.toUpperCase()}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: "#ECE7E0", borderRadius: 99, overflow: "hidden", marginBottom: 42 }}>
            <div style={{ height: "100%", width: progressWidth, background: "#292521", borderRadius: 99, transition: "width .35s cubic-bezier(.4,0,.2,1)" }} />
          </div>

          <h2 style={{
            fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(22px, 4vw, 30px)",
            lineHeight: 1.22, letterSpacing: "-0.01em", margin: "0 0 34px", minHeight: 80,
          }}>
            {q.prompt}
          </h2>

          {q.system === "mbti" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {orderedOptions.map((opt) => (
                <div
                  key={opt.value}
                  style={{
                    background: "#fff", border: "1px solid #E7E1D9",
                    borderRadius: 14, padding: "18px 20px 16px",
                  }}
                >
                  <p style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 17, fontWeight: 500, color: "#33302B",
                    lineHeight: 1.4, margin: "0 0 14px",
                  }}>
                    {opt.text}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {([["1", "Somewhat"], ["2", "Strongly"]] as const).map(([strength, label]) => (
                      <button
                        key={strength}
                        onClick={() => answerQuestion(`${opt.value}${strength}` as AnswerValue)}
                        style={{
                          flex: 1,
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 12.5, letterSpacing: "0.06em", color: "#6E665E",
                          background: "#FAF8F5", border: "1px solid #E7E1D9",
                          borderRadius: 9, padding: "10px 0",
                          cursor: "pointer", transition: "border-color .15s, color .15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#9A6FD0"; (e.currentTarget as HTMLElement).style.color = "#9A6FD0"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E7E1D9"; (e.currentTarget as HTMLElement).style.color = "#6E665E"; }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[q.a, q.b].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answerQuestion(opt.value)}
                  style={{
                    textAlign: "left",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 17, fontWeight: 500, color: "#33302B",
                    background: "#fff", border: "1px solid #E7E1D9",
                    borderRadius: 14, padding: "20px 22px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                    transition: "border-color .15s, transform .1s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#9A6FD0"; (e.currentTarget as HTMLElement).style.transform = "translateX(3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E7E1D9"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#B4ABA1",
                    border: "1px solid #E7E1D9", borderRadius: 7, width: 30, height: 30,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {opt.value}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          <button onClick={goBack} style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontSize: 14, color: "#9A938B", background: "none", border: "none", cursor: "pointer", padding: "8px 0", marginTop: 30, alignSelf: "flex-start" }}>
            ← Back
          </button>
        </main>
      )}

      {/* ══ COMPUTING ══════════════════════════════════════════ */}
      {screen === "computing" && (
        <main style={{
          width: "100%", maxWidth: 520, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          textAlign: "center", padding: "40px 0 90px",
        }}>
          <svg width={64} height={64} viewBox="0 0 24 24" style={{ animation: "spin 3s linear infinite", marginBottom: 34 }}>
            <polygon points="12,3 21,19 3,19" fill="none" stroke="#E2DCD3" strokeWidth="1.2" />
            <circle cx="12" cy="3" r="2.4" fill="#6E78C9" style={{ animation: "pulse 1.4s ease-in-out infinite" }} />
            <circle cx="21" cy="19" r="2.4" fill="#9A6FD0" style={{ animation: "pulse 1.4s ease-in-out infinite .45s" }} />
            <circle cx="3" cy="19" r="2.4" fill="#C77399" style={{ animation: "pulse 1.4s ease-in-out infinite .9s" }} />
          </svg>
          <h2 style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", margin: "0 0 14px" }}>
            Synthesizing your profile
          </h2>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#9A938B", letterSpacing: "0.04em", margin: 0, animation: "pulse 1.6s ease-in-out infinite" }}>
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
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "#C9C1B8" }}>
            TRINE · THREE SYSTEMS. ONE YOU.
          </span>
        </footer>
      )}
    </div>
  );
}
