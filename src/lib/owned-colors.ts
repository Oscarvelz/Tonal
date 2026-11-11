import type { OwnedColor, OwnedSlot } from "@/lib/color/types";

/**
 * The colors a real closet actually holds, per garment slot (2.1).
 * The wearer taps what they own in You → Wardrobe; the generator then
 * dresses that slot from the nearest of these instead of inventing a
 * color nobody owns — pink shoes being the canonical offence.
 *
 * The lists are deliberately short and realistic: the ten or so colors
 * a category genuinely comes in, named the way a person names them.
 */
export const OWNED_OPTIONS: Record<OwnedSlot, OwnedColor[]> = {
  shoes: [
    { hex: "#17181c", name: "Black" },
    { hex: "#3a2417", name: "Dark brown" },
    { hex: "#8a4b26", name: "Cognac" },
    { hex: "#b9834f", name: "Tan" },
    { hex: "#5e2129", name: "Oxblood" },
    { hex: "#232c3f", name: "Navy" },
    { hex: "#75767a", name: "Grey" },
    { hex: "#4c4a38", name: "Olive" },
    { hex: "#c8b294", name: "Sand suede" },
    { hex: "#f2f0eb", name: "White" },
  ],
  bottoms: [
    { hex: "#17181c", name: "Black" },
    { hex: "#43464c", name: "Charcoal" },
    { hex: "#7a7d82", name: "Mid grey" },
    { hex: "#1f2a44", name: "Navy" },
    { hex: "#2e4057", name: "Indigo denim" },
    { hex: "#4a3220", name: "Brown" },
    { hex: "#a68f66", name: "Khaki" },
    { hex: "#55543e", name: "Olive" },
    { hex: "#e6ddcb", name: "Cream" },
    { hex: "#f0eee8", name: "White" },
  ],
  layers: [
    { hex: "#17181c", name: "Black" },
    { hex: "#43464c", name: "Charcoal" },
    { hex: "#7a7d82", name: "Mid grey" },
    { hex: "#1f2a44", name: "Navy" },
    { hex: "#b28c58", name: "Camel" },
    { hex: "#4a3220", name: "Brown" },
    { hex: "#55543e", name: "Olive" },
    { hex: "#5e2129", name: "Burgundy" },
    { hex: "#2e4057", name: "Denim" },
    { hex: "#e6ddcb", name: "Cream" },
  ],
  tops: [
    { hex: "#f4f2ec", name: "White" },
    { hex: "#eae4d3", name: "Ivory" },
    { hex: "#a9c2d8", name: "Light blue" },
    { hex: "#1f2a44", name: "Navy" },
    { hex: "#17181c", name: "Black" },
    { hex: "#7a7d82", name: "Grey" },
    { hex: "#d9a7a0", name: "Dusty pink" },
    { hex: "#55543e", name: "Olive" },
    { hex: "#5e2129", name: "Burgundy" },
    { hex: "#b28c58", name: "Camel" },
  ],
};

export const OWNED_SLOT_LABEL: Record<OwnedSlot, string> = {
  shoes: "Shoes",
  bottoms: "Bottoms",
  layers: "Layers",
  tops: "Tops",
};

export const OWNED_SLOTS: OwnedSlot[] = ["shoes", "bottoms", "layers", "tops"];
