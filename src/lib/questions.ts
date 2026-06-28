export type Dimension = "EI" | "SN" | "TF" | "JP" | "element" | "modality" | "lunar" | "destiny" | "expression" | "soul";

export interface Choice {
  text: string;
  value: "A" | "B";
}

export interface Question {
  id: string;
  dimension: Dimension;
  system: "mbti" | "astro" | "num";
  prompt: string;
  a: Choice;
  b: Choice;
}

export const QUESTIONS: Question[] = [
  // ── MBTI ─────────────────────────────────────────────────────────────────
  {
    id: "q1",
    dimension: "EI",
    system: "mbti",
    prompt: "After a long weekend full of social events, you typically feel:",
    a: { text: "Energized — I want to keep the momentum going", value: "A" },
    b: { text: "Drained — I need quiet time to recharge", value: "B" },
  },
  {
    id: "q2",
    dimension: "EI",
    system: "mbti",
    prompt: "When working through a difficult problem, you'd rather:",
    a: { text: "Talk it through out loud with others", value: "A" },
    b: { text: "Think it through quietly on your own first", value: "B" },
  },
  {
    id: "q3",
    dimension: "SN",
    system: "mbti",
    prompt: "When absorbing new information, you trust most:",
    a: { text: "Concrete facts, real examples, and sensory details", value: "A" },
    b: { text: "Patterns, theories, and what the information implies", value: "B" },
  },
  {
    id: "q4",
    dimension: "SN",
    system: "mbti",
    prompt: "You are more drawn to:",
    a: { text: "What is — practical, real, present", value: "A" },
    b: { text: "What could be — possibilities and future visions", value: "B" },
  },
  {
    id: "q5",
    dimension: "TF",
    system: "mbti",
    prompt: "When making an important decision, what weighs most?",
    a: { text: "Logical analysis and objective criteria", value: "A" },
    b: { text: "How it affects the people involved", value: "B" },
  },
  {
    id: "q6",
    dimension: "TF",
    system: "mbti",
    prompt: "People who know you well would say you lead with:",
    a: { text: "Your head — principles and reason", value: "A" },
    b: { text: "Your heart — empathy and values", value: "B" },
  },
  {
    id: "q7",
    dimension: "JP",
    system: "mbti",
    prompt: "Your ideal work style is:",
    a: { text: "Planned — I like clear structure and settled plans", value: "A" },
    b: { text: "Flexible — I like staying open and adapting as I go", value: "B" },
  },
  {
    id: "q8",
    dimension: "JP",
    system: "mbti",
    prompt: "Deadlines make you feel:",
    a: { text: "Reassured — they help me stay on track", value: "A" },
    b: { text: "Constrained — I prefer to keep options open", value: "B" },
  },

  // ── ASTROLOGY ────────────────────────────────────────────────────────────
  {
    id: "q9",
    dimension: "element",
    system: "astro",
    prompt: "Which environment makes you feel most alive and like yourself?",
    a: { text: "Mountains, forests, or stable ground (Earth / Water)", value: "A" },
    b: { text: "Open skies, travel, fire, and movement (Fire / Air)", value: "B" },
  },
  {
    id: "q10",
    dimension: "modality",
    system: "astro",
    prompt: "In a group facing a new challenge, you naturally:",
    a: { text: "Initiate or stabilize — start things or hold them together", value: "A" },
    b: { text: "Adapt and bridge — connect people and transition between phases", value: "B" },
  },
  {
    id: "q11",
    dimension: "lunar",
    system: "astro",
    prompt: "How much do you let emotions guide major life decisions?",
    a: { text: "Minimally — I separate feelings from decisions", value: "A" },
    b: { text: "Significantly — emotions are a real signal I trust", value: "B" },
  },
  {
    id: "q12",
    dimension: "lunar",
    system: "astro",
    prompt: "You notice your mood shifting with external cycles — seasons, phases, rhythms:",
    a: { text: "Rarely — I'm fairly consistent regardless", value: "A" },
    b: { text: "Frequently — I'm sensitive to energy shifts", value: "B" },
  },

  // ── NUMEROLOGY ───────────────────────────────────────────────────────────
  {
    id: "q13",
    dimension: "expression",
    system: "num",
    prompt: "People who meet you for the first time describe you as:",
    a: { text: "A leader, pioneer, or someone with strong presence", value: "A" },
    b: { text: "A listener, collaborator, or someone easy to open up to", value: "B" },
  },
  {
    id: "q14",
    dimension: "expression",
    system: "num",
    prompt: "Your natural mode of contributing to a group is:",
    a: { text: "Creating, building, or driving direction", value: "A" },
    b: { text: "Supporting, harmonizing, or bringing people together", value: "B" },
  },
  {
    id: "q15",
    dimension: "soul",
    system: "num",
    prompt: "Deep down, the thing you want most from life is:",
    a: { text: "Achievement, mastery, and leaving a mark", value: "A" },
    b: { text: "Connection, meaning, and inner peace", value: "B" },
  },
  {
    id: "q16",
    dimension: "soul",
    system: "num",
    prompt: "At your core, you are driven more by:",
    a: { text: "Ambition and the desire to build something lasting", value: "A" },
    b: { text: "Compassion and the desire to be understood", value: "B" },
  },
  {
    id: "q17",
    dimension: "destiny",
    system: "num",
    prompt: "Looking back on your life so far, you see it as:",
    a: { text: "Something I actively shaped through choices and will", value: "A" },
    b: { text: "A path that unfolded with a sense of purpose or calling", value: "B" },
  },
  {
    id: "q18",
    dimension: "destiny",
    system: "num",
    prompt: "When unexpected events derail your plans, you tend to:",
    a: { text: "Problem-solve quickly and reassert control", value: "A" },
    b: { text: "Look for what the disruption might be pointing toward", value: "B" },
  },

  // ── CROSS-SYSTEM ─────────────────────────────────────────────────────────
  {
    id: "q19",
    dimension: "SN",
    system: "mbti",
    prompt: "You find yourself more fascinated by:",
    a: { text: "How things work in practice right now", value: "A" },
    b: { text: "What underlying patterns connect everything", value: "B" },
  },
  {
    id: "q20",
    dimension: "element",
    system: "astro",
    prompt: "Your energy is best described as:",
    a: { text: "Steady and grounded — I sustain and nurture", value: "A" },
    b: { text: "Dynamic and expansive — I ignite and explore", value: "B" },
  },
];
