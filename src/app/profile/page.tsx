import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TrineHeader } from "@/components/TrineHeader";
import type { TrineResult } from "@/lib/compute";

const MBTI_COLOR  = "#8B93E8";
const ASTRO_COLOR = "#B98FE8";
const NUM_COLOR   = "#E592AE";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

interface SavedReading {
  id: string;
  createdAt: Date;
  archetype: string;
  mbtiType: string;
  sunSign: string;
  lifePath: number;
  result: unknown;
}

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const readings = await prisma.reading.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      archetype: true,
      mbtiType: true,
      sunSign: true,
      lifePath: true,
      result: true,
    },
  }) as SavedReading[];

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
      <TrineHeader />

      <main style={{ width: "100%", maxWidth: 860, flex: 1, paddingBottom: 80 }}>

        {/* Page header */}
        <div style={{ padding: "10px 0 44px", borderBottom: "1px solid var(--border-light)", marginBottom: 44 }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "var(--faint)",
            display: "block",
            marginBottom: 12,
          }}>
            YOUR READING HISTORY
          </span>
          <h1 style={{
            fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
          }}>
            {readings.length === 0
              ? "No readings yet"
              : readings.length === 1
              ? "Your reading"
              : `${readings.length} readings`}
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
            {readings.length === 0
              ? "Complete the Trine quiz and save your results to start building a history."
              : "Track how your profile shifts across different points in your life."}
          </p>
        </div>

        {/* Empty state */}
        {readings.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <svg width={56} height={56} viewBox="0 0 24 24" style={{ margin: "0 auto 24px", opacity: 0.2 }}>
              <polygon points="12,3 21,19 3,19" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
            </svg>
            <a
              href="/"
              style={{
                fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--bg)",
                background: "var(--ink)",
                border: "none",
                borderRadius: 99,
                padding: "13px 28px",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Take your first reading →
            </a>
          </div>
        )}

        {/* Reading cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {readings.map((reading, i) => {
            const r = reading.result as TrineResult;
            const convergenceTitles = r.convergences?.map(c => c.title) ?? [];
            const isNewest = i === 0;

            return (
              <article
                key={reading.id}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isNewest ? "var(--border)" : "var(--border-light)"}`,
                  borderRadius: 16,
                  padding: "28px 28px 24px",
                  borderTop: isNewest ? `3px solid ${ASTRO_COLOR}` : "1px solid var(--border-light)",
                }}
              >
                {/* Card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    {isNewest && (
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        color: ASTRO_COLOR,
                        display: "block",
                        marginBottom: 6,
                      }}>
                        MOST RECENT
                      </span>
                    )}
                    <h2 style={{
                      fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "clamp(20px, 3vw, 26px)",
                      letterSpacing: "-0.015em",
                      margin: "0 0 4px",
                    }}>
                      {reading.archetype}
                    </h2>
                    {r.tagline && (
                      <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                        {r.tagline}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11,
                      color: "var(--faint)",
                      display: "block",
                    }}>
                      {formatTimeAgo(new Date(reading.createdAt))}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: "var(--faint)",
                      display: "block",
                      marginTop: 2,
                    }}>
                      {formatDate(new Date(reading.createdAt))}
                    </span>
                  </div>
                </div>

                {/* Three system pills */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 14px",
                    background: MBTI_COLOR + "14",
                    borderRadius: 10,
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: MBTI_COLOR }}>MBTI</span>
                    <span style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: MBTI_COLOR, letterSpacing: "0.06em" }}>{reading.mbtiType}</span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 14px",
                    background: ASTRO_COLOR + "14",
                    borderRadius: 10,
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: ASTRO_COLOR }}>SUN</span>
                    <span style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: ASTRO_COLOR }}>
                      {r.astrology?.symbol} {reading.sunSign}
                    </span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 14px",
                    background: NUM_COLOR + "14",
                    borderRadius: 10,
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: NUM_COLOR }}>LIFE PATH</span>
                    <span style={{ fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: NUM_COLOR }}>{reading.lifePath}</span>
                  </div>
                </div>

                {/* Convergence themes */}
                {convergenceTitles.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {convergenceTitles.map(title => (
                      <span
                        key={title}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.06em",
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "rgba(243,238,230,0.06)",
                          border: "1px solid var(--border-light)",
                          color: "var(--muted)",
                        }}
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* CTA to take another */}
        {readings.length > 0 && (
          <div style={{ textAlign: "center", paddingTop: 48 }}>
            <a
              href="/"
              style={{
                fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
                fontSize: 15,
                color: "var(--muted)",
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 99,
                padding: "12px 28px",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              ✦ Take a new reading
            </a>
          </div>
        )}
      </main>

      <footer style={{ paddingBottom: 24 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "var(--faint)" }}>
          TRINE · THREE SYSTEMS. ONE YOU.
        </span>
      </footer>
    </div>
  );
}
