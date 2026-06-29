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
  // 5 questions per axis, each targeting a distinct facet of the dichotomy
  // so a single ambiguous answer can't dominate the result.

  // Extraversion / Introversion — recharge, processing style, social
  // breadth vs. depth, response to unplanned contact, speaking style.
  {
    id: "ei1",
    dimension: "EI",
    system: "mbti",
    prompt: "After a long weekend full of social events, you typically feel:",
    a: { text: "Energized — I want to keep the momentum going", value: "A" },
    b: { text: "Drained — I need quiet time to recharge", value: "B" },
  },
  {
    id: "ei2",
    dimension: "EI",
    system: "mbti",
    prompt: "When working through a difficult problem, you'd rather:",
    a: { text: "Talk it through out loud with others", value: "A" },
    b: { text: "Think it through quietly on your own first", value: "B" },
  },
  {
    id: "ei3",
    dimension: "EI",
    system: "mbti",
    prompt: "At a party full of people you don't know, you're more likely to:",
    a: { text: "Work the room and meet as many people as you can", value: "A" },
    b: { text: "Find one or two people and go deeper", value: "B" },
  },
  {
    id: "ei4",
    dimension: "EI",
    system: "mbti",
    prompt: "An unexpected call or someone dropping by unannounced feels:",
    a: { text: "Welcome — I like the spontaneity", value: "A" },
    b: { text: "Disruptive — I'd rather it was planned", value: "B" },
  },
  {
    id: "ei5",
    dimension: "EI",
    system: "mbti",
    prompt: "In a group discussion, you tend to:",
    a: { text: "Share thoughts out loud as they occur to you", value: "A" },
    b: { text: "Wait until your thoughts are fully formed before speaking", value: "B" },
  },

  // Sensing / Intuition — concrete vs. abstract, present vs. possibility,
  // detail recall vs. meaning, established methods vs. experimentation.
  {
    id: "sn1",
    dimension: "SN",
    system: "mbti",
    prompt: "When absorbing new information, you trust most:",
    a: { text: "Concrete facts, real examples, and sensory details", value: "A" },
    b: { text: "Patterns, theories, and what the information implies", value: "B" },
  },
  {
    id: "sn2",
    dimension: "SN",
    system: "mbti",
    prompt: "You are more drawn to:",
    a: { text: "What is — practical, real, present", value: "A" },
    b: { text: "What could be — possibilities and future visions", value: "B" },
  },
  {
    id: "sn3",
    dimension: "SN",
    system: "mbti",
    prompt: "When you encounter a complex problem, what do you reach for first?",
    a: { text: "Concrete data and what has worked before in similar situations", value: "A" },
    b: { text: "The underlying pattern — what does this really mean at a deeper level?", value: "B" },
  },
  {
    id: "sn4",
    dimension: "SN",
    system: "mbti",
    prompt: "After hearing someone tell a story, what sticks with you most is:",
    a: { text: "The specific details — what was said and what happened", value: "A" },
    b: { text: "The overall feeling and meaning behind it", value: "B" },
  },
  {
    id: "sn5",
    dimension: "SN",
    system: "mbti",
    prompt: "You'd describe yourself as more:",
    a: { text: "Realistic and grounded in the present", value: "A" },
    b: { text: "Imaginative and focused on future possibility", value: "B" },
  },

  // Thinking / Feeling — decision basis, response to others' distress,
  // conflict priorities, communication style, internal consistency vs. harmony.
  {
    id: "tf1",
    dimension: "TF",
    system: "mbti",
    prompt: "When making an important decision, what weighs most?",
    a: { text: "Logical analysis and objective criteria", value: "A" },
    b: { text: "How it affects the people involved", value: "B" },
  },
  {
    id: "tf2",
    dimension: "TF",
    system: "mbti",
    prompt: "People who know you well would say you lead with:",
    a: { text: "Your head — principles and reason", value: "A" },
    b: { text: "Your heart — empathy and values", value: "B" },
  },
  {
    id: "tf3",
    dimension: "TF",
    system: "mbti",
    prompt: "When you have to give someone feedback they may not want to hear, what guides you?",
    a: { text: "Being accurate and clear, even if the truth is uncomfortable", value: "A" },
    b: { text: "Finding the right tone so the message lands without causing pain", value: "B" },
  },
  {
    id: "tf4",
    dimension: "TF",
    system: "mbti",
    prompt: "In a disagreement, you care more about:",
    a: { text: "Landing on the most logically sound conclusion, regardless of who it favors", value: "A" },
    b: { text: "Reaching an outcome that keeps the relationship intact and everyone heard", value: "B" },
  },
  {
    id: "tf5",
    dimension: "TF",
    system: "mbti",
    prompt: "When making a hard call that affects others, what matters most to you?",
    a: { text: "That the decision holds up to scrutiny — it's logical and defensible", value: "A" },
    b: { text: "That it reflects your values and considers the human impact", value: "B" },
  },

  // Judging / Perceiving — planning vs. spontaneity, deadlines, closure
  // vs. openness, decision finality, organization.
  {
    id: "jp1",
    dimension: "JP",
    system: "mbti",
    prompt: "Your ideal work style is:",
    a: { text: "Planned — I like clear structure and settled plans", value: "A" },
    b: { text: "Flexible — I like staying open and adapting as I go", value: "B" },
  },
  {
    id: "jp2",
    dimension: "JP",
    system: "mbti",
    prompt: "Deadlines make you feel:",
    a: { text: "Reassured — they help me stay on track", value: "A" },
    b: { text: "Constrained — I prefer to keep options open", value: "B" },
  },
  {
    id: "jp3",
    dimension: "JP",
    system: "mbti",
    prompt: "When you have a deadline coming up, your energy tends to:",
    a: { text: "Kick in early — I'd rather have buffer time and feel settled", value: "A" },
    b: { text: "Peak right before — the real timeline is the deadline itself", value: "B" },
  },
  {
    id: "jp4",
    dimension: "JP",
    system: "mbti",
    prompt: "Once you've made a decision, you tend to:",
    a: { text: "Consider it settled and move on", value: "A" },
    b: { text: "Stay open to revisiting it if something new comes up", value: "B" },
  },
  {
    id: "jp5",
    dimension: "JP",
    system: "mbti",
    prompt: "Your physical environment — desk, files, living space — tends to be:",
    a: { text: "Organized by a system I can explain — things have designated places", value: "A" },
    b: { text: "Organized by familiarity — I know where things are, even if it's not obvious to others", value: "B" },
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
    id: "q20",
    dimension: "element",
    system: "astro",
    prompt: "Your energy is best described as:",
    a: { text: "Steady and grounded — I sustain and nurture", value: "A" },
    b: { text: "Dynamic and expansive — I ignite and explore", value: "B" },
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
];