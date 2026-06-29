export type Dimension = "EI" | "SN" | "TF" | "JP" | "element" | "modality" | "lunar" | "destiny" | "expression" | "soul";

export interface Question {
  id: string;
  dimension: Dimension;
  system: "mbti" | "astro" | "num";
  text: string;
  // direction 1  → rating 5 (Accurate) pushes toward the A-pole (E, S, T, J, Earth/Water, Cardinal/Fixed, high-lunar, Achievement, Self-made)
  // direction -1 → rating 5 pushes toward the B-pole (I, N, F, P, Fire/Air, Mutable, low-lunar, Connection, Called)
  direction: 1 | -1;
}

export const QUESTIONS: Question[] = [
  // ── MBTI ──────────────────────────────────────────────────────────────────────
  // Each question is a single "I" statement rated on an Inaccurate → Accurate scale.
  // A-pole = first letter of the axis (E, S, T, J).

  // Extraversion / Introversion
  { id: "ei1", dimension: "EI", system: "mbti", direction:  1, text: "I feel energized after spending time with a large group of people" },
  { id: "ei2", dimension: "EI", system: "mbti", direction:  1, text: "I think out loud and talk through my ideas with others" },
  { id: "ei3", dimension: "EI", system: "mbti", direction:  1, text: "I enjoy meeting lots of new people and expanding my social circle" },
  { id: "ei4", dimension: "EI", system: "mbti", direction: -1, text: "I find it draining to be put in the spotlight or made the center of attention" },
  { id: "ei5", dimension: "EI", system: "mbti", direction: -1, text: "I tend to observe and listen before joining a conversation in an unfamiliar group" },
  { id: "ei6", dimension: "EI", system: "mbti", direction: -1, text: "I genuinely need time alone to recharge after being around people" },
  { id: "ei7", dimension: "EI", system: "mbti", direction: -1, text: "I process ideas best by reflecting on my own first" },

  // Sensing / Intuition
  { id: "sn1", dimension: "SN", system: "mbti", direction:  1, text: "I trust concrete facts and what I can directly see or measure" },
  { id: "sn2", dimension: "SN", system: "mbti", direction:  1, text: "I focus on what is real and present rather than what could be" },
  { id: "sn3", dimension: "SN", system: "mbti", direction:  1, text: "I prefer step-by-step, practical instructions" },
  { id: "sn4", dimension: "SN", system: "mbti", direction: -1, text: "I am more drawn to the meaning or pattern behind events than the specific facts" },
  { id: "sn5", dimension: "SN", system: "mbti", direction: -1, text: "I enjoy imagining how things could be done differently more than refining what already works" },
  { id: "sn6", dimension: "SN", system: "mbti", direction: -1, text: "I have a vivid imagination and love exploring abstract ideas" },
  { id: "sn7", dimension: "SN", system: "mbti", direction: -1, text: "I often lose track of details when I am focused on the big picture" },

  // Thinking / Feeling
  { id: "tf1", dimension: "TF", system: "mbti", direction:  1, text: "I make decisions based on logic and objective analysis" },
  { id: "tf2", dimension: "TF", system: "mbti", direction:  1, text: "I value honesty and accuracy, even when it is blunt" },
  { id: "tf3", dimension: "TF", system: "mbti", direction:  1, text: "I can stay calm and objective even in highly emotional situations" },
  { id: "tf4", dimension: "TF", system: "mbti", direction: -1, text: "I naturally tune into how people around me are feeling, even when they do not say it" },
  { id: "tf5", dimension: "TF", system: "mbti", direction: -1, text: "I find it easy to put myself in someone else's shoes, even when I strongly disagree with them" },
  { id: "tf6", dimension: "TF", system: "mbti", direction: -1, text: "I make decisions based on how they will affect the people involved" },
  { id: "tf7", dimension: "TF", system: "mbti", direction: -1, text: "I easily pick up on and absorb the emotions of people around me" },

  // Judging / Perceiving
  { id: "jp1", dimension: "JP", system: "mbti", direction:  1, text: "I like to have a clear plan before I start something" },
  { id: "jp2", dimension: "JP", system: "mbti", direction:  1, text: "I finish tasks well before the deadline" },
  { id: "jp3", dimension: "JP", system: "mbti", direction:  1, text: "I like my living and working space to be tidy and organized" },
  { id: "jp4", dimension: "JP", system: "mbti", direction: -1, text: "I prefer keeping my options open rather than locking in a decision too early" },
  { id: "jp5", dimension: "JP", system: "mbti", direction: -1, text: "I find that having too many plans or commitments starts to feel restrictive" },
  { id: "jp6", dimension: "JP", system: "mbti", direction: -1, text: "I enjoy the energy and possibilities of unexpected changes" },
  { id: "jp7", dimension: "JP", system: "mbti", direction: -1, text: "I find rigid to-do lists stifling — I would rather stay flexible" },

  // ── ASTROLOGY ─────────────────────────────────────────────────────────────────
  // Element: direction 1 → Earth/Water
  { id: "q9",  dimension: "element",  system: "astro", direction:  1, text: "I feel most at home in stable, grounded, or natural environments" },
  { id: "q20", dimension: "element",  system: "astro", direction:  1, text: "I have a steady, nurturing energy that sustains the people around me" },

  // Modality: direction 1 → Cardinal/Fixed
  { id: "q10", dimension: "modality", system: "astro", direction:  1, text: "I naturally take charge and initiate when a new challenge appears" },

  // Lunar: direction 1 → high lunar (mood-sensitive, emotion-guided)
  { id: "q11", dimension: "lunar",    system: "astro", direction:  1, text: "My mood shifts noticeably with seasons, phases, or the energy of those around me" },
  { id: "q12", dimension: "lunar",    system: "astro", direction:  1, text: "I let emotions guide my major life decisions" },

  // ── NUMEROLOGY ────────────────────────────────────────────────────────────────
  // Expression: direction 1 → leader / creator pole
  { id: "q13", dimension: "expression", system: "num", direction: 1, text: "People naturally see me as a leader or someone with a strong presence" },
  { id: "q14", dimension: "expression", system: "num", direction: 1, text: "I am more of a creator and initiator than a supporter or harmonizer" },

  // Soul: direction 1 → Achievement
  { id: "q15", dimension: "soul",    system: "num", direction: 1, text: "My deepest drive is to achieve mastery and leave a lasting mark" },
  { id: "q16", dimension: "soul",    system: "num", direction: 1, text: "I am more motivated by ambition and building something lasting than by connection" },

  // Destiny: direction 1 → Self-made
  { id: "q17", dimension: "destiny", system: "num", direction: 1, text: "I believe I actively shape my life through my choices and willpower" },
  { id: "q18", dimension: "destiny", system: "num", direction: 1, text: "When unexpected events derail my plans, I problem-solve quickly and reassert control" },
];
