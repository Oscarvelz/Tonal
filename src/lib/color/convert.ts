export type Hsl = { h: number; s: number; l: number };
export type Rgb = { r: number; g: number; b: number };

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full.slice(0, 6), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) =>
    Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r1) h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6;
  else if (max === g1) h = ((b1 - r1) / d + 2) / 6;
  else h = ((r1 - g1) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = ((h % 360) + 360) % 360;
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = l - C / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (hn < 60) [r, g, b] = [C, X, 0];
  else if (hn < 120) [r, g, b] = [X, C, 0];
  else if (hn < 180) [r, g, b] = [0, C, X];
  else if (hn < 240) [r, g, b] = [0, X, C];
  else if (hn < 300) [r, g, b] = [X, 0, C];
  else [r, g, b] = [C, 0, X];
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

export function isWarmHex(hex: string): boolean {
  const { h, s } = hexToHsl(hex);
  if (s < 0.08) return false;
  return h < 70 || h > 300;
}

export function undertoneOf(hex: string): "warm" | "cool" | "neutral" {
  const { h, s } = hexToHsl(hex);
  if (s < 0.1) return "neutral";
  if (h < 70 || h >= 300) return "warm";
  if (h >= 70 && h <= 100) return "warm";
  if (h > 170 && h < 260) return "cool";
  if (h >= 260 && h < 300) return "cool";
  return "warm";
}

export function rotateHue(hex: string, deg: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, h: hsl.h + deg });
}

export function setLightness(hex: string, l: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, l: clamp(l) });
}

export function setSaturation(hex: string, s: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, s: clamp(s) });
}

export function mixHex(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}

const HUE_NAMES: [number, string][] = [
  [8, "crimson"],
  [16, "rust"],
  [24, "terracotta"],
  [32, "cognac"],
  [38, "camel"],
  [46, "ochre"],
  [55, "sand"],
  [70, "olive"],
  [90, "moss"],
  [110, "leaf"],
  [140, "forest"],
  [160, "bottle"],
  [175, "teal"],
  [190, "slate-teal"],
  [205, "steel"],
  [220, "navy"],
  [235, "ink"],
  [255, "indigo"],
  [275, "aubergine"],
  [300, "plum"],
  [330, "berry"],
  [350, "wine"],
  [360, "oxblood"],
];

export function nameFromHue(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  if (s < 0.07) {
    if (l < 0.12) return "black";
    if (l < 0.28) return "charcoal";
    if (l < 0.45) return "graphite";
    if (l < 0.62) return "stone";
    if (l < 0.8) return "fog";
    if (l < 0.92) return "ivory";
    return "white";
  }
  let name = "tone";
  for (const [max, n] of HUE_NAMES) {
    if (h <= max) {
      name = n;
      break;
    }
  }
  if (l < 0.18) return `midnight ${name}`;
  if (l < 0.32) return `deep ${name}`;
  if (l > 0.78) return `pale ${name}`;
  if (s < 0.25) return `dusty ${name}`;
  return name;
}

export function fashionize(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  const sat = clamp(s * 0.72, 0.12, 0.48);
  const light = clamp(l, 0.14, 0.86);
  return hslToHex({ h, s: sat, l: light });
}

export function complementary(hex: string): string {
  return rotateHue(hex, 180);
}

export function analogous(hex: string): [string, string] {
  return [rotateHue(hex, -28), rotateHue(hex, 28)];
}

export function splitComplement(hex: string): [string, string] {
  return [rotateHue(hex, 150), rotateHue(hex, 210)];
}

export function triadic(hex: string): [string, string] {
  return [rotateHue(hex, 120), rotateHue(hex, 240)];
}

export function textOn(hex: string): string {
  return relativeLuminance(hex) > 0.42 ? "#1a1814" : "#f4f1ea";
}
