import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trine — Three systems. One you.",
  description:
    "Trine reads your personality through three lenses at once — Myers-Briggs, Astrology, and Numerology — then maps where they converge.",
  openGraph: {
    title: "Trine — Three systems. One you.",
    description: "Discover the overlap between your psychology, cosmos, and numbers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
