import { QUESTIONS } from "./questions";

// All questions are answered on a 5-point Inaccurate → Accurate scale.
// rating 1 = Strongly Inaccurate … 3 = Neutral … 5 = Strongly Accurate.
// Each question has a direction (1 or -1) so that "Accurate" always pushes
// toward the correct pole regardless of how the statement is phrased.
export type AnswerValue = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<string, AnswerValue>;

// ── MBTI ─────────────────────────────────────────────────────────────────────
function scoreDimension(answers: Answers, dim: string, aLetter: string, bLetter: string): [string, number] {
  const qs = QUESTIONS.filter(q => q.dimension === dim);
  let weightSum = 0;
  for (const q of qs) {
    const rating = answers[q.id];
    if (rating === undefined) continue;
    // Convert 1-5 to -2…+2, then apply direction so positive always = A-pole
    weightSum += q.direction * (rating - 3);
  }
  const aWins = weightSum >= 0;
  const maxWeight = qs.length * 2 || 1;
  const pct = Math.round(50 + (Math.abs(weightSum) / maxWeight) * 50);
  return [aWins ? aLetter : bLetter, Math.min(pct, 100)];
}

export interface MBTIResult {
  type: string;         // e.g. "INFJ"
  EI: string; EI_pct: number;
  SN: string; SN_pct: number;
  TF: string; TF_pct: number;
  JP: string; JP_pct: number;
  description: string;
  traits: string[];
}

// Mirrors the official MBTI Manual's preference clarity categories (slight,
// moderate, clear, very clear) — clarity reflects how consistently someone
// leaned one way across the axis's items, not strength of skill or maturity.
export function clarityLabel(pct: number): "Slight" | "Moderate" | "Clear" | "Very Clear" {
  if (pct < 60) return "Slight";
  if (pct < 75) return "Moderate";
  if (pct < 90) return "Clear";
  return "Very Clear";
}

const MBTI_DESCRIPTIONS: Record<string, { description: string; traits: string[] }> = {
  INTJ: { description: "The Architect — visionary, independent, strategic", traits: ["Visionary", "Decisive", "High standards", "Private"] },
  INTP: { description: "The Logician — analytical, inventive, theoretical", traits: ["Analytical", "Inventive", "Logical", "Reserved"] },
  ENTJ: { description: "The Commander — decisive, ambitious, natural leader", traits: ["Strategic", "Driven", "Confident", "Efficient"] },
  ENTP: { description: "The Debater — clever, curious, loves a good argument", traits: ["Quick-witted", "Entrepreneurial", "Curious", "Candid"] },
  INFJ: { description: "The Advocate — insightful, principled, deeply empathetic", traits: ["Empathetic", "Principled", "Insightful", "Private"] },
  INFP: { description: "The Mediator — idealistic, creative, deeply values-driven", traits: ["Idealistic", "Creative", "Empathetic", "Open-minded"] },
  ENFJ: { description: "The Protagonist — charismatic, inspiring, others-focused", traits: ["Charismatic", "Inspiring", "Warm", "Organized"] },
  ENFP: { description: "The Campaigner — enthusiastic, creative, sees life as possibility", traits: ["Enthusiastic", "Creative", "Sociable", "Spontaneous"] },
  ISTJ: { description: "The Logistician — dependable, thorough, grounded in tradition", traits: ["Responsible", "Thorough", "Dependable", "Reserved"] },
  ISFJ: { description: "The Defender — loyal, warm, attentive to others' needs", traits: ["Loyal", "Observant", "Warm", "Diligent"] },
  ESTJ: { description: "The Executive — organized, direct, driven by responsibility", traits: ["Organized", "Direct", "Reliable", "Traditional"] },
  ESFJ: { description: "The Consul — caring, social, attuned to the room", traits: ["Caring", "Social", "Loyal", "Practical"] },
  ISTP: { description: "The Virtuoso — practical, observant, hands-on thinker", traits: ["Practical", "Observant", "Reserved", "Rational"] },
  ISFP: { description: "The Adventurer — gentle, artistic, lives in the present", traits: ["Gentle", "Artistic", "Flexible", "Perceptive"] },
  ESTP: { description: "The Entrepreneur — bold, perceptive, action-first", traits: ["Bold", "Observant", "Direct", "Energetic"] },
  ESFP: { description: "The Entertainer — spontaneous, energetic, makes life fun", traits: ["Spontaneous", "Energetic", "Practical", "Playful"] },
};

export function computeMBTI(answers: Answers): MBTIResult {
  const [EI, EI_pct] = scoreDimension(answers, "EI", "E", "I");
  const [SN, SN_pct] = scoreDimension(answers, "SN", "S", "N");
  const [TF, TF_pct] = scoreDimension(answers, "TF", "T", "F");
  const [JP, JP_pct] = scoreDimension(answers, "JP", "J", "P");
  const type = EI + SN + TF + JP;
  const meta = MBTI_DESCRIPTIONS[type] ?? { description: "A unique blend of all dimensions", traits: ["Complex", "Multifaceted", "Nuanced", "Rare"] };
  return { type, EI, EI_pct, SN, SN_pct, TF, TF_pct, JP, JP_pct, ...meta };
}

// ── ASTROLOGY ─────────────────────────────────────────────────────────────────
export interface AstrologyResult {
  sunSign: string;
  symbol: string;
  element: string;
  modality: string;
  elementFromAnswers: string;
  modalityFromAnswers: string;
  lunarScore: number;        // 0-100, higher = more lunar
  description: string;
  traits: string[];
}

const ZODIAC = [
  { name: "Capricorn", symbol: "♑", element: "Earth", modality: "Cardinal", startM: 12, startD: 22 },
  { name: "Aquarius",  symbol: "♒", element: "Air",   modality: "Fixed",    startM: 1,  startD: 20 },
  { name: "Pisces",    symbol: "♓", element: "Water",  modality: "Mutable",  startM: 2,  startD: 19 },
  { name: "Aries",     symbol: "♈", element: "Fire",   modality: "Cardinal", startM: 3,  startD: 21 },
  { name: "Taurus",    symbol: "♉", element: "Earth",  modality: "Fixed",    startM: 4,  startD: 20 },
  { name: "Gemini",    symbol: "♊", element: "Air",    modality: "Mutable",  startM: 5,  startD: 21 },
  { name: "Cancer",    symbol: "♋", element: "Water",  modality: "Cardinal", startM: 6,  startD: 21 },
  { name: "Leo",       symbol: "♌", element: "Fire",   modality: "Fixed",    startM: 7,  startD: 23 },
  { name: "Virgo",     symbol: "♍", element: "Earth",  modality: "Mutable",  startM: 8,  startD: 23 },
  { name: "Libra",     symbol: "♎", element: "Air",    modality: "Cardinal", startM: 9,  startD: 23 },
  { name: "Scorpio",   symbol: "♏", element: "Water",  modality: "Fixed",    startM: 10, startD: 23 },
  { name: "Sagittarius",symbol:"♐", element: "Fire",   modality: "Mutable",  startM: 11, startD: 22 },
];

const ZODIAC_DESC: Record<string, { description: string; traits: string[] }> = {
  Aries:       { description: "Bold, pioneering, and fiercely independent", traits: ["Courageous", "Ambitious", "Energetic", "Direct"] },
  Taurus:      { description: "Grounded, sensual, and loyal to what endures", traits: ["Patient", "Reliable", "Aesthetic", "Stubborn"] },
  Gemini:      { description: "Curious, communicative, and perpetually dual", traits: ["Adaptable", "Witty", "Communicative", "Restless"] },
  Cancer:      { description: "Nurturing, intuitive, and fiercely protective", traits: ["Intuitive", "Protective", "Empathetic", "Loyal"] },
  Leo:         { description: "Radiant, creative, and born to lead with heart", traits: ["Generous", "Creative", "Confident", "Dramatic"] },
  Virgo:       { description: "Analytical, devoted, and quietly brilliant", traits: ["Analytical", "Practical", "Diligent", "Modest"] },
  Libra:       { description: "Balanced, aesthetic, and devoted to harmony", traits: ["Diplomatic", "Fair", "Social", "Idealistic"] },
  Scorpio:     { description: "Intense, perceptive, and transformative by nature", traits: ["Passionate", "Resourceful", "Observant", "Secretive"] },
  Sagittarius: { description: "Adventurous, philosophical, and endlessly seeking", traits: ["Optimistic", "Adventurous", "Honest", "Restless"] },
  Capricorn:   { description: "Disciplined, ambitious, and built for the long game", traits: ["Disciplined", "Responsible", "Persistent", "Reserved"] },
  Aquarius:    { description: "Innovative, humanitarian, and delightfully eccentric", traits: ["Original", "Humanitarian", "Independent", "Idealistic"] },
  Pisces:      { description: "Dreamy, compassionate, and deeply intuitive", traits: ["Intuitive", "Compassionate", "Creative", "Otherworldly"] },
};

export function getSunSign(month: number, day: number) {
  // Find the sign whose start date is the latest one ≤ (month, day)
  for (let i = ZODIAC.length - 1; i >= 0; i--) {
    const z = ZODIAC[i];
    if (month > z.startM || (month === z.startM && day >= z.startD)) {
      return z;
    }
  }
  return ZODIAC[0]; // Capricorn fallback
}

export function computeAstrology(answers: Answers, month: number, day: number): AstrologyResult {
  const sign = getSunSign(month, day);

  // Element from answers (direction 1 = Earth/Water)
  const elementQs = QUESTIONS.filter(q => q.dimension === "element");
  let elementScore = 0;
  for (const q of elementQs) {
    const r = answers[q.id] ?? 3;
    elementScore += q.direction * (r - 3);
  }
  const elementFromAnswers = elementScore >= 0 ? "Earth/Water" : "Fire/Air";

  // Modality from answers (direction 1 = Cardinal/Fixed)
  const modalQs = QUESTIONS.filter(q => q.dimension === "modality");
  let modalScore = 0;
  for (const q of modalQs) {
    const r = answers[q.id] ?? 3;
    modalScore += q.direction * (r - 3);
  }
  const modalityFromAnswers = modalScore >= 0 ? "Cardinal/Fixed" : "Mutable";

  // Lunar score 0-100 (direction 1 = high lunar / emotion-sensitive)
  const lunarQs = QUESTIONS.filter(q => q.dimension === "lunar");
  let lunarSum = 0;
  for (const q of lunarQs) {
    const r = answers[q.id] ?? 3;
    lunarSum += q.direction * (r - 3) + 2;  // shift -2…+2 → 0…4
  }
  const lunarScore = Math.round((lunarSum / (lunarQs.length * 4 || 1)) * 100);

  const desc = ZODIAC_DESC[sign.name] ?? { description: "A unique celestial signature", traits: ["Unique", "Complex", "Rare", "Nuanced"] };

  return {
    sunSign: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    elementFromAnswers,
    modalityFromAnswers,
    lunarScore,
    ...desc,
  };
}

// ── NUMEROLOGY ────────────────────────────────────────────────────────────────
export interface NumerologyResult {
  lifePath: number;
  expressionNumber: number;
  soulUrge: string;  // "Achievement" | "Connection"
  destinyLean: string; // "Self-made" | "Called"
  lifePathTheme: string;
  lifePathDesc: string;
  traits: string[];
}

function reduceToSingleDigit(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  return reduceToSingleDigit(String(n).split("").reduce((s, d) => s + parseInt(d), 0));
}

const PYTHAGOREAN: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const LP_INFO: Record<number, { theme: string; desc: string; traits: string[] }> = {
  1:  { theme: "The Pioneer",       desc: "Independence, leadership, originality",      traits: ["Self-reliant", "Driven", "Innovative", "Courageous"] },
  2:  { theme: "The Harmonizer",    desc: "Partnership, diplomacy, sensitivity",        traits: ["Cooperative", "Empathetic", "Patient", "Diplomatic"] },
  3:  { theme: "The Creator",       desc: "Expression, creativity, joy",                traits: ["Communicative", "Artistic", "Optimistic", "Social"] },
  4:  { theme: "The Builder",       desc: "Structure, discipline, reliability",         traits: ["Methodical", "Honest", "Practical", "Steadfast"] },
  5:  { theme: "The Explorer",      desc: "Freedom, change, adventure",                 traits: ["Versatile", "Curious", "Resourceful", "Bold"] },
  6:  { theme: "The Nurturer",      desc: "Responsibility, love, service",              traits: ["Caring", "Protective", "Harmonious", "Loyal"] },
  7:  { theme: "The Seeker",        desc: "Analysis, introspection, wisdom",            traits: ["Thoughtful", "Spiritual", "Precise", "Introspective"] },
  8:  { theme: "The Achiever",      desc: "Power, abundance, mastery",                  traits: ["Ambitious", "Authoritative", "Resilient", "Strategic"] },
  9:  { theme: "The Humanitarian",  desc: "Compassion, completion, universal love",     traits: ["Idealistic", "Generous", "Intuitive", "Wise"] },
  11: { theme: "The Visionary",     desc: "Spiritual insight, inspiration, illumination", traits: ["Intuitive", "Empathetic", "Inspiring", "Sensitive"] },
  22: { theme: "The Master Builder",desc: "Grand visions made tangible",               traits: ["Visionary", "Practical", "Powerful", "Disciplined"] },
  33: { theme: "The Master Teacher",desc: "Compassionate creative healing",             traits: ["Nurturing", "Selfless", "Inspiring", "Creative"] },
};

export function computeNumerology(answers: Answers, name: string, month: number, day: number, year: number): NumerologyResult {
  // Life Path = reduce all digits of full birthdate
  const dateDigits = `${month}${day}${year}`;
  const lpRaw = dateDigits.split("").reduce((s, d) => s + parseInt(d), 0);
  const lifePath = reduceToSingleDigit(lpRaw);

  // Expression = Pythagorean value of full name
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  const exprRaw = clean.split("").reduce((s, c) => s + (PYTHAGOREAN[c] ?? 0), 0);
  const expressionNumber = reduceToSingleDigit(exprRaw);

  // Soul urge from answers (direction 1 = Achievement)
  const soulQs = QUESTIONS.filter(q => q.dimension === "soul");
  let soulScore = 0;
  for (const q of soulQs) {
    const r = answers[q.id] ?? 3;
    soulScore += q.direction * (r - 3);
  }
  const soulUrge = soulScore >= 0 ? "Achievement" : "Connection";

  // Destiny lean from answers (direction 1 = Self-made)
  const destinyQs = QUESTIONS.filter(q => q.dimension === "destiny");
  let destinyScore = 0;
  for (const q of destinyQs) {
    const r = answers[q.id] ?? 3;
    destinyScore += q.direction * (r - 3);
  }
  const destinyLean = destinyScore >= 0 ? "Self-made" : "Called";

  const lpMeta = LP_INFO[lifePath] ?? LP_INFO[9];

  return {
    lifePath,
    expressionNumber,
    soulUrge,
    destinyLean,
    lifePathTheme: lpMeta.theme,
    lifePathDesc: lpMeta.desc,
    traits: lpMeta.traits,
  };
}

// ── CONVERGENCES ──────────────────────────────────────────────────────────────
export interface Convergence {
  title: string;
  body: string;
  systems: Array<"mbti" | "astro" | "num">;
  strength: "strong" | "moderate";
}

export function computeConvergences(m: MBTIResult, a: AstrologyResult, n: NumerologyResult): Convergence[] {
  const results: Convergence[] = [];

  // Introversion ↔ Water/Earth + lunar
  if (m.EI === "I" && (a.element === "Water" || a.element === "Earth") && a.lunarScore >= 50) {
    results.push({
      title: "Inner World Orientation",
      body: "Your MBTI introversion, your water/earth elemental nature, and high lunar sensitivity all point to the same truth: you process life from the inside out, finding richness in reflection before action.",
      systems: ["mbti", "astro"],
      strength: "strong",
    });
  }

  // Feeling ↔ Water element
  if (m.TF === "F" && (a.element === "Water" || a.element === "Cancer" || a.element === "Pisces")) {
    results.push({
      title: "Emotional Intelligence",
      body: "Your Feeling preference (MBTI) and Water elemental nature converge on empathy and relational intelligence as your primary navigation tools — you read rooms, not just facts.",
      systems: ["mbti", "astro"],
      strength: "strong",
    });
  }

  // Intuition ↔ Fire/Air
  if (m.SN === "N" && (a.element === "Fire" || a.element === "Air")) {
    results.push({
      title: "Abstract & Visionary Thinking",
      body: "Intuition (N) in MBTI and Fire/Air elements both describe a mind that lives in possibilities. You're drawn to what could be, to systems, ideas, and patterns rather than the concrete present.",
      systems: ["mbti", "astro"],
      strength: "strong",
    });
  }

  // Life Path 7/9/11 ↔ Introversion
  if ([7, 9, 11].includes(n.lifePath) && m.EI === "I") {
    results.push({
      title: "Contemplative Nature",
      body: `Life Path ${n.lifePath} and MBTI Introversion both describe a person who recharges through solitude and operates from a rich interior life. Depth over breadth is not a preference — it's a calling.`,
      systems: ["mbti", "num"],
      strength: "strong",
    });
  }

  // LP 1/8/22 ↔ TJ
  if ([1, 8, 22].includes(n.lifePath) && m.TF === "T" && m.JP === "J") {
    results.push({
      title: "Strategic Leadership Drive",
      body: `Life Path ${n.lifePath} with Thinking-Judging creates a pattern of ambitious, goal-oriented leadership — decisive, systematic, mission-driven. All three systems agree: you're built to build.`,
      systems: ["mbti", "num"],
      strength: "strong",
    });
  }

  // Numerology ↔ Astrology: relational core
  if ([2, 6].includes(n.lifePath) && (a.element === "Water" || a.modality === "Cardinal") && n.soulUrge === "Connection") {
    results.push({
      title: "Relational Core",
      body: "Your life path, elemental nature, and soul urge all centre relationships, emotional bonds, and care as the axis of your life. You don't just love people — you organise around them.",
      systems: ["astro", "num"],
      strength: "strong",
    });
  }

  // Creative fire
  if ([1, 3].includes(n.lifePath) && (a.element === "Fire" || a.element === "Air") && n.expressionNumber <= 3) {
    results.push({
      title: "Creative Ignition",
      body: "Fire or Air element plus a low-numbered expression path signals someone wired to express, create, and initiate. You don't wait for permission to begin — you are the spark.",
      systems: ["astro", "num"],
      strength: "strong",
    });
  }

  // Sensing + Earth = Pragmatic Realist
  if (m.SN === "S" && (a.element === "Earth") && n.destinyLean === "Self-made") {
    results.push({
      title: "Pragmatic Realism",
      body: "Sensing (S), an Earth element, and a self-made destiny orientation describe someone who trusts what's real, tangible, and earned. You build on solid ground — no castles in the air.",
      systems: ["mbti", "astro", "num"],
      strength: "strong",
    });
  }

  // Lunar + Feeling + Connection soul = Deep Empath
  if (a.lunarScore >= 75 && m.TF === "F" && n.soulUrge === "Connection") {
    results.push({
      title: "Deep Empathic Current",
      body: "High lunar sensitivity, Feeling preference, and a soul urge toward connection all triangulate on the same gift: a rare depth of emotional attunement that makes you someone others feel truly seen by.",
      systems: ["mbti", "astro", "num"],
      strength: "strong",
    });
  }

  // Fallback
  if (results.length === 0) {
    results.push({
      title: "Multidimensional Complexity",
      body: "Your profile resists easy convergence — each system reveals a genuinely different facet. Rather than a single theme, you carry real range. That's not a contradiction; it's the full spectrum.",
      systems: ["mbti", "astro", "num"],
      strength: "moderate",
    });
  }

  return results.slice(0, 3);
}

// ── ARCHETYPE NAMING ──────────────────────────────────────────────────────────
export function deriveArchetype(m: MBTIResult, a: AstrologyResult, n: NumerologyResult): { archetype: string; tagline: string; eyebrow: string } {
  const introverted = m.EI === "I";
  const intuitive = m.SN === "N";
  const feeling = m.TF === "F";
  const perceiving = m.JP === "P";
  const waterEarth = a.element === "Water" || a.element === "Earth";
  const fireAir = a.element === "Fire" || a.element === "Air";

  if (intuitive && feeling && introverted) {
    return { archetype: "The Quiet Visionary", tagline: "You see what others miss — and hold it gently, waiting for the right moment to share.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (!intuitive && !feeling && !introverted) {
    return { archetype: "The Grounded Executor", tagline: "You turn vision into reality. Structure, discipline, and presence are your superpowers.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (intuitive && !feeling && !introverted) {
    return { archetype: "The Strategic Architect", tagline: "You see the whole system, design the solution, and lead the charge — all at once.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (waterEarth && feeling && introverted) {
    return { archetype: "The Deep Tide", tagline: "Still on the surface, vast underneath. Your depth of feeling is your greatest gift.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (fireAir && !introverted && perceiving) {
    return { archetype: "The Radiant Explorer", tagline: "You expand every room you enter and every idea you touch. Energy is your native language.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (n.lifePath === 7 || n.lifePath === 11) {
    return { archetype: "The Illuminated Seeker", tagline: "Truth calls to you across every system — and you're wise enough to listen in all of them.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  if (n.lifePath === 1 || n.lifePath === 8) {
    return { archetype: "The Sovereign Builder", tagline: "Born to lead and built to last. Your mark on the world is both intentional and inevitable.", eyebrow: "YOUR TRINE ARCHETYPE" };
  }
  // Default
  return { archetype: "The Complex Original", tagline: "You defy easy categories — and that's not a flaw, it's the point. You carry multitudes.", eyebrow: "YOUR TRINE ARCHETYPE" };
}

// ── FULL RESULTS ──────────────────────────────────────────────────────────────
export interface TrineResult {
  mbti: MBTIResult;
  astrology: AstrologyResult;
  numerology: NumerologyResult;
  convergences: Convergence[];
  archetype: string;
  tagline: string;
  eyebrow: string;
}

export function computeAll(
  answers: Answers,
  name: string,
  month: number,
  day: number,
  year: number,
): TrineResult {
  const mbti = computeMBTI(answers);
  const astrology = computeAstrology(answers, month, day);
  const numerology = computeNumerology(answers, name, month, day, year);
  const convergences = computeConvergences(mbti, astrology, numerology);
  const { archetype, tagline, eyebrow } = deriveArchetype(mbti, astrology, numerology);
  return { mbti, astrology, numerology, convergences, archetype, tagline, eyebrow };
}
