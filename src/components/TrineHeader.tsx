"use client";
import { Logo } from "./Logo";

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
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <Logo size={20} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 500,
        }}>
          TRINE
        </span>
      </div>
      {stepLabel && (
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "#9A938B",
        }}>
          {stepLabel}
        </span>
      )}
    </header>
  );
}
