/**
 * The three-drape diagnosis (1.2). A short road to the personal season on
 * the SciART dimensions — temperature, then family, then the trait that
 * leads (value or chroma) — using the key drapes: gold and silver for
 * temperature; Winter black / Spring gold / Summer silver / Autumn brown
 * for family. The swatches are the app's own study colors, chosen to sit
 * where each season lives; the purchased fan transcription (see
 * COLOR-FOUNDATION.md) will deepen the palettes, not this logic.
 */
import type { PersonalSeason } from "./types";

export type Family = "spring" | "summer" | "autumn" | "winter";
export type Temperature = "warm" | "cool";

export type DrapeOption = {
  id: string;
  label: string;
  hint: string;
  /** One hex, or two for a split drape. Rendered as a gradient. */
  hexes: [string] | [string, string];
};

export const METAL_DRAPES: Array<DrapeOption & { temp: Temperature }> = [
  {
    id: "gold",
    temp: "warm",
    label: "Gold",
    hint: "Warm metal against the face",
    hexes: ["#8A6A2F", "#E6C877"],
  },
  {
    id: "silver",
    temp: "cool",
    label: "Silver",
    hint: "Cool metal against the face",
    hexes: ["#7E8894", "#D7DCE1"],
  },
];

export const KEY_DRAPES: Record<Temperature, Array<DrapeOption & { family: Family }>> = {
  warm: [
    {
      id: "spring-gold",
      family: "spring",
      label: "Bright gold",
      hint: "Clear, light, warm — the spring drape",
      hexes: ["#C99700", "#F2C94C"],
    },
    {
      id: "autumn-brown",
      family: "autumn",
      label: "Deep brown",
      hint: "Earthy, deep, warm — the autumn drape",
      hexes: ["#4A2E1F", "#7A4A2B"],
    },
  ],
  cool: [
    {
      id: "winter-black",
      family: "winter",
      label: "True black",
      hint: "Deep, clear, cool — the winter drape",
      hexes: ["#050507", "#26262B"],
    },
    {
      id: "summer-silver",
      family: "summer",
      label: "Soft silver",
      hint: "Muted, light, cool — the summer drape",
      hexes: ["#A7B0B8", "#CBD2D8"],
    },
  ],
};

export const LEAD_DRAPES: Record<Family, Array<DrapeOption & { season: PersonalSeason }>> = {
  spring: [
    { id: "light", season: "light-spring", label: "Pale ivory", hint: "Light leads", hexes: ["#F3DFC0"] },
    { id: "true", season: "true-spring", label: "Clear camel-gold", hint: "Warmth leads", hexes: ["#C68F3D"] },
    { id: "bright", season: "bright-spring", label: "Vivid coral", hint: "Brightness leads", hexes: ["#E4572E"] },
  ],
  summer: [
    { id: "light", season: "light-summer", label: "Powder blue", hint: "Light leads", hexes: ["#B9C6D4"] },
    { id: "true", season: "true-summer", label: "Cool rose", hint: "Coolness leads", hexes: ["#8E6E7E"] },
    { id: "soft", season: "soft-summer", label: "Dusty sage", hint: "Softness leads", hexes: ["#9AA48F"] },
  ],
  autumn: [
    { id: "soft", season: "soft-autumn", label: "Muted olive", hint: "Softness leads", hexes: ["#8A7B52"] },
    { id: "true", season: "true-autumn", label: "Rich rust", hint: "Warmth leads", hexes: ["#A44A24"] },
    { id: "dark", season: "dark-autumn", label: "Espresso", hint: "Depth leads", hexes: ["#33200F", "#54371E"] },
  ],
  winter: [
    { id: "dark", season: "dark-winter", label: "Black plum", hint: "Depth leads", hexes: ["#17101F"] },
    { id: "true", season: "true-winter", label: "Black on icy white", hint: "Contrast leads", hexes: ["#0B0B0C", "#EDF1F5"] },
    { id: "bright", season: "bright-winter", label: "Cobalt", hint: "Brightness leads", hexes: ["#2743C7"] },
  ],
};

export const DRAPE_STEP_TITLES = [
  "Drape 1 of 3 — Temperature",
  "Drape 2 of 3 — Family",
  "Drape 3 of 3 — The trait that leads",
] as const;

export const DRAPE_STEP_PROMPTS = [
  "Gold or silver: which metal makes your skin look clearer?",
  "Which of these two sits more at home against your face?",
  "Last: which drape looks like it belongs to you?",
] as const;
