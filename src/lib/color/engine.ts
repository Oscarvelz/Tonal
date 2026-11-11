import { CLOTHS, harmoniesFor } from "./cloth";
import {
  complementary,
  fashionize,
  hexToHsl,
  mixHex,
  nameFromHue,
  rotateHue,
  setLightness,
  setSaturation,
  splitComplement,
  triadic,
} from "./convert";
import { calendarSeason, pick, wardrobeFor } from "./garments";
import { deltaE, paletteSeasons } from "./munsell";
import { PALETTES } from "./palettes";
import { RULES, WEARER_CONTRAST, rulesForLook, type WearerContrast } from "./rules";
import { STRATEGIES, strategiesMatching, type Strategy } from "./strategies";
import type {
  BottomKind,
  Gender,
  Harmony,
  LayerKind,
  Look,
  Occasion,
  OwnedColor,
  OwnedColors,
  Palette,
  PaletteColors,
  PersonalSeason,
  Piece,
  Season,
  Sophistication,
  Swatch,
  Undertone,
} from "./types";
import { HARMONIES, HARMONY_LABEL } from "./types";

export type GenerateOpts = {
  gender: Gender;
  occasion: Occasion;
  season?: Season;
  sophistication?: Sophistication | "any";
  harmony?: Harmony | "any";
  personalSeason?: PersonalSeason | "any";
  /** From the ten-second face-contrast check; wins over the season table. */
  wearerContrast?: WearerContrast | "any";
  /**
   * Dress-from-my-closet: when non-empty, a palette is legal only if its
   * 60% and 30% both sit within ΔE 26 of a hex the wearer already owns.
   */
  closetHexes?: string[];
  /**
   * Colors the wearer declared they own (You → Wardrobe). For each slot
   * with a non-empty list, the composed piece is re-dressed in the owned
   * color nearest its intended hex — nobody owns shoes in every color.
   */
  owned?: Partial<OwnedColors>;
  avoidIds?: string[];
  paletteId?: string;
};

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickWeighted<T>(items: T[], weights: number[], rand: () => number): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] ?? 0;
    if (r <= 0) return items[i] as T;
  }
  return items[items.length - 1] as T;
}

export function paletteMatches(p: Palette, opts: GenerateOpts): boolean {
  if (!p.genders.includes(opts.gender)) return false;
  if (!p.occasions.includes(opts.occasion)) return false;
  if (
    opts.season &&
    opts.season !== "all" &&
    p.season !== "all" &&
    p.season !== opts.season
  ) {
    return false;
  }
  if (
    opts.sophistication &&
    opts.sophistication !== "any" &&
    p.sophistication !== opts.sophistication
  ) {
    return false;
  }
  if (opts.harmony && opts.harmony !== "any" && p.harmony !== opts.harmony) {
    return false;
  }
  if (
    opts.personalSeason &&
    opts.personalSeason !== "any" &&
    !paletteSeasons(p).includes(opts.personalSeason)
  ) {
    return false;
  }
  if (opts.closetHexes && opts.closetHexes.length > 0) {
    const owned = (hex: string) =>
      opts.closetHexes!.some((ownedHex) => deltaE(hex, ownedHex) <= 26);
    if (!owned(p.colors.dominant.hex) || !owned(p.colors.secondary.hex)) {
      return false;
    }
  }
  return true;
}

function swatch(hex: string, role: string): Swatch {
  return { hex, name: titleCase(nameFromHue(hex)), role };
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function lightOf(hex: string) {
  return hexToHsl(hex).l;
}

function isLight(hex: string) {
  return lightOf(hex) > 0.72;
}

function chooseHarmony(
  opts: GenerateOpts,
  rand: () => number,
  sophistication: Sophistication,
): Harmony {
  if (opts.harmony && opts.harmony !== "any") return opts.harmony;
  const weights: Record<Harmony, number> = {
    tonal: 14,
    analogous: 12,
    "quiet-luxury": 12,
    sartorial: 13,
    "neutral-accent": 10,
    "earth-jewel": 8,
    complementary: 7,
    "high-contrast": 6,
    monochrome: 5,
    unexpected: 6,
    "split-complement": 4,
    triadic: 3,
    "low-contrast": 5,
  };
  if (sophistication === "avant-garde") {
    weights.unexpected = 16;
    weights["split-complement"] = 10;
    weights.triadic = 8;
    weights.complementary = 10;
    weights["quiet-luxury"] = 4;
  }
  if (sophistication === "sartorial") {
    weights.sartorial = 18;
    weights.tonal = 16;
    weights["quiet-luxury"] = 14;
    weights.unexpected = 2;
    weights.triadic = 1;
  }
  if (sophistication === "everyday") {
    weights.analogous = 16;
    weights["neutral-accent"] = 14;
    weights.complementary = 10;
    weights["quiet-luxury"] = 6;
  }
  if (opts.occasion === "formal") {
    weights.monochrome = 22;
    weights["high-contrast"] = 16;
    weights.tonal = 10;
    weights.unexpected = 1;
    weights.triadic = 0;
  }
  return pickWeighted([...HARMONIES], HARMONIES.map((h) => weights[h]), rand);
}

function buildHarmonyColors(seed: string, harmony: Harmony, rand: () => number): PaletteColors {
  const s = fashionize(seed);
  const light = setSaturation(setLightness(s, 0.86 + rand() * 0.06), 0.08 + rand() * 0.1);
  const dark = setLightness(s, 0.12 + rand() * 0.08);
  const mid = setLightness(s, 0.38 + rand() * 0.16);

  switch (harmony) {
    case "tonal": {
      const a = setLightness(s, 0.22 + rand() * 0.1);
      const b = setLightness(s, 0.48 + rand() * 0.12);
      const c = setLightness(setSaturation(s, 0.28), 0.18);
      return {
        dominant: swatch(a, "architecture"),
        secondary: swatch(isLight(b) ? light : b, "knit or shirt"),
        accent: swatch(c, "shoe"),
        optional: swatch(light, "collar"),
      };
    }
    case "monochrome":
      return {
        dominant: swatch(setLightness("#1a1a1c", 0.08 + rand() * 0.04), "cloth"),
        secondary: swatch("#3a3a3c", "knit"),
        accent: swatch("#c4c4c6", "metal"),
        optional: swatch("#f4f1ea", "shirt"),
      };
    case "analogous": {
      const [left, right] = [rotateHue(s, -26), rotateHue(s, 28)].map(fashionize);
      return {
        dominant: swatch(s, "cloth"),
        secondary: swatch(setLightness(left, 0.62), "top"),
        accent: swatch(setLightness(right, 0.28), "shoe"),
        optional: swatch(light, "base"),
      };
    }
    case "complementary": {
      const opp = fashionize(complementary(s));
      return {
        dominant: swatch(setLightness(s, 0.22), "architecture"),
        secondary: swatch(setSaturation(opp, 0.38), "knit"),
        accent: swatch(light, "shirt"),
        optional: swatch(setLightness(opp, 0.22), "shoe"),
      };
    }
    case "split-complement": {
      const [a, b] = splitComplement(s).map(fashionize);
      return {
        dominant: swatch(setLightness(s, 0.2), "coat"),
        secondary: swatch(setSaturation(a, 0.36), "trouser"),
        accent: swatch(setLightness(b, 0.72), "shirt"),
        optional: swatch(dark, "shoe"),
      };
    }
    case "triadic": {
      const [a, b] = triadic(s).map((h) => setSaturation(fashionize(h), 0.28));
      return {
        dominant: swatch(setLightness(s, 0.24), "architecture"),
        secondary: swatch(a, "knit"),
        accent: swatch(setLightness(b, 0.32), "shoe"),
        optional: swatch(light, "shirt"),
      };
    }
    case "neutral-accent": {
      const grey = setSaturation(s, 0.04);
      return {
        dominant: swatch(setLightness(grey, 0.32), "trouser"),
        secondary: swatch("#efeae2", "shirt"),
        accent: swatch(setSaturation(s, 0.4), "pulse"),
        optional: swatch(setLightness(grey, 0.14), "coat"),
      };
    }
    case "high-contrast":
      return {
        dominant: swatch(rand() > 0.5 ? light : dark, "column"),
        secondary: swatch(rand() > 0.5 ? dark : light, "counter"),
        accent: swatch(mid, "belt"),
        optional: swatch("#c4a882", "shoe"),
      };
    case "low-contrast": {
      const a = setLightness(s, 0.58);
      const b = setLightness(s, 0.7);
      return {
        dominant: swatch(a, "trouser"),
        secondary: swatch(b, "knit"),
        accent: swatch(setLightness(s, 0.28), "shoe"),
        optional: swatch(light, "shirt"),
      };
    }
    case "earth-jewel": {
      const earth = fashionize(rotateHue(s, 20));
      const jewel = setSaturation(s, 0.42);
      return {
        dominant: swatch(setLightness(jewel, 0.22), "coat"),
        secondary: swatch(setLightness(earth, 0.62), "trouser"),
        accent: swatch(setLightness(earth, 0.38), "knit"),
        optional: swatch(light, "base"),
      };
    }
    case "sartorial":
      return {
        dominant: swatch(rand() > 0.5 ? "#1b2a4a" : "#2e3034", "architecture"),
        secondary: swatch(rand() > 0.5 ? "#c4a574" : "#d8d4cc", "knit or shirt"),
        accent: swatch("#8a4a2c", "shoe"),
        optional: swatch("#efe6d6", "collar"),
      };
    case "quiet-luxury": {
      const putty = setSaturation(setLightness(s, 0.68), 0.1);
      return {
        dominant: swatch(putty, "trouser"),
        secondary: swatch(setLightness(putty, 0.82), "knit"),
        accent: swatch(setLightness(s, 0.16), "shoe"),
        optional: swatch(setLightness(putty, 0.52), "belt"),
      };
    }
    case "unexpected": {
      const odd = fashionize(rotateHue(s, 110 + rand() * 40));
      return {
        dominant: swatch(setLightness(s, 0.18), "architecture"),
        secondary: swatch(setSaturation(odd, 0.34), "knit"),
        accent: swatch(light, "shirt"),
        optional: swatch(setLightness(odd, 0.22), "shoe"),
      };
    }
  }
}

function moodFor(harmony: Harmony, season: Season) {
  const map: Record<Harmony, string> = {
    tonal: "One hue, many cloths",
    monochrome: "After dark, texture only",
    analogous: "Neighbors on the wheel",
    complementary: "Opposites, buffered",
    "split-complement": "A painter's chord",
    triadic: "Three points, two muted",
    "neutral-accent": "Stone, then a pulse",
    "high-contrast": "Silhouette first",
    "low-contrast": "Quiet on purpose",
    "earth-jewel": "Dirt and a gem",
    sartorial: "Tailoring grammar",
    "quiet-luxury": "Chroma refusal",
    unexpected: "Wrong, then right",
  };
  return `${map[harmony]} · ${season}`;
}

function theoryFor(harmony: Harmony, colors: PaletteColors) {
  return `${titleCase(harmony)} dressing: ${colors.dominant.name} holds 60%, ${colors.secondary.name} is 30%, ${colors.accent.name} is the 10% that keeps the eye moving. Fashion chroma is held down so the chord reads as cloth, not a flag.`;
}

function wearFor(colors: PaletteColors, occasion: Occasion) {
  return `Wear ${colors.dominant.name} as the largest field, ${colors.secondary.name} as the second cloth, ${colors.accent.name} only at the foot or in one object. Keep the rest inside this chord — ${occasion} does not need a fourth story.`;
}

function seasonForFamily(family: (typeof CLOTHS)[number]["family"]): Season {
  switch (family) {
    case "earth":
    case "red":
      return "autumn";
    case "green":
      return "autumn";
    case "light":
      return "summer";
    case "black":
      return "winter";
    case "blue":
      return "summer";
    default:
      return "all";
  }
}

function sophisticationFor(harmony: Harmony): Sophistication {
  if (harmony === "sartorial" || harmony === "quiet-luxury") return "sartorial";
  if (harmony === "unexpected" || harmony === "triadic" || harmony === "split-complement") {
    return "avant-garde";
  }
  if (harmony === "analogous" || harmony === "neutral-accent") return "everyday";
  return "refined";
}

function occasionsFor(harmony: Harmony): Occasion[] {
  switch (harmony) {
    case "monochrome":
      return ["elegant", "formal"];
    case "high-contrast":
      return ["casual", "elegant", "formal", "smart-casual"];
    case "sartorial":
    case "quiet-luxury":
      return ["smart-casual", "elegant"];
    case "unexpected":
    case "triadic":
    case "split-complement":
      return ["elegant", "smart-casual", "casual"];
    default:
      return ["casual", "smart-casual", "elegant"];
  }
}

function paletteFromCloth(cloth: (typeof CLOTHS)[number], harmony: Harmony): Palette {
  const rand = mulberry32(hashSeed(`${cloth.hex}:${harmony}`));
  const colors = buildHarmonyColors(cloth.hex, harmony, rand);
  const season = seasonForFamily(cloth.family);
  const occ = occasionsFor(harmony);
  return {
    id: `gen-${cloth.hex.slice(1)}-${harmony}`,
    name: `${cloth.name} ${HARMONY_LABEL[harmony]}`,
    harmony,
    occasions: occ,
    genders: ["men", "women"],
    season,
    sophistication: sophisticationFor(harmony),
    mood: moodFor(harmony, season),
    undertone: cloth.undertone,
    anchor: hexToHsl(cloth.hex).l > 0.55 ? "bottom" : "layer",
    colors,
    theory: theoryFor(harmony, colors),
    wear: wearFor(colors, occ[0] ?? "smart-casual"),
  };
}

export const GENERATED: Palette[] = CLOTHS.flatMap((cloth) =>
  harmoniesFor(cloth).map((h) => paletteFromCloth(cloth, h)),
);

export const ALL_PALETTES: Palette[] = [...PALETTES, ...GENERATED];

export function palettesMatching(opts: GenerateOpts): Palette[] {
  const pools: Array<() => Palette[]> = [
    () => ALL_PALETTES.filter((p) => paletteMatches(p, opts)),
    () =>
      ALL_PALETTES.filter((p) =>
        paletteMatches(p, { ...opts, closetHexes: undefined }),
      ),
    () =>
      ALL_PALETTES.filter((p) =>
        paletteMatches(p, { ...opts, personalSeason: "any" }),
      ),
    () =>
      ALL_PALETTES.filter((p) =>
        paletteMatches(p, { ...opts, personalSeason: "any", harmony: "any" }),
      ),
    () =>
      ALL_PALETTES.filter((p) =>
        paletteMatches(p, {
          ...opts,
          personalSeason: "any",
          harmony: "any",
          sophistication: "any",
        }),
      ),
    () =>
      ALL_PALETTES.filter((p) =>
        paletteMatches(p, {
          ...opts,
          personalSeason: "any",
          harmony: "any",
          sophistication: "any",
          season: "all",
        }),
      ),
    () => ALL_PALETTES.filter((p) => p.genders.includes(opts.gender)),
    () => ALL_PALETTES,
  ];
  for (const next of pools) {
    const found = next();
    if (found.length) return found;
  }
  return ALL_PALETTES;
}

function proceduralPalette(opts: GenerateOpts, rand: () => number): Palette {
  const sophistication: Sophistication =
    opts.sophistication && opts.sophistication !== "any"
      ? opts.sophistication
      : pickWeighted(
          ["everyday", "refined", "sartorial", "avant-garde"] as Sophistication[],
          [2, 4, 5, 2],
          rand,
        );
  const harmony = chooseHarmony(opts, rand, sophistication);
  const cloth = pick(CLOTHS, rand);
  const colors = buildHarmonyColors(cloth.hex, harmony, rand);
  const undertone: Undertone = cloth.undertone;
  const season = opts.season && opts.season !== "all" ? opts.season : calendarSeason();
  return {
    id: `proc-${harmony}-${Math.floor(rand() * 1e6)}`,
    name: titleCase(`${cloth.name} ${harmony}`),
    harmony,
    occasions: [opts.occasion],
    genders: [opts.gender],
    season,
    sophistication,
    mood: moodFor(harmony, season),
    undertone,
    anchor: rand() > 0.45 ? "bottom" : "layer",
    colors,
    theory: theoryFor(harmony, colors),
    wear: wearFor(colors, opts.occasion),
  };
}

function chooseBottomKind(gender: Gender, occasion: Occasion, rand: () => number): BottomKind {
  if (gender === "men") return "pants";
  if (occasion === "formal") {
    return rand() > 0.4 ? "skirt" : rand() > 0.5 ? "wide" : "pants";
  }
  if (occasion === "elegant") return pickWeighted(["wide", "skirt", "pants"], [4, 3, 3], rand);
  return pickWeighted(["pants", "wide", "skirt"], [5, 3, 2], rand);
}

function layerKindFor(occasion: Occasion, skip: boolean, rand: () => number): LayerKind {
  if (skip) return "none";
  if (occasion === "formal") return pick(["coat", "blazer"], rand);
  if (occasion === "elegant") return pick(["coat", "blazer", "knit"], rand);
  if (occasion === "smart-casual") return pick(["blazer", "jacket", "knit"], rand);
  return pick(["jacket", "knit", "none"], rand);
}

function roleOf(s: Swatch | undefined, re: RegExp) {
  return Boolean(s && re.test(s.role.toLowerCase()));
}

function pickStrategy(opts: GenerateOpts, rand: () => number): Strategy | undefined {
  const pool = strategiesMatching({
    gender: opts.gender,
    occasion: opts.occasion,
    sophistication: opts.sophistication,
  });
  if (!pool.length) return undefined;
  if (opts.harmony && opts.harmony !== "any") {
    const aligned = pool.filter((s) => s.preferHarmony.includes(opts.harmony as Harmony));
    if (aligned.length) return pick(aligned, rand);
  }
  return pick(pool, rand);
}

function lookFromPalette(
  palette: Palette,
  opts: GenerateOpts,
  rand: () => number,
  source: Look["source"],
  strategy?: Strategy,
): Look {
  const w = wardrobeFor(opts.gender, opts.occasion);
  const { dominant, secondary, accent, optional } = palette.colors;
  const all = [dominant, secondary, accent, optional].filter(Boolean) as Swatch[];
  /**
   * The pulse: the palette's loud swatch, if it has one — a non-dominant
   * swatch far more saturated than the dominant. The pulse belongs on the
   * small surfaces (shoes, accessory). It must never dress a major garment
   * the chord does not count: ratioParts reads the chord as layer/top/
   * shoes, so a pulse on the trousers inverts the look while the chord
   * goes on promising restraint (the Oxblood Grey case, 2.1).
   */
  const satOf = (s: Swatch) => hexToHsl(s.hex).s;
  const pulse = [secondary, accent, optional]
    .filter((s): s is Swatch => Boolean(s))
    .filter((s) => satOf(s) >= 0.4 && satOf(s) - satOf(dominant) >= 0.2)
    .sort((a, b) => satOf(b) - satOf(a))[0] as Swatch | undefined;
  const majorSafe = (s: Swatch | undefined): s is Swatch => Boolean(s) && s !== pulse;
  const lightCandidate = all.find((c) => isLight(c.hex));
  const light: Swatch = lightCandidate ?? {
    hex: mixHex("#f4f1ea", dominant.hex, 0.08),
    name: "Ivory",
    role: "shirt",
  };
  const skipLayer = strategy?.skipLayer
    ? true
    : opts.occasion === "casual" && (opts.season === "summer" || calendarSeason() === "summer")
      ? rand() > 0.45
      : rand() > 0.82;
  const layerKind = layerKindFor(opts.occasion, skipLayer, rand);
  const bottomKind = chooseBottomKind(opts.gender, opts.occasion, rand);
  const anchor = skipLayer ? "bottom" : (strategy?.anchor ?? palette.anchor);

  const footSwatch =
    all.find((s) => roleOf(s, /shoe|boot|loafer|sneaker|pump|sandal/)) ??
    (roleOf(accent, /jewel|hardware|metal|lip|earring/)
      ? all.find((s) => lightOf(s.hex) < 0.22 && s !== light) ?? dominant
      : accent);

  let layer: Piece | undefined;
  let top: Piece;
  let bottom: Piece;
  let shoes: Piece = {
    hex: footSwatch.hex,
    colorName: footSwatch.name,
    garment: pick(w.shoes, rand),
  };

  if (anchor === "layer" && layerKind !== "none") {
    layer = {
      hex: dominant.hex,
      colorName: dominant.name,
      garment: pick(w.layers, rand),
    };
    if (lightOf(secondary.hex) > 0.62) {
      top = {
        hex: secondary.hex,
        colorName: secondary.name,
        garment: pick(w.tops, rand),
      };
      bottom = {
        hex: majorSafe(optional) && lightOf(optional.hex) < 0.5 ? optional.hex : setLightness(dominant.hex, 0.22),
        colorName: majorSafe(optional) && lightOf(optional.hex) < 0.5 ? optional.name : "Deep " + dominant.name,
        garment: pick(w.bottoms, rand),
      };
    } else {
      bottom = majorSafe(secondary)
        ? {
            hex: secondary.hex,
            colorName: secondary.name,
            garment: pick(w.bottoms, rand),
          }
        : {
            // The secondary is the pulse: it stays off the trousers.
            // The bottom joins the dominant's value ladder instead.
            hex: setLightness(dominant.hex, 0.22),
            colorName: "Deep " + dominant.name,
            garment: pick(w.bottoms, rand),
          };
      top = {
        hex: light.hex,
        colorName: light.name,
        garment: pick(w.tops, rand),
      };
    }
  } else {
    bottom = {
      hex: dominant.hex,
      colorName: dominant.name,
      garment: pick(w.bottoms, rand),
    };
    top = {
      hex: lightOf(secondary.hex) > 0.18 ? secondary.hex : light.hex,
      colorName: lightOf(secondary.hex) > 0.18 ? secondary.name : light.name,
      garment: pick(w.tops, rand),
    };
    if (layerKind !== "none") {
      const layerSwatch =
        majorSafe(optional) && !roleOf(optional, /shoe|boot|loafer|sneaker|pump|sandal/)
          ? optional
          : undefined;
      const layerHex = layerSwatch?.hex ?? setLightness(dominant.hex, 0.16);
      layer = {
        hex: layerHex,
        colorName: layerSwatch?.name ?? nameFromHue(layerHex),
        garment: pick(w.layers, rand),
      };
    }
  }

  if (opts.owned) {
    const snap = (piece: Piece, list?: OwnedColor[]): Piece => {
      if (!list || list.length === 0) return piece;
      let best = list[0] as OwnedColor;
      let bestD = Infinity;
      for (const c of list) {
        const d = deltaE(piece.hex, c.hex);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      return { ...piece, hex: best.hex, colorName: best.name };
    };
    if (layer) layer = snap(layer, opts.owned.layers);
    top = snap(top, opts.owned.tops);
    bottom = snap(bottom, opts.owned.bottoms);
    shoes = snap(shoes, opts.owned.shoes);
  }

  const jewelry = all.find((s) => roleOf(s, /jewel|hardware|metal|lip|earring/));
  const accessory: Piece | undefined =
    jewelry
      ? {
          hex: jewelry.hex,
          colorName: jewelry.name,
          garment: pick(w.accessories, rand),
        }
      : rand() > 0.28
        ? {
            hex: shoes.hex,
            colorName: shoes.colorName,
            garment: pick(w.accessories, rand),
          }
        : undefined;

  const rules = rulesForLook({
    occasion: opts.occasion,
    harmony: palette.harmony,
    sophistication: palette.sophistication,
    season: palette.season,
    personalSeason: opts.personalSeason,
    wearerContrast:
      opts.wearerContrast && opts.wearerContrast !== "any"
        ? opts.wearerContrast
        : undefined,
  });

  const contrast: WearerContrast | undefined =
    opts.wearerContrast && opts.wearerContrast !== "any"
      ? opts.wearerContrast
      : opts.personalSeason && opts.personalSeason !== "any"
        ? WEARER_CONTRAST[opts.personalSeason]
        : undefined;
  const tempClause =
    palette.undertone === "warm"
      ? "the cloth is warm"
      : palette.undertone === "cool"
        ? "the cloth is cool"
        : "the cloth stays neutral";
  const contrastClause =
    contrast === "high"
      ? "and your face takes the big value jump"
      : contrast === "low"
        ? "and the steps stay small, like your own contrast"
        : contrast === "medium"
          ? "and the value step is measured, like your own contrast"
          : undefined;
  const whyLine = `${palette.colors.dominant.name}, ${palette.colors.secondary.name}, ${palette.colors.accent.name} — ${tempClause}${contrastClause ? `, ${contrastClause}` : ""}.`;

  return {
    id: `look-${Math.floor(rand() * 1e9)}-${palette.id}`,
    name: palette.name,
    harmony: palette.harmony,
    occasion: opts.occasion,
    gender: opts.gender,
    season: palette.season,
    sophistication: palette.sophistication,
    mood: palette.mood,
    undertone: palette.undertone,
    theory: palette.theory,
    wear: palette.wear,
    whyLine,
    source,
    paletteId: palette.id,
    strategyId: strategy?.id,
    strategyName: strategy?.name,
    ruleTitles: rules.map((r) => r.title),
    pieces: { layer, top, bottom, shoes, accessory },
    bottomKind,
    layerKind,
    createdAt: Date.now(),
  };
}

export function generateLook(opts: GenerateOpts, seed?: number): Look {
  const rand = mulberry32(seed ?? (Date.now() ^ Math.floor(Math.random() * 1e9)));
  const strategy = pickStrategy(opts, rand);
  const harmonyFromStrategy: Harmony | "any" =
    opts.harmony && opts.harmony !== "any"
      ? opts.harmony
      : strategy && rand() < 0.72
        ? pick(strategy.preferHarmony, rand)
        : "any";
  const effective: GenerateOpts = { ...opts, harmony: harmonyFromStrategy };

  if (opts.paletteId) {
    const exact = ALL_PALETTES.find((p) => p.id === opts.paletteId);
    if (exact) {
      const source: Look["source"] = exact.id.startsWith("gen-") ? "engine" : "catalog";
      return lookFromPalette(exact, effective, rand, source, strategy);
    }
  }
  const catalog = palettesMatching(effective);
  const avoid = new Set(opts.avoidIds ?? []);
  const fresh = catalog.filter((p) => !avoid.has(p.id));
  const pool = fresh.length ? fresh : catalog;
  const useProcedural = !opts.paletteId && rand() < 0.3;
  let palette = useProcedural ? proceduralPalette(effective, rand) : (pick(pool, rand) as Palette);
  // A procedural chord must obey the same laws as the catalog: the season
  // regions and the closet-only rule bind it too.
  if (
    useProcedural &&
    pool.length > 0 &&
    ((effective.personalSeason && effective.personalSeason !== "any") ||
      (effective.closetHexes && effective.closetHexes.length > 0)) &&
    !paletteMatches(palette, effective)
  ) {
    palette = pick(pool, rand) as Palette;
  }
  const source: Look["source"] =
    useProcedural || palette.id.startsWith("gen-") || palette.id.startsWith("proc-")
      ? "engine"
      : "catalog";
  return lookFromPalette(palette, effective, rand, source, strategy);
}

export function dressingSteps(look: Look): string[] {
  const steps = [
    `Start with the ${look.pieces.bottom.colorName.toLowerCase()} ${look.pieces.bottom.garment}.`,
    `Add the ${look.pieces.top.colorName.toLowerCase()} ${look.pieces.top.garment}.`,
  ];
  if (look.pieces.layer && look.layerKind !== "none") {
    steps.push(`Layer the ${look.pieces.layer.colorName.toLowerCase()} ${look.pieces.layer.garment}.`);
  }
  steps.push(`Finish with ${look.pieces.shoes.colorName.toLowerCase()} ${look.pieces.shoes.garment}.`);
  if (look.pieces.accessory) {
    const acc = look.pieces.accessory;
    const hat = /hat/i.test(acc.garment);
    const sameAsShoe = acc.hex.toLowerCase() === look.pieces.shoes.hex.toLowerCase();
    if (hat && sameAsShoe) {
      steps.push(
        `Set the ${acc.colorName.toLowerCase()} ${acc.garment} — same leather as the boots.`,
      );
    } else if (hat) {
      steps.push(`Set the ${acc.colorName.toLowerCase()} ${acc.garment}.`);
    } else {
      steps.push(
        sameAsShoe
          ? `Match ${acc.colorName.toLowerCase()} ${acc.garment} to the shoes.`
          : `Add ${acc.colorName.toLowerCase()} ${acc.garment}.`,
      );
    }
  }
  return steps;
}

export function ratioParts(look: Look) {
  return [
    { key: "60", label: "60", piece: look.pieces.layer && look.layerKind !== "none" ? look.pieces.layer : look.pieces.bottom },
    { key: "30", label: "30", piece: look.pieces.top },
    { key: "10", label: "10", piece: look.pieces.shoes },
  ] as const;
}

export function lookSpace(opts: GenerateOpts): number {
  const palettes = palettesMatching(opts);
  const w = wardrobeFor(opts.gender, opts.occasion);
  return palettes.length * w.tops.length * w.bottoms.length * w.shoes.length * (w.layers.length + 1);
}

export function catalogStats() {
  return {
    cloths: CLOTHS.length,
    editorial: PALETTES.length,
    generated: GENERATED.length,
    palettes: ALL_PALETTES.length,
    strategies: STRATEGIES.length,
    rules: RULES.length,
  };
}

export function formatSpace(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const shown = m >= 10 ? String(Math.round(m)) : m.toFixed(1).replace(/\.0$/, "");
    return `${shown} million`;
  }
  if (n >= 10_000) return `${Math.round(n / 1000)} thousand`;
  return n.toLocaleString("en-US");
}
