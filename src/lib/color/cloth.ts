import type { Harmony, Undertone } from "./types";

export type ClothFamily =
  | "navy"
  | "grey"
  | "earth"
  | "green"
  | "red"
  | "light"
  | "black"
  | "blue"
  | "purple";

export type Cloth = {
  hex: string;
  name: string;
  undertone: Undertone;
  family: ClothFamily;
};

export const CLOTHS: Cloth[] = [
  ["#1b2a4a", "Midnight navy", "cool", "navy"],
  ["#1a2744", "Deep navy", "cool", "navy"],
  ["#243656", "Marine", "cool", "navy"],
  ["#2a3c58", "Indigo navy", "cool", "navy"],
  ["#3a4d73", "Mid navy", "cool", "navy"],
  ["#1e3358", "Harbor navy", "cool", "navy"],
  ["#0f1c33", "Ink navy", "cool", "navy"],
  ["#2e3034", "Charcoal", "cool", "grey"],
  ["#3c4046", "Flannel grey", "cool", "grey"],
  ["#4a4e54", "Mid charcoal", "cool", "grey"],
  ["#6d7178", "Oxford grey", "cool", "grey"],
  ["#8a9098", "Morning grey", "cool", "grey"],
  ["#4d5a66", "Slate", "cool", "grey"],
  ["#4a5560", "Urban slate", "cool", "grey"],
  ["#2a3036", "Graphite", "cool", "grey"],
  ["#1c1e22", "Near-black grey", "cool", "grey"],
  ["#c4a574", "Camel", "warm", "earth"],
  ["#c2a06c", "Warm camel", "warm", "earth"],
  ["#c4a882", "Tan", "warm", "earth"],
  ["#b8a074", "Khaki", "warm", "earth"],
  ["#cbb089", "Sand", "warm", "earth"],
  ["#d8cbb4", "Beach sand", "warm", "earth"],
  ["#d7c089", "Wheat", "warm", "earth"],
  ["#b7aa96", "Putty", "warm", "earth"],
  ["#8a7a66", "Taupe", "warm", "earth"],
  ["#6a5a48", "Dust taupe", "warm", "earth"],
  ["#5a3e30", "Cocoa", "warm", "earth"],
  ["#4a3428", "Chocolate", "warm", "earth"],
  ["#2a1c16", "Espresso", "warm", "earth"],
  ["#3e2a1e", "Umber", "warm", "earth"],
  ["#8a4a2c", "Cognac", "warm", "earth"],
  ["#6b3a2a", "Dark cognac", "warm", "earth"],
  ["#8a5a38", "Tobacco", "warm", "earth"],
  ["#5a3a22", "Dark brown", "warm", "earth"],
  ["#6e4a32", "Saddle", "warm", "earth"],
  ["#2d4334", "Forest", "warm", "green"],
  ["#1e3a30", "Evergreen", "cool", "green"],
  ["#1c3a32", "Bottle green", "cool", "green"],
  ["#5c6844", "Olive", "warm", "green"],
  ["#4a5238", "Loden", "warm", "green"],
  ["#6a6840", "Field olive", "warm", "green"],
  ["#3a4a38", "Deep olive", "warm", "green"],
  ["#8a9a86", "Sage", "cool", "green"],
  ["#9aa890", "Gallery sage", "cool", "green"],
  ["#a8c0b4", "Celadon", "cool", "green"],
  ["#4d5a4c", "Dried herb", "cool", "green"],
  ["#163a42", "Deep teal", "cool", "green"],
  ["#1f4a4e", "Dark teal", "cool", "green"],
  ["#6e2430", "Oxblood", "warm", "red"],
  ["#5a2430", "Burgundy", "warm", "red"],
  ["#4a1420", "Bordeaux", "warm", "red"],
  ["#7a2e32", "Wine", "warm", "red"],
  ["#8a3a40", "Light wine", "warm", "red"],
  ["#9c2b2b", "Signal red", "warm", "red"],
  ["#b45a38", "Rust", "warm", "red"],
  ["#c46a48", "Terracotta", "warm", "red"],
  ["#c45c38", "Persimmon", "warm", "red"],
  ["#9a4a2c", "Burnt rust", "warm", "red"],
  ["#6a3434", "Rosewood", "warm", "red"],
  ["#6a2848", "Berry", "cool", "red"],
  ["#b48484", "Dried rose", "warm", "red"],
  ["#d4b4aa", "Dusty rose", "warm", "red"],
  ["#d8b8c4", "Powder pink", "cool", "red"],
  ["#efe6d6", "Ivory", "warm", "light"],
  ["#eadcc6", "Cream", "warm", "light"],
  ["#e8dfd0", "Warm ivory", "warm", "light"],
  ["#ece3d4", "Column ivory", "warm", "light"],
  ["#f4f1ea", "Porcelain", "neutral", "light"],
  ["#f4ead4", "Pale wheat", "warm", "light"],
  ["#e8e0d4", "Bone", "warm", "light"],
  ["#e7ddd0", "Calico", "warm", "light"],
  ["#d8d4cc", "Fog ivory", "cool", "light"],
  ["#c5d0d8", "Ice", "cool", "light"],
  ["#c8d4e0", "Powder blue", "cool", "light"],
  ["#c5d4e0", "Ice blue", "cool", "light"],
  ["#b9c7d6", "Pale blue", "cool", "light"],
  ["#d8c4a0", "Champagne", "warm", "light"],
  ["#d8c4b0", "Nude", "warm", "light"],
  ["#c4c4c6", "Silver", "cool", "light"],
  ["#111111", "Ink black", "cool", "black"],
  ["#0e0e10", "Tuxedo black", "cool", "black"],
  ["#141414", "Soft black", "neutral", "black"],
  ["#1a1a1c", "Near black", "cool", "black"],
  ["#1c1a18", "Warm black", "warm", "black"],
  ["#1e3a8a", "Cobalt", "cool", "blue"],
  ["#8a96a4", "Pale grey-blue", "cool", "blue"],
  ["#6e8aaa", "Steel blue", "cool", "blue"],
  ["#3d4f6e", "Faded navy", "cool", "blue"],
  ["#3a2438", "Aubergine", "cool", "purple"],
  ["#4a2438", "Deep aubergine", "cool", "purple"],
  ["#2a1c28", "Black-plum", "cool", "purple"],
  ["#9aaa4a", "Muted chartreuse", "warm", "green"],
  ["#c48a28", "Saffron", "warm", "earth"],
  ["#b08a4a", "Antique gold", "warm", "earth"],
  ["#a08060", "Dust camel", "warm", "earth"],
  ["#7a5a4a", "Cocoa rose", "warm", "earth"],
  ["#5a3c28", "Bark", "warm", "earth"],
  ["#2c3d56", "Denim indigo", "cool", "navy"],
  ["#1a1c1f", "Coat black", "cool", "black"],
].map(([hex, name, undertone, family]) => ({
  hex,
  name,
  undertone: undertone as Undertone,
  family: family as ClothFamily,
}));

const FAMILY_HARMONY: Record<ClothFamily, Harmony[]> = {
  navy: ["tonal", "analogous", "sartorial", "complementary", "neutral-accent", "high-contrast", "quiet-luxury"],
  grey: ["tonal", "low-contrast", "sartorial", "quiet-luxury", "neutral-accent", "monochrome", "analogous"],
  earth: ["analogous", "earth-jewel", "sartorial", "tonal", "quiet-luxury", "unexpected", "low-contrast"],
  green: ["earth-jewel", "analogous", "unexpected", "tonal", "sartorial", "split-complement"],
  red: ["tonal", "complementary", "sartorial", "unexpected", "earth-jewel", "neutral-accent"],
  light: ["quiet-luxury", "high-contrast", "tonal", "analogous", "low-contrast", "sartorial"],
  black: ["monochrome", "high-contrast", "sartorial", "quiet-luxury", "tonal"],
  blue: ["analogous", "complementary", "sartorial", "tonal", "high-contrast"],
  purple: ["sartorial", "unexpected", "tonal", "analogous", "monochrome"],
};

export function harmoniesFor(cloth: Cloth): Harmony[] {
  return FAMILY_HARMONY[cloth.family];
}
