"use client";
import { SignIn } from "@clerk/nextjs";
import { TrineHeader } from "@/components/TrineHeader";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 24px",
    }}>
      <TrineHeader />
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 80,
      }}>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#B98FE8",
              colorBackground: "#1a1a1a",
            },
          }}
        />
      </main>
    </div>
  );
}
