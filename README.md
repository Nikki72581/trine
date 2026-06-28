# Trine — Three systems. One you.

A personality synthesis app combining **Myers-Briggs**, **Astrology**, and **Numerology** into a unified reading with an optional AI-generated narrative.

## Built with

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility baseline)
- **Claude API** (optional AI insight via streaming)

---

## Getting started locally

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key (optional — for AI insight feature)

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

> The app works fully without an API key — the AI insight button simply won't generate a narrative.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` as an environment variable in Vercel project settings

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Fonts, metadata
│   ├── page.tsx            # Main app — all screens (intro → info → quiz → results)
│   ├── globals.css         # CSS custom properties + keyframe animations
│   └── api/
│       └── insight/
│           └── route.ts    # Edge API route — streams Claude narrative
├── components/
│   ├── Logo.tsx            # Triangle SVG logo
│   ├── TrineHeader.tsx     # Top nav bar
│   ├── TriangleDiagram.tsx # SVG trine visualization of convergences
│   └── ResultsPage.tsx     # Full results layout
└── lib/
    ├── questions.ts        # All 20 questions with metadata
    └── compute.ts          # All computation: MBTI, astrology, numerology, convergences, archetype
```

---

## How the computation works

| System | Input | Output |
|--------|-------|--------|
| Myers-Briggs | 8 questions across EI/SN/TF/JP axes | 4-letter type + dimension percentages |
| Astrology | Birthdate + 4 elemental/lunar questions | Sun sign, element, modality, lunar score |
| Numerology | Name + birthdate + 6 soul/destiny questions | Life path, expression number, soul urge |
| Convergences | All three results | Up to 3 named overlap themes with explanations |
| Archetype | Combined signals | One named archetype + tagline |

---

## Customising

- **Add questions**: Edit `src/lib/questions.ts`
- **Add convergence rules**: Edit `computeConvergences()` in `src/lib/compute.ts`
- **Change colours**: CSS variables in `src/app/globals.css` and inline constants in components
- **Change AI prompt**: Edit the `prompt` string in `src/app/api/insight/route.ts`
