import {
  colorInRegion,
  deltaE,
  hexToMunsell,
  paletteSeasons,
  SEASON_REGIONS,
} from "@/lib/color/munsell";
import { PALETTES } from "@/lib/color/palettes";
import { PERSONAL_SEASONS, type PersonalSeason } from "@/lib/color/types";

/**
 * Season strips (2.3) — four chips per personal season, derived from the
 * catalog itself: the swatches of the palettes that legally belong to the
 * season, kept only when the colour itself lives inside the season's
 * Munsell region, deduplicated, then greedily picked so the strip reads
 * as a value ramp (light → deep) carrying the season's pulse. No invented
 * colours: every chip is a colour Matiz dresses from. Computed once at
 * module load.
 *
 * Two honesty guards shape the picks:
 * - Distinctiveness: a chip counted by how many seasons' pools hold it.
 *   Sibling seasons (true vs soft summer) share most of their pool, so
 *   the picks prefer the chips that are most nearly the season's own —
 *   otherwise siblings come out wearing identical strips.
 * - Chroma floor: near-neutral chips (Munsell chroma < 2) are the
 *   catalog's supporting neutrals, not a season's signature, so they are
 *   held back unless a pool cannot fill four without them.
 */
function buildPool(season: PersonalSeason): string[] {
  const pool: string[] = [];
  const seen = new Set<string>();
  for (const palette of PALETTES) {
    if (!paletteSeasons(palette).includes(season)) continue;
    for (const swatch of Object.values(palette.colors)) {
      const hex =
        typeof swatch === "string" ? swatch : (swatch as { hex?: string } | undefined)?.hex;
      if (typeof hex !== "string" || !hex.startsWith("#")) continue;
      const key = hex.toLowerCase();
      if (seen.has(key)) continue;
      if (!colorInRegion(hex, season)) continue;
      seen.add(key);
      pool.push(hex);
    }
  }
  return pool;
}

const POOLS: Record<PersonalSeason, string[]> = Object.fromEntries(
  PERSONAL_SEASONS.map((season) => [season, buildPool(season)]),
) as Record<PersonalSeason, string[]>;

const POOL_COUNT = new Map<string, number>();
for (const season of PERSONAL_SEASONS) {
  for (const hex of POOLS[season]) {
    const key = hex.toLowerCase();
    POOL_COUNT.set(key, (POOL_COUNT.get(key) ?? 0) + 1);
  }
}

function deriveStrip(season: PersonalSeason): string[] {
  const full = POOLS[season];
  const chromatic = full.filter((hex) => hexToMunsell(hex).chroma >= 2);
  const byValueDesc = [...full].sort((a, b) => hexToMunsell(b).value - hexToMunsell(a).value);
  const chromaticDesc = [...chromatic].sort(
    (a, b) => hexToMunsell(b).value - hexToMunsell(a).value,
  );
  if (byValueDesc.length <= 4) return byValueDesc;

  const distinctiveFirst = (a: string, b: string) =>
    (POOL_COUNT.get(a.toLowerCase()) ?? 0) - (POOL_COUNT.get(b.toLowerCase()) ?? 0);
  const medianValue = hexToMunsell(byValueDesc[Math.floor(byValueDesc.length / 2)] as string).value;
  // The pulse speaks in the season's own chroma register — a soft season's
  // pulse is muted, a bright season's is vivid — so aim at the region's
  // chroma midpoint, not the pool maximum.
  const region = SEASON_REGIONS[season];
  const chromaMid = (region.cMin + region.cMax) / 2;

  for (const threshold of [12, 8, 0]) {
    const picked: string[] = [];
    const farFromPicked = (hex: string) =>
      picked.every((other) => deltaE(hex, other) >= threshold);
    const take = (candidate: string | undefined) => {
      if (candidate && !picked.includes(candidate) && farFromPicked(candidate)) {
        picked.push(candidate);
      }
    };
    // The lightest survivor opens the ramp — neutrals allowed: white and
    // ivory are honest anchors.
    take(byValueDesc[0]);
    // The season's pulse: its most distinctive chromatic survivor near
    // its chroma register.
    take(
      [...chromaticDesc]
        .filter((hex) => !picked.includes(hex))
        .sort(
          (a, b) =>
            distinctiveFirst(a, b) ||
            Math.abs(hexToMunsell(a).chroma - chromaMid) -
              Math.abs(hexToMunsell(b).chroma - chromaMid),
        )[0],
    );
    // The deepest survivor closes it — black is an honest anchor too.
    take([...byValueDesc].reverse().find((hex) => !picked.includes(hex) && farFromPicked(hex)));
    // The median-value remainder fills the middle from the chromatic
    // pool, preferring a hue the strip does not already carry.
    const remaining = [...chromaticDesc].filter(
      (hex) => !picked.includes(hex) && farFromPicked(hex),
    );
    const pickedHues = new Set(picked.map((hex) => hexToMunsell(hex).hueIndex));
    const freshHue = remaining.filter((hex) => !pickedHues.has(hexToMunsell(hex).hueIndex));
    take(
      (freshHue.length > 0 ? freshHue : remaining).sort(
        (a, b) =>
          distinctiveFirst(a, b) ||
          Math.abs(hexToMunsell(a).value - medianValue) -
            Math.abs(hexToMunsell(b).value - medianValue),
      )[0],
    );
    // Any shortfall: fill in value order, chromatic pool first.
    for (const hex of [...chromaticDesc, ...byValueDesc]) {
      if (picked.length >= 4) break;
      take(hex);
    }
    if (picked.length >= 4) {
      return picked.sort((a, b) => hexToMunsell(b).value - hexToMunsell(a).value);
    }
  }
  return byValueDesc.slice(0, 4);
}

export const SEASON_STRIPS: Record<PersonalSeason, string[]> = Object.fromEntries(
  PERSONAL_SEASONS.map((season) => [season, deriveStrip(season)]),
) as Record<PersonalSeason, string[]>;
