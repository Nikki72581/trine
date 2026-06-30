"use client";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import type { TrineResult } from "@/lib/compute";

interface Props {
  result: TrineResult;
}

export function SaveReadingButton({ result }: Props) {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // Tracks whether the user clicked "save" while signed out
  const pendingSave = useRef(false);

  // After a modal sign-in, isSignedIn flips true — auto-complete the pending save
  useEffect(() => {
    if (isSignedIn && pendingSave.current && status === "idle") {
      pendingSave.current = false;
      void doSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  async function doSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("saved");
    } catch (err) {
      console.error("Save reading failed:", err);
      setStatus("error");
      pendingSave.current = false;
    }
  }

  // Not yet loaded — render nothing to avoid layout shift
  if (!isLoaded) return null;

  // Success state
  if (status === "saved") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: "#63b385",
          letterSpacing: "0.04em",
        }}>
          ✓ Reading saved
        </span>
        <a
          href="/profile"
          style={{
            fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
            fontSize: 14,
            color: "var(--muted)",
            textDecoration: "none",
            borderBottom: "1px solid var(--border)",
            paddingBottom: 1,
            cursor: "pointer",
          }}
        >
          View history →
        </a>
      </div>
    );
  }

  const btnStyle: React.CSSProperties = {
    fontFamily: "Space Grotesk, 'Hanken Grotesk', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    color: "var(--bg)",
    background: "var(--ink)",
    border: "none",
    borderRadius: 99,
    padding: "13px 28px",
    cursor: status === "saving" ? "default" : "pointer",
    opacity: status === "saving" ? 0.65 : 1,
    whiteSpace: "nowrap" as const,
    transition: "opacity .15s",
  };

  // Signed in — show save button directly
  if (isSignedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button onClick={() => void doSave()} disabled={status === "saving"} style={btnStyle}>
          {status === "saving" ? "Saving…" : "✦ Save this reading"}
        </button>
        {status === "error" && (
          <span style={{ fontSize: 13, color: "#E592AE" }}>Couldn't save — try again.</span>
        )}
      </div>
    );
  }

  // Signed out — wrap with SignInButton (modal) and set pending flag on click
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <SignInButton mode="modal">
        <button
          style={btnStyle}
          onClick={() => { pendingSave.current = true; }}
        >
          ✦ Save this reading
        </button>
      </SignInButton>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: "var(--faint)",
        letterSpacing: "0.04em",
        maxWidth: 280,
        lineHeight: 1.5,
      }}>
        Free account required — we store nothing personal.
      </span>
    </div>
  );
}
