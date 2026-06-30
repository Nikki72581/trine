"use client";
import { Logo } from "./Logo";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

interface Props {
  stepLabel?: string;
}

export function TrineHeader({ stepLabel }: Props) {
  return (
    <header style={{
      width: "100%",
      maxWidth: 1040,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "26px 2px",
    }}>
      {/* Left: logo */}
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", color: "inherit" }}>
        <Logo size={20} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 500,
        }}>
          TRINE
        </span>
      </a>

      {/* Center: step label */}
      {stepLabel && (
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--faint)",
        }}>
          {stepLabel}
        </span>
      )}

      {/* Right: auth controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--faint)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}>
              SIGN IN
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--faint)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}>
              SIGN UP
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <a
            href="/profile"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--faint)",
              textDecoration: "none",
            }}
          >
            HISTORY
          </a>
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
