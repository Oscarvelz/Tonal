/**
 * TONAL's on-device brief reader (fleet addition, 1.1).
 *
 * Studio used to send the brief to a server AI (generate-look.ts). This
 * module teaches the app to read the brief itself: a deterministic
 * interpreter over the app's own fashion vocabulary — occasions, seasons,
 * colors by name, fabrics, styles — wired to the same color engine the
 * runway uses. No key, no server, no network: the look is composed on the
 * device, and the reading is reported back honestly (what was used, what
 * was not understood, what could not be fully honored).
 */
import { generateLook } from "@/lib/color/engine";
import type { GenerateOpts } from "@/lib/color/engine";
import type {
  Harmony,
  Look,
  Occasion,
  Piece,
  Season,
  Sophistication,
} from "@/lib/color/types";

export type BriefReading = {
  /** True when the brief box held any words at all. */
  hadBrief: boolean;
  occasion?: Occasion;
  season?: Season;
  sophistication?: Sophistication;
  harmony?: Harmony;
  wantColors: string[];
  avoidColors: string[];
  wantFabrics: string[];
  avoidFabrics: string[];
  /** Human phrases describing what the brief was read as. */
  used: string[];
  /** Meaningful words the reader does not know. */
  ignored: string[];
  /** Hard requests no generated look could fully honor. */
  relaxed: string[];
};

const COLOR_WORDS = [
  "navy", "black", "white", "ivory", "cream", "camel", "tan", "beige",
  "stone", "khaki", "sand", "taupe", "brown", "cognac", "chocolate",
  "espresso", "burgundy", "oxblood", "wine", "red", "crimson", "scarlet",
  "blush", "pink", "rose", "coral", "peach", "orange", "rust",
  "terracotta", "mustard", "yellow", "gold", "olive", "sage", "moss",
  "forest", "emerald", "green", "teal", "mint", "turquoise", "blue",
  "sky", "azure", "cobalt", "indigo", "denim", "purple", "violet",
  "aubergine", "plum", "lavender", "lilac", "grey", "gray", "charcoal",
  "silver", "fog", "ink", "midnight", "bottle", "magenta", "fuchsia",
];

const FABRIC_WORDS = [
  "linen", "merino", "wool", "cotton", "suede", "leather", "silk",
  "cashmere", "denim", "velvet", "tweed", "corduroy", "flannel", "satin",
  "lace", "knit", "knitted", "canvas", "fresco", "twill", "gabardine",
  "crepe", "chiffon", "boucle", "seersucker", "poplin", "oxford",
];

/** Setting words name where, not what: they yield to any real event word
 *  ("beach wedding" is a wedding). */
const WEAK_OCCASION_WORDS = new Set([
  "beach",
  "vacation",
  "holiday",
  "travel",
  "trip",
  "picnic",
  "weekend",
  "everyday",
]);

const OCCASION_WORDS: Array<[string, Occasion]> = [
  ["black tie", "formal"],
  ["gala", "formal"],
  ["funeral", "formal"],
  ["prom", "formal"],
  ["opera", "formal"],
  ["wedding", "elegant"],
  ["ceremony", "elegant"],
  ["date", "elegant"],
  ["dinner", "elegant"],
  ["party", "elegant"],
  ["church", "elegant"],
  ["graduation", "elegant"],
  ["cocktail", "elegant"],
  ["interview", "smart-casual"],
  ["office", "smart-casual"],
  ["work", "smart-casual"],
  ["meeting", "smart-casual"],
  ["business", "smart-casual"],
  ["brunch", "smart-casual"],
  ["beach", "casual"],
  ["vacation", "casual"],
  ["holiday", "casual"],
  ["travel", "casual"],
  ["trip", "casual"],
  ["picnic", "casual"],
  ["weekend", "casual"],
  ["everyday", "casual"],
];

const SEASON_WORDS: Array<[string, Season]> = [
  ["summer", "summer"],
  ["summertime", "summer"],
  ["beach", "summer"],
  ["hot", "summer"],
  ["heat", "summer"],
  ["heatwave", "summer"],
  ["tropical", "summer"],
  ["july", "summer"],
  ["august", "summer"],
  ["winter", "winter"],
  ["snow", "winter"],
  ["snowy", "winter"],
  ["freezing", "winter"],
  ["ski", "winter"],
  ["december", "winter"],
  ["january", "winter"],
  ["spring", "spring"],
  ["easter", "spring"],
  ["april", "spring"],
  ["may", "spring"],
  ["autumn", "autumn"],
  ["fall", "autumn"],
  ["october", "autumn"],
  ["november", "autumn"],
  ["thanksgiving", "autumn"],
];

const STYLE_PHRASES: Array<{
  phrase: string;
  harmony?: Harmony;
  sophistication?: Sophistication;
  label: string;
}> = [
  { phrase: "quiet luxury", harmony: "quiet-luxury", sophistication: "sartorial", label: "quiet luxury" },
  { phrase: "old money", sophistication: "sartorial", label: "old money → sartorial" },
  { phrase: "high contrast", harmony: "high-contrast", label: "high contrast" },
  { phrase: "low contrast", harmony: "low-contrast", label: "low contrast" },
  { phrase: "split complement", harmony: "split-complement", label: "split complement" },
  { phrase: "one color", harmony: "monochrome", label: "one color → monochrome" },
];

const STYLE_WORDS: Array<{
  word: string;
  harmony?: Harmony;
  sophistication?: Sophistication;
  label: string;
}> = [
  { word: "tailored", sophistication: "sartorial", label: "tailored → sartorial" },
  { word: "sartorial", sophistication: "sartorial", harmony: "sartorial", label: "sartorial" },
  { word: "classic", sophistication: "sartorial", label: "classic → sartorial" },
  { word: "bold", harmony: "high-contrast", label: "bold → high contrast" },
  { word: "dramatic", harmony: "high-contrast", label: "dramatic → high contrast" },
  { word: "striking", harmony: "high-contrast", label: "striking → high contrast" },
  { word: "soft", harmony: "low-contrast", label: "soft → low contrast" },
  { word: "gentle", harmony: "low-contrast", label: "gentle → low contrast" },
  { word: "romantic", harmony: "low-contrast", label: "romantic → low contrast" },
  { word: "muted", harmony: "low-contrast", label: "muted → low contrast" },
  { word: "earthy", harmony: "earth-jewel", label: "earthy → earth & jewel" },
  { word: "minimal", harmony: "monochrome", label: "minimal → monochrome" },
  { word: "minimalist", harmony: "monochrome", label: "minimalist → monochrome" },
  { word: "monochrome", harmony: "monochrome", label: "monochrome" },
  { word: "tonal", harmony: "tonal", label: "tonal" },
  { word: "analogous", harmony: "analogous", label: "analogous" },
  { word: "complementary", harmony: "complementary", label: "complementary" },
  { word: "triadic", harmony: "triadic", label: "triadic" },
  { word: "colorful", harmony: "complementary", label: "colorful → complementary" },
  { word: "vibrant", harmony: "triadic", label: "vibrant → triadic" },
  { word: "playful", harmony: "triadic", label: "playful → triadic" },
  { word: "unexpected", harmony: "unexpected", label: "unexpected" },
  { word: "edgy", sophistication: "avant-garde", label: "edgy → avant-garde" },
  { word: "experimental", sophistication: "avant-garde", label: "experimental → avant-garde" },
  { word: "relaxed", sophistication: "everyday", label: "relaxed → everyday" },
  { word: "easy", sophistication: "everyday", label: "easy → everyday" },
  { word: "effortless", sophistication: "everyday", label: "effortless → everyday" },
  { word: "refined", sophistication: "refined", label: "refined" },
  { word: "polished", sophistication: "refined", label: "polished → refined" },
];

const STOPWORDS = new Set([
  "i", "me", "my", "we", "you", "the", "a", "an", "and", "or", "of", "to",
  "in", "on", "at", "for", "with", "without", "have", "has", "had", "got",
  "get", "want", "wants", "need", "needs", "like", "love", "wear",
  "wearing", "look", "looks", "looking", "outfit", "something", "some",
  "that", "this", "it", "is", "are", "be", "please", "just", "very",
  "really", "so", "too", "much", "more", "less", "no", "not", "never",
  "avoid", "except", "but", "room", "day", "night", "evening", "morning",
  "afternoon", "am", "pm", "warm", "cool", "cold", "run", "runs",
  "dress", "dressed", "style", "styled", "color", "colors", "colour",
  "colours", "shade", "shades", "tone", "tones", "pair", "pairs",
  "shoes", "shoe", "shirt", "top", "bottom", "when", "where", "there",
  "here", "going", "go", "will", "would", "can", "could", "should",
  "make", "makes", "made", "give", "gives", "one", "two", "all", "any",
  "from", "into", "over", "under", "about", "than", "then", "them",
  "they", "their", "his", "her", "him", "she", "he", "its", "our",
  "your", "yours", "mine", "what", "which", "who", "how", "if", "as",
  "by", "do", "does", "did", "was", "were", "been", "being", "am",
]);

const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  all: "Year-round",
};

const OCCASION_LABELS: Record<Occasion, string> = {
  casual: "Casual",
  "smart-casual": "Smart casual",
  elegant: "Elegant",
  formal: "Formal",
};

function tokensOf(text: string): string[] {
  return text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
}

function piecesOf(look: Look): Piece[] {
  const p = look.pieces;
  return [p.layer, p.top, p.bottom, p.shoes, p.accessory].filter(
    (x): x is Piece => Boolean(x),
  );
}

function pieceText(piece: Piece): string {
  return `${piece.colorName} ${piece.garment}`.toLowerCase();
}

function lookHasWord(look: Look, word: string): boolean {
  return piecesOf(look).some((piece) => tokensOf(pieceText(piece)).includes(word));
}

export function composeFromBrief(
  notes: string,
  base: GenerateOpts,
): { look: Look; reading: BriefReading } {
  const text = ` ${notes.toLowerCase().replace(/[^a-z\s-]/g, " ")} `;
  const reading: BriefReading = {
    hadBrief: notes.trim().length > 0,
    wantColors: [],
    avoidColors: [],
    wantFabrics: [],
    avoidFabrics: [],
    used: [],
    ignored: [],
    relaxed: [],
  };
  const matchedTokens = new Set<string>();

  // Negations first: "no black", "avoid leather", "anything but white".
  const negated = new Set<string>();
  const negationSpans: Array<[number, number]> = [];
  const negRe =
    /\b(?:no|not|never|avoid|without|except|sans|but)\s+([a-z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = negRe.exec(text)) !== null) {
    const word = m[1] as string;
    if (COLOR_WORDS.includes(word)) {
      reading.avoidColors.push(word);
      negated.add(word);
      negationSpans.push([m.index, m.index + m[0].length]);
    } else if (FABRIC_WORDS.includes(word)) {
      reading.avoidFabrics.push(word);
      negated.add(word);
      negationSpans.push([m.index, m.index + m[0].length]);
    }
  }
  const inNegation = (idx: number) =>
    negationSpans.some(([a, b]) => idx >= a && idx < b);

  // Phrases before single words ("quiet luxury", "black tie").
  for (const [phrase, occasion] of OCCASION_WORDS) {
    if (!phrase.includes(" ")) continue;
    const idx = text.indexOf(` ${phrase} `);
    if (idx >= 0 && !inNegation(idx) && !reading.occasion) {
      reading.occasion = occasion;
      reading.used.push(`${phrase} → ${OCCASION_LABELS[occasion]}`);
      phrase.split(" ").forEach((t) => matchedTokens.add(t));
    }
  }
  for (const s of STYLE_PHRASES) {
    const idx = text.indexOf(` ${s.phrase} `);
    if (idx >= 0 && !inNegation(idx)) {
      if (s.harmony && !reading.harmony) reading.harmony = s.harmony;
      if (s.sophistication && !reading.sophistication) {
        reading.sophistication = s.sophistication;
      }
      reading.used.push(s.label);
      s.phrase.split(" ").forEach((t) => matchedTokens.add(t));
    }
  }

  // Single words. Event words outrank setting words for the occasion:
  // scan once collecting both, then let the strongest claim win.
  let strongOcc: [string, Occasion] | null = null;
  let weakOcc: [string, Occasion] | null = null;
  for (const token of tokensOf(text)) {
    const occ = OCCASION_WORDS.find(([w]) => w === token);
    if (occ && !occ[0].includes(" ")) {
      if (WEAK_OCCASION_WORDS.has(token)) {
        if (!weakOcc) weakOcc = occ;
      } else if (!strongOcc) {
        strongOcc = occ;
      }
    }
  }
  const occWin = strongOcc ?? weakOcc;
  if (occWin && !reading.occasion) {
    reading.occasion = occWin[1];
    reading.used.push(`${occWin[0]} → ${OCCASION_LABELS[occWin[1]]}`);
  }
  for (const token of tokensOf(text)) {
    if (negated.has(token)) {
      matchedTokens.add(token);
      continue;
    }
    const occ = OCCASION_WORDS.find(([w]) => w === token);
    if (occ && !occ[0].includes(" ")) {
      matchedTokens.add(token);
      continue;
    }
    const sea = SEASON_WORDS.find(([w]) => w === token);
    if (sea) {
      if (!reading.season) {
        reading.season = sea[1];
        reading.used.push(SEASON_LABELS[sea[1]]);
      }
      matchedTokens.add(token);
      continue;
    }
    const sty = STYLE_WORDS.find((s) => s.word === token);
    if (sty) {
      if (sty.harmony && !reading.harmony) reading.harmony = sty.harmony;
      if (sty.sophistication && !reading.sophistication) {
        reading.sophistication = sty.sophistication;
      }
      if (!reading.used.includes(sty.label)) reading.used.push(sty.label);
      matchedTokens.add(token);
      continue;
    }
    if (COLOR_WORDS.includes(token)) {
      if (!reading.wantColors.includes(token)) reading.wantColors.push(token);
      matchedTokens.add(token);
      continue;
    }
    if (FABRIC_WORDS.includes(token)) {
      if (!reading.wantFabrics.includes(token)) reading.wantFabrics.push(token);
      matchedTokens.add(token);
      continue;
    }
  }
  for (const c of reading.wantColors) reading.used.push(c);
  for (const f of reading.wantFabrics) reading.used.push(f);
  for (const c of reading.avoidColors) reading.used.push(`no ${c}`);
  for (const f of reading.avoidFabrics) reading.used.push(`no ${f}`);

  // Honest leftovers: meaningful words the reader does not know.
  for (const token of tokensOf(text)) {
    if (
      token.length >= 3 &&
      !matchedTokens.has(token) &&
      !STOPWORDS.has(token) &&
      !reading.ignored.includes(token)
    ) {
      reading.ignored.push(token);
    }
  }
  reading.ignored = reading.ignored.slice(0, 8);

  // Dials win where they are set; the brief fills what the dials leave open
  // and may name the occasion/season outright.
  const opts: GenerateOpts = {
    ...base,
    occasion: reading.occasion ?? base.occasion,
    season: reading.season ?? base.season,
    sophistication:
      base.sophistication && base.sophistication !== "any"
        ? base.sophistication
        : (reading.sophistication ?? base.sophistication),
    harmony:
      base.harmony && base.harmony !== "any"
        ? base.harmony
        : (reading.harmony ?? base.harmony),
  };

  const hardOk = (look: Look) =>
    reading.avoidColors.every((c) => !lookHasWord(look, c)) &&
    reading.avoidFabrics.every((f) => !lookHasWord(look, f));
  const score = (look: Look) =>
    reading.wantColors.filter((c) => lookHasWord(look, c)).length * 3 +
    reading.wantFabrics.filter((f) => lookHasWord(look, f)).length * 3;
  const maxScore =
    (reading.wantColors.length + reading.wantFabrics.length) * 3;

  const seedBase = Date.now() % 1_000_000_000;
  let best: Look | null = null;
  let bestScore = -1;
  for (let i = 0; i < 300 && bestScore < maxScore; i++) {
    const candidate = generateLook(opts, seedBase + i * 7919);
    if (!hardOk(candidate)) continue;
    const s = score(candidate);
    if (s > bestScore) {
      best = candidate;
      bestScore = s;
    }
  }
  if (!best) {
    // No look could honor every exclusion: take the least-violating one
    // and say so, instead of dressing nothing.
    let bestViolations = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 300; i++) {
      const candidate = generateLook(opts, seedBase + i * 7919);
      const violations =
        reading.avoidColors.filter((c) => lookHasWord(candidate, c)).length +
        reading.avoidFabrics.filter((f) => lookHasWord(candidate, f)).length;
      const s = score(candidate) - violations * 10;
      if (violations < bestViolations || (violations === bestViolations && s > bestScore)) {
        best = candidate;
        bestViolations = violations;
        bestScore = s;
      }
    }
    for (const c of reading.avoidColors) {
      if (best && lookHasWord(best, c)) reading.relaxed.push(`no ${c}`);
    }
    for (const f of reading.avoidFabrics) {
      if (best && lookHasWord(best, f)) reading.relaxed.push(`no ${f}`);
    }
  }

  const look: Look = { ...(best as Look), source: "studio" };
  return { look, reading };
}
