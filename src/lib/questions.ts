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
  // 7 questions per axis. Each question is a simple "I" statement pair so
  // the test feels like a self-portrait, not a scenario puzzle.
  // A always = the first letter of the axis (E, S, T, J).

  // Extraversion / Introversion — recharge, social breadth vs. depth,
  // initiation, processing style, attention, solitude, ideation mode.
  {
    id: "ei1",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I feel energized after spending time with a large group of people", value: "A" },
    b: { text: "I feel drained after spending time with a large group of people", value: "B" },
  },
  {
    id: "ei2",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I often think out loud and talk through my ideas with others", value: "A" },
    b: { text: "I prefer to think things through quietly before I share them", value: "B" },
  },
  {
    id: "ei3",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I enjoy meeting lots of new people and expanding my circle", value: "A" },
    b: { text: "I prefer deepening a few close relationships over making new ones", value: "B" },
  },
  {
    id: "ei4",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I'm comfortable being the center of attention", value: "A" },
    b: { text: "I prefer to stay in the background", value: "B" },
  },
  {
    id: "ei5",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I start conversations easily, even with strangers", value: "A" },
    b: { text: "I tend to wait for others to start the conversation", value: "B" },
  },
  {
    id: "ei6",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I find long stretches of alone time boring or restless", value: "A" },
    b: { text: "I genuinely need time alone to recharge after being around people", value: "B" },
  },
  {
    id: "ei7",
    dimension: "EI",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I process ideas best by talking them through with someone", value: "A" },
    b: { text: "I process ideas best by reflecting on my own first", value: "B" },
  },

  // Sensing / Intuition — information trust, time orientation, instruction
  // style, memory, methods, imagination, detail attention.
  {
    id: "sn1",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I trust concrete facts and what I can directly see or measure", value: "A" },
    b: { text: "I trust patterns, gut instinct, and what the facts imply", value: "B" },
  },
  {
    id: "sn2",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I focus on what is real and present", value: "A" },
    b: { text: "I focus on what could be and what's possible", value: "B" },
  },
  {
    id: "sn3",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I prefer step-by-step, practical instructions", value: "A" },
    b: { text: "I prefer to understand the big picture before the details", value: "B" },
  },
  {
    id: "sn4",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I remember events in specific, concrete detail", value: "A" },
    b: { text: "I remember the overall meaning and impression of events", value: "B" },
  },
  {
    id: "sn5",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I like using established methods that have been proven to work", value: "A" },
    b: { text: "I like experimenting with new and untested approaches", value: "B" },
  },
  {
    id: "sn6",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I am practical and down-to-earth", value: "A" },
    b: { text: "I have a vivid imagination and love exploring abstract ideas", value: "B" },
  },
  {
    id: "sn7",
    dimension: "SN",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I pay close attention to details and what's right in front of me", value: "A" },
    b: { text: "I can easily lose track of details when I'm focused on the big picture", value: "B" },
  },

  // Thinking / Feeling — decision basis, honesty vs. tact, conflict style,
  // emotional attunement, universalism vs. circumstance, persuasion, priority.
  {
    id: "tf1",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I make decisions based on logic and objective analysis", value: "A" },
    b: { text: "I make decisions based on how they will affect the people involved", value: "B" },
  },
  {
    id: "tf2",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I value honesty and accuracy, even when it's blunt", value: "A" },
    b: { text: "I value kindness and tact, even when it softens the truth", value: "B" },
  },
  {
    id: "tf3",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "In conflicts, I focus on finding the most logical solution", value: "A" },
    b: { text: "In conflicts, I focus on keeping the relationship intact", value: "B" },
  },
  {
    id: "tf4",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I can stay calm and objective even in highly emotional situations", value: "A" },
    b: { text: "I easily pick up on and absorb the emotions of people around me", value: "B" },
  },
  {
    id: "tf5",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I think the same rules should apply equally to everyone", value: "A" },
    b: { text: "I think each person's circumstances and feelings should shape how rules are applied", value: "B" },
  },
  {
    id: "tf6",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I'm more swayed by a well-reasoned argument than by a personal story", value: "A" },
    b: { text: "I'm more moved by a personal story than by an abstract argument", value: "B" },
  },
  {
    id: "tf7",
    dimension: "TF",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I prioritize being accurate and correct over being agreeable", value: "A" },
    b: { text: "I prioritize harmony and connection over being technically right", value: "B" },
  },

  // Judging / Perceiving — planning, deadline energy, environment, decision
  // finality, schedule, change response, lists.
  {
    id: "jp1",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I like to have a clear plan before I start something", value: "A" },
    b: { text: "I prefer to jump in and figure it out as I go", value: "B" },
  },
  {
    id: "jp2",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I finish tasks well before the deadline", value: "A" },
    b: { text: "I work best right up to — or past — the deadline", value: "B" },
  },
  {
    id: "jp3",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I like my living and working space to be tidy and organized", value: "A" },
    b: { text: "I'm comfortable working in a more fluid, flexible environment", value: "B" },
  },
  {
    id: "jp4",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "Once I've made a decision, I move on and don't second-guess it", value: "A" },
    b: { text: "I like to keep my options open and revisit decisions if something new comes up", value: "B" },
  },
  {
    id: "jp5",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I prefer to follow a schedule", value: "A" },
    b: { text: "I prefer to go with the flow", value: "B" },
  },
  {
    id: "jp6",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "Last-minute changes to plans stress me out", value: "A" },
    b: { text: "I enjoy the energy and possibilities of unexpected changes", value: "B" },
  },
  {
    id: "jp7",
    dimension: "JP",
    system: "mbti",
    prompt: "Pick the statement that fits you better:",
    a: { text: "I make lists and like checking things off", value: "A" },
    b: { text: "I find rigid to-do lists stifling — I'd rather stay flexible", value: "B" },
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