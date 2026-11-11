import type { BottomKind, Gender, LayerKind, Occasion } from "./types";

export type Wardrobe = {
  tops: string[];
  bottoms: string[];
  shoes: string[];
  layers: string[];
  accessories: string[];
  /** One-piece dresses (women's wardrobes; empty for men). A dress takes
   *  the palette's dominant as a single cloth for top and bottom alike. */
  dresses: string[];
  bottomKind: BottomKind;
  layerKind: LayerKind;
};

/**
 * The figure's kind follows the garment's NAME (2.4) — never a dice roll
 * beside it. A trench drawn hip-length or a crew sweater drawn as a
 * blazer is the palette naming one garment while the figure wears
 * another; the name is the truth and the silhouette obeys it.
 */
export function layerKindForGarment(name: string): LayerKind {
  const n = name.toLowerCase();
  if (/vest|waistcoat/.test(n)) return "vest";
  if (/blazer|sport coat|dinner jacket|suit jacket|peak-lapel/.test(n)) return "blazer";
  if (/chore/.test(n)) return "jacket";
  if (/overcoat|trench|cape|wrap|coat/.test(n)) return "coat";
  if (/cardigan|crew|v-neck|sweater|knit/.test(n)) return "knit";
  return "jacket";
}

export function bottomKindForGarment(name: string): BottomKind {
  const n = name.toLowerCase();
  if (/skirt|midi/.test(n)) return "skirt";
  if (/shorts/.test(n)) return "shorts";
  if (/wide|palazzo|barrel/.test(n)) return "wide";
  return "pants";
}

const MEN: Record<Occasion, Wardrobe> = {
  casual: {
    tops: [
      "heavyweight tee",
      "linen camp-collar shirt",
      "merino polo",
      "chambray shirt",
      "cotton henley",
      "oxford shirt",
      "knit polo",
      "overdyed crew",
      "band-collar shirt",
    ],
    bottoms: [
      "dark denim",
      "stone chinos",
      "olive field pants",
      "khaki twill",
      "drawstring wool trousers",
      "selvedge jean",
      "sand cotton trousers",
      "charcoal sweat-trouser",
      "chino shorts",
      "linen shorts",
    ],
    shoes: [
      "white leather sneakers",
      "suede loafers",
      "chukka boots",
      "suede derbies",
      "canvas sneakers",
      "leather trainers",
      "desert boots",
      "boat shoes",
    ],
    layers: [
      "overshirt",
      "field jacket",
      "bomber",
      "cardigan",
      "suede trucker",
      "harrington",
      "denim jacket",
      "quilted vest",
    ],
    accessories: ["leather belt", "canvas belt", "wool cap", "simple watch on leather"],
    dresses: [],
    bottomKind: "pants",
    layerKind: "jacket",
  },
  "smart-casual": {
    tops: [
      "oxford shirt",
      "merino polo",
      "fine-gauge crew",
      "grandad collar shirt",
      "knit polo",
      "chambray shirt",
      "silk-knit polo",
      "turtleneck",
    ],
    bottoms: [
      "charcoal flannel trousers",
      "navy chinos",
      "dark denim",
      "stone cotton trousers",
      "olive chinos",
      "grey high-twist wool",
      "sand chinos",
      "navy fresco trousers",
    ],
    shoes: [
      "suede loafers",
      "dark derbies",
      "Chelsea boots",
      "leather sneakers",
      "penny loafers",
      "tassel loafers",
      "chukka boots",
      "monk straps",
    ],
    layers: [
      "unstructured blazer",
      "overshirt",
      "bomber",
      "harrington",
      "cashmere crew",
      "field jacket",
      "knit blazer",
      "suede overshirt",
    ],
    accessories: ["leather belt", "pocket square", "knit tie", "suede belt"],
    dresses: [],
    bottomKind: "pants",
    layerKind: "blazer",
  },
  elegant: {
    tops: [
      "merino turtleneck",
      "silk-knit polo",
      "poplin shirt",
      "cashmere crew",
      "fine oxford",
      "ivory turtleneck",
      "grandad shirt",
      "fine-gauge V-neck",
    ],
    bottoms: [
      "navy wool trousers",
      "charcoal flannel",
      "stone tropical wool",
      "dark fresco trousers",
      "grey high-twist wool",
      "camel wool trousers",
      "midnight trousers",
      "putty fresco",
    ],
    shoes: [
      "suede loafers",
      "dark oxfords",
      "monk straps",
      "Chelsea boots",
      "tassel loafers",
      "cap-toe derbies",
      "suede Chelsea",
      "wholecuts",
    ],
    layers: [
      "navy blazer",
      "camel overcoat",
      "cashmere polo coat",
      "charcoal overcoat",
      "linen blazer",
      "double-breasted blazer",
      "navy overcoat",
      "unstructured sport coat",
      "tailored waistcoat",
    ],
    accessories: ["leather belt", "silk pocket square", "cashmere scarf", "grenadine tie"],
    dresses: [],
    bottomKind: "pants",
    layerKind: "coat",
  },
  formal: {
    tops: [
      "white Marcella shirt",
      "white poplin dress shirt",
      "black turtleneck",
      "ivory dress shirt",
      "tonal formal shirt",
      "pleated dress shirt",
      "fine black knit",
    ],
    bottoms: [
      "black dress trousers",
      "midnight trousers",
      "charcoal formal trousers",
      "black dinner trousers",
      "navy formal trousers",
      "black fresco trousers",
    ],
    shoes: [
      "black oxfords",
      "opera pumps",
      "black cap-toe",
      "dark wholecuts",
      "patent oxfords",
      "black Chelsea",
    ],
    layers: [
      "dinner jacket",
      "black suit jacket",
      "midnight peak-lapel",
      "formal overcoat",
      "shawl-collar dinner jacket",
      "black peak-lapel",
    ],
    accessories: ["black bow tie", "silk pocket square", "mother-of-pearl cufflinks", "black silk cummerbund"],
    dresses: [],
    bottomKind: "pants",
    layerKind: "coat",
  },
};

const WOMEN: Record<Occasion, Wardrobe> = {
  casual: {
    tops: [
      "cotton tee",
      "linen shirt",
      "ribbed knit",
      "poplin shirt",
      "cashmere tank",
      "oxford shirt",
      "fine henley",
      "silk-cotton tee",
      "cropped knit",
    ],
    bottoms: [
      "dark denim",
      "tailored trousers",
      "wide cotton pants",
      "midi skirt",
      "khaki chinos",
      "barrel-leg jean",
      "pull-on trousers",
      "A-line skirt",
    ],
    shoes: [
      "white sneakers",
      "loafers",
      "ballet flats",
      "ankle boots",
      "leather sandals",
      "mary janes",
      "suede sneakers",
      "fisherman sandals",
    ],
    layers: [
      "overshirt",
      "denim jacket",
      "cardigan",
      "trench",
      "leather jacket",
      "chore coat",
      "long cardigan",
      "blouson",
    ],
    accessories: ["leather belt", "structured tote", "silk scarf", "slim belt"],
    dresses: ["wrap midi dress", "linen shirt dress", "cotton sundress", "knit column dress"],
    bottomKind: "pants",
    layerKind: "jacket",
  },
  "smart-casual": {
    tops: [
      "silk blouse",
      "fine merino",
      "poplin shirt",
      "knit polo",
      "wrap blouse",
      "fine turtleneck",
      "band-collar shirt",
      "cashmere crew",
    ],
    bottoms: [
      "tailored trousers",
      "dark denim",
      "midi skirt",
      "wide-leg wool",
      "cigarette pants",
      "column skirt",
      "barrel trousers",
      "pleated midi",
    ],
    shoes: [
      "loafers",
      "slingbacks",
      "ankle boots",
      "ballet flats",
      "leather sneakers",
      "kitten heels",
      "mary janes",
      "suede loafers",
    ],
    layers: [
      "cropped blazer",
      "long cardigan",
      "trench",
      "cashmere wrap",
      "overshirt",
      "leather jacket",
      "unstructured blazer",
      "short trench",
      "tailored vest",
    ],
    accessories: ["slim belt", "structured bag", "gold-or-silver hoop", "silk scarf"],
    dresses: ["wrap dress", "knit midi dress", "shirt dress", "pleated midi dress"],
    bottomKind: "pants",
    layerKind: "blazer",
  },
  elegant: {
    tops: [
      "silk blouse",
      "cashmere crew",
      "fine turtleneck",
      "wrap blouse",
      "satin camisole",
      "ivory silk shirt",
      "fine-gauge V-neck",
      "draped blouse",
    ],
    bottoms: [
      "wool wide-leg",
      "midi skirt",
      "cigarette pants",
      "fluid trousers",
      "column skirt",
      "ivory trousers",
      "bias midi",
      "palazzo",
    ],
    shoes: [
      "slingbacks",
      "pointed pumps",
      "leather loafers",
      "kitten heels",
      "ankle boots",
      "satin mules",
      "sculptural flat",
      "suede pumps",
    ],
    layers: [
      "camel coat",
      "cropped blazer",
      "long wool coat",
      "cashmere wrap",
      "leather jacket",
      "polo coat",
      "cape coat",
      "ivory blazer",
    ],
    accessories: ["skinny belt", "structured bag", "sculptural earring", "silk scarf"],
    dresses: ["satin slip dress", "silk wrap dress", "column dress", "draped midi dress"],
    bottomKind: "wide",
    layerKind: "coat",
  },
  formal: {
    tops: [
      "silk blouse",
      "strapless bodice",
      "fine turtleneck",
      "satin camisole",
      "ivory crepe shirt",
      "draped bodice",
      "jewel-neck crepe",
    ],
    bottoms: [
      "column skirt",
      "fluid evening trousers",
      "floor skirt",
      "cigarette pants",
      "dinner dress panel",
      "bias floor skirt",
      "tuxedo trousers",
    ],
    shoes: [
      "pointed pumps",
      "satin slingbacks",
      "opera pumps",
      "strappy evening sandal",
      "patent pumps",
      "satin mules",
    ],
    layers: [
      "evening wrap",
      "dinner jacket",
      "long wool coat",
      "cape",
      "tailored evening coat",
      "opera coat",
    ],
    accessories: ["clutch", "drop earring", "silk wrap", "metal cuff"],
    dresses: ["column gown", "satin evening dress", "crepe gown", "draped evening dress"],
    bottomKind: "skirt",
    layerKind: "coat",
  },
};

export function wardrobeFor(gender: Gender, occasion: Occasion): Wardrobe {
  return gender === "men" ? MEN[occasion] : WOMEN[occasion];
}

export function pick<T>(list: T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length)] as T;
}

export function calendarSeason(d = new Date()): Exclude<import("./types").Season, "all"> {
  const m = d.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}
