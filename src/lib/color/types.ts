export const OCCASIONS = [
  "casual",
  "smart-casual",
  "elegant",
  "formal",
] as const;

export type Occasion = (typeof OCCASIONS)[number];

export const GENDERS = ["men", "women"] as const;
export type Gender = (typeof GENDERS)[number];

export const SEASONS = ["spring", "summer", "autumn", "winter", "all"] as const;
export type Season = (typeof SEASONS)[number];

export const HARMONIES = [
  "tonal",
  "monochrome",
  "analogous",
  "complementary",
  "split-complement",
  "triadic",
  "neutral-accent",
  "high-contrast",
  "low-contrast",
  "earth-jewel",
  "sartorial",
  "quiet-luxury",
  "unexpected",
] as const;
export type Harmony = (typeof HARMONIES)[number];

export const SOPHISTICATIONS = [
  "everyday",
  "refined",
  "sartorial",
  "avant-garde",
] as const;
export type Sophistication = (typeof SOPHISTICATIONS)[number];

export const PERSONAL_SEASONS = [
  "light-spring",
  "true-spring",
  "bright-spring",
  "light-summer",
  "true-summer",
  "soft-summer",
  "soft-autumn",
  "true-autumn",
  "dark-autumn",
  "dark-winter",
  "true-winter",
  "bright-winter",
] as const;
export type PersonalSeason = (typeof PERSONAL_SEASONS)[number];

export type Undertone = "warm" | "cool" | "neutral";

export type Swatch = {
  hex: string;
  name: string;
  role: string;
};

export type PaletteColors = {
  dominant: Swatch;
  secondary: Swatch;
  accent: Swatch;
  optional?: Swatch;
};

export type Palette = {
  id: string;
  name: string;
  harmony: Harmony;
  occasions: Occasion[];
  genders: Gender[];
  season: Season;
  sophistication: Sophistication;
  mood: string;
  undertone: Undertone;
  anchor: "layer" | "bottom";
  colors: PaletteColors;
  theory: string;
  wear: string;
};

export type BottomKind = "pants" | "skirt" | "wide" | "shorts" | "dress";
export type LayerKind = "coat" | "blazer" | "jacket" | "knit" | "vest" | "none";

export type Piece = {
  hex: string;
  colorName: string;
  garment: string;
};

/** A color the wearer actually owns, chosen in You → Wardrobe (2.1). */
export type OwnedColor = { hex: string; name: string };

/**
 * The wearer's declared colors per garment slot. An empty list means
 * "no constraint" — the generator invents as before. A non-empty list
 * means the piece is dressed from the nearest owned color instead.
 */
export type OwnedColors = {
  shoes: OwnedColor[];
  bottoms: OwnedColor[];
  layers: OwnedColor[];
  tops: OwnedColor[];
};

export type OwnedSlot = keyof OwnedColors;

export type Look = {
  id: string;
  name: string;
  harmony: Harmony;
  occasion: Occasion;
  gender: Gender;
  season: Season;
  sophistication: Sophistication;
  mood: string;
  undertone: Undertone;
  theory: string;
  wear: string;
  /** One line: the colors, then why — temperature and face contrast. */
  whyLine?: string;
  source: "catalog" | "engine" | "ai" | "studio";
  paletteId?: string;
  strategyId?: string;
  strategyName?: string;
  ruleTitles?: string[];
  pieces: {
    layer?: Piece;
    top: Piece;
    bottom: Piece;
    shoes: Piece;
    accessory?: Piece;
  };
  bottomKind: BottomKind;
  layerKind: LayerKind;
  createdAt: number;
};

export const OCCASION_LABEL: Record<Occasion, string> = {
  casual: "Casual",
  "smart-casual": "Smart casual",
  elegant: "Elegant",
  formal: "Formal",
};

export const HARMONY_LABEL: Record<Harmony, string> = {
  tonal: "Tonal",
  monochrome: "Monochrome",
  analogous: "Analogous",
  complementary: "Complementary",
  "split-complement": "Split complement",
  triadic: "Triadic",
  "neutral-accent": "Neutral + accent",
  "high-contrast": "High contrast",
  "low-contrast": "Low contrast",
  "earth-jewel": "Earth & jewel",
  sartorial: "Sartorial",
  "quiet-luxury": "Quiet luxury",
  unexpected: "Unexpected",
};

export const SOPHISTICATION_LABEL: Record<Sophistication, string> = {
  everyday: "Everyday",
  refined: "Refined",
  sartorial: "Sartorial",
  "avant-garde": "Avant-garde",
};

export const SEASON_LABEL: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  all: "Year-round",
};

export const PERSONAL_SEASON_LABEL: Record<PersonalSeason, string> = {
  "light-spring": "Light Spring",
  "true-spring": "True Spring",
  "bright-spring": "Bright Spring",
  "light-summer": "Light Summer",
  "true-summer": "True Summer",
  "soft-summer": "Soft Summer",
  "soft-autumn": "Soft Autumn",
  "true-autumn": "True Autumn",
  "dark-autumn": "Dark Autumn",
  "dark-winter": "Dark Winter",
  "true-winter": "True Winter",
  "bright-winter": "Bright Winter",
};

export const GENDER_LABEL: Record<Gender, string> = {
  men: "Men",
  women: "Women",
};
