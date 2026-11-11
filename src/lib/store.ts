import { create } from "zustand";
import { generateLook, type GenerateOpts } from "@/lib/color/engine";
import { calendarSeason } from "@/lib/color/garments";
import type { WearerContrast } from "@/lib/color/rules";
import type {
  Gender,
  Harmony,
  Look,
  Occasion,
  OwnedColor,
  OwnedColors,
  OwnedSlot,
  PersonalSeason,
  Season,
  Sophistication,
} from "@/lib/color/types";
import { OCCASIONS } from "@/lib/color/types";

const STORAGE_KEY = "tonal-v1";
const MAX_SAVED = 48;
const MAX_HISTORY = 24;
const SEED_LOOK = 20260918;

export type IntervalSec = 6 | 10 | 15;

/** The second question (after occasion): the weather dresses the season. */
export type Weather = "any" | "hot" | "mild" | "cold";

type Persisted = {
  gender: Gender;
  occasion: Occasion;
  season: Season;
  autoSeason: boolean;
  sophistication: Sophistication | "any";
  harmony: Harmony | "any";
  personalSeason: PersonalSeason | "any";
  wearerContrast: WearerContrast | "any";
  weather: Weather;
  closetMode: boolean;
  /** Colors the wearer declared they own, per slot (2.1). */
  ownedColors: OwnedColors;
  /**
   * The look last seen under each generation signature (2.3) — Occasion
   * and Weather remember their palette instead of rolling a new one:
   * leaving a signature and coming back restores its look untouched.
   * Next look is the one deliberate re-roll, and it re-rolls the whole
   * occasion family at once (2.3.1): every occasion under the current
   * settings deals a fresh look, so a wearer browsing Casual → Smart
   * casual → Elegant never meets a palette they already passed over.
   * Other weathers keep their own remembered looks.
   */
  lookMemory: Record<string, Look>;
  live: boolean;
  intervalSec: IntervalSec;
  saved: Look[];
};

const defaults: Persisted = {
  gender: "men",
  occasion: "smart-casual",
  season: "all",
  autoSeason: true,
  sophistication: "any",
  harmony: "any",
  personalSeason: "any",
  wearerContrast: "any",
  weather: "any",
  closetMode: false,
  ownedColors: { shoes: [], bottoms: [], layers: [], tops: [] },
  lookMemory: {},
  live: true,
  intervalSec: 10,
  saved: [],
};

const RETIRED_OCCASION: Record<string, Occasion> = {
  easy: "casual",
  americana: "casual",
  "semi-formal": "elegant",
  "laid-back": "casual",
  cowboy: "casual",
};

function migrateOccasion(value: unknown): Occasion {
  if (typeof value === "string" && (OCCASIONS as readonly string[]).includes(value)) {
    return value as Occasion;
  }
  if (typeof value === "string" && value in RETIRED_OCCASION) {
    return RETIRED_OCCASION[value] as Occasion;
  }
  return defaults.occasion;
}

function migrateLook(look: Look): Look {
  return { ...look, occasion: migrateOccasion(look.occasion) };
}

function seedLook(): Look {
  return generateLook(
    {
      gender: defaults.gender,
      occasion: defaults.occasion,
      season: calendarSeason(),
      sophistication: defaults.sophistication,
      harmony: defaults.harmony,
      personalSeason: defaults.personalSeason,
    },
    SEED_LOOK,
  );
}

const initialLook = seedLook();

function readStorage(): Partial<Persisted> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Persisted>;
  } catch {
    return {};
  }
}

function writeStorage(state: Persisted) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

type DressState = Persisted & {
  current: Look | null;
  /** The generation signature the current look belongs to ("" if unknown). */
  sigKey: string;
  history: Look[];
  index: number;
  recentIds: string[];
  hydrated: boolean;
  hydrate: () => void;
  persistSlice: () => Persisted;
  generateOpts: () => GenerateOpts;
  refresh: () => void;
  nextLook: () => void;
  previous: () => void;
  hold: () => void;
  setLive: (live: boolean) => void;
  setGender: (gender: Gender) => void;
  setOccasion: (occasion: Occasion) => void;
  setSeason: (season: Season) => void;
  setAutoSeason: (autoSeason: boolean) => void;
  setSophistication: (sophistication: Sophistication | "any") => void;
  setHarmony: (harmony: Harmony | "any") => void;
  setPersonalSeason: (personalSeason: PersonalSeason | "any") => void;
  setWearerContrast: (wearerContrast: WearerContrast | "any") => void;
  setWeather: (weather: Weather) => void;
  setClosetMode: (closetMode: boolean) => void;
  setOwnedColors: (slot: OwnedSlot, colors: OwnedColor[]) => void;
  setIntervalSec: (intervalSec: IntervalSec) => void;
  applyPalette: (paletteId: string) => void;
  adoptLook: (look: Look, hold?: boolean) => void;
  toggleSave: (look?: Look) => void;
  isSaved: (id: string) => boolean;
  removeSaved: (id: string) => void;
};

export const useDress = create<DressState>((set, get) => {
  function rememberIds(look: Look) {
    return [look.paletteId ?? look.id, ...get().recentIds].slice(0, 12);
  }

  /** The signature of a generation: every input the generator consumes,
   *  minus the avoid-list. Two visits with the same signature are the
   *  same dressing question, so they must meet the same look. */
  function signatureOf(opts: GenerateOpts): string {
    const { avoidIds: _avoidIds, ...rest } = opts;
    return JSON.stringify(rest, (key, value) =>
      key === "closetHexes" && Array.isArray(value) ? [...(value as string[])].sort() : value,
    );
  }

  /** Two signatures are occasion siblings when they differ ONLY in the
   *  occasion — the family Next look re-rolls together. */
  function isOccasionSibling(a: string, b: string): boolean {
    if (a === b) return true;
    try {
      const pa = JSON.parse(a) as Record<string, unknown>;
      const pb = JSON.parse(b) as Record<string, unknown>;
      delete pa.occasion;
      delete pb.occasion;
      return JSON.stringify(pa) === JSON.stringify(pb);
    } catch {
      return false;
    }
  }

  const MAX_MEMORY = 12;
  function pruneMemory(memory: Record<string, Look>, keepKey: string): Record<string, Look> {
    const keys = Object.keys(memory);
    if (keys.length <= MAX_MEMORY) return memory;
    const kept = keys.filter((k) => k === keepKey);
    const rest = keys.filter((k) => k !== keepKey).slice(-(MAX_MEMORY - kept.length));
    const out: Record<string, Look> = {};
    for (const k of [...rest, ...kept]) out[k] = memory[k] as Look;
    return out;
  }

  function appendLook(look: Look, extra: Partial<DressState> = {}) {
    const s = get();
    const base = s.history.slice(0, s.index + 1);
    const last = base[base.length - 1];
    const history =
      last && last.id === look.id
        ? base
        : [...base, look].slice(-MAX_HISTORY);
    set({
      current: look,
      history,
      index: history.length - 1,
      recentIds: rememberIds(look),
      ...extra,
    });
  }

  return {
    ...defaults,
    current: initialLook,
    sigKey: "",
    history: [initialLook],
    index: 0,
    recentIds: [],
    hydrated: false,
    persistSlice: () => {
      const s = get();
      return {
        gender: s.gender,
        occasion: s.occasion,
        season: s.season,
        autoSeason: s.autoSeason,
        sophistication: s.sophistication,
        harmony: s.harmony,
        personalSeason: s.personalSeason,
        wearerContrast: s.wearerContrast,
        weather: s.weather,
        closetMode: s.closetMode,
        ownedColors: s.ownedColors,
        lookMemory: s.lookMemory,
        live: s.live,
        intervalSec: s.intervalSec,
        saved: s.saved,
      };
    },
    generateOpts: () => {
      const s = get();
      const season =
        s.weather === "hot"
          ? "summer"
          : s.weather === "cold"
            ? "winter"
            : s.autoSeason
              ? calendarSeason()
              : s.season;
      const closetHexes =
        s.closetMode && s.saved.length > 0
          ? Array.from(
              new Set(
                s.saved.flatMap((look) =>
                  [
                    look.pieces.layer,
                    look.pieces.top,
                    look.pieces.bottom,
                    look.pieces.shoes,
                    look.pieces.accessory,
                  ]
                    .filter((piece) => piece != null)
                    .map((piece) => piece.hex),
                ),
              ),
            )
          : undefined;
      const owned =
        s.ownedColors &&
        (s.ownedColors.shoes.length > 0 ||
          s.ownedColors.bottoms.length > 0 ||
          s.ownedColors.layers.length > 0 ||
          s.ownedColors.tops.length > 0)
          ? s.ownedColors
          : undefined;
      return {
        gender: s.gender,
        occasion: s.occasion,
        season,
        sophistication: s.sophistication,
        harmony: s.harmony,
        personalSeason: s.personalSeason,
        wearerContrast: s.wearerContrast,
        closetHexes,
        owned,
        avoidIds: s.recentIds,
      };
    },
    hydrate: () => {
      if (get().hydrated) return;
      const stored = readStorage();
      const hasStored = Object.keys(stored).length > 0;
      const occasion = migrateOccasion(stored.occasion);
      const saved = Array.isArray(stored.saved) ? stored.saved.map(migrateLook) : [];
      set({ ...defaults, ...stored, occasion, saved, hydrated: true });
      if (hasStored) get().refresh();
    },
    refresh: () => {
      const s = get();
      // Stash the outgoing look under its own signature, then answer the
      // new signature from memory when it has one — the palette a wearer
      // saw for these settings is the palette they come back to.
      const memory = { ...s.lookMemory };
      if (s.current && s.sigKey) memory[s.sigKey] = s.current;
      const opts = s.generateOpts();
      const sig = signatureOf(opts);
      const remembered = memory[sig];
      set({ lookMemory: pruneMemory(memory, sig) });
      appendLook(remembered ?? generateLook(opts), { sigKey: sig });
      writeStorage(get().persistSlice());
    },
    nextLook: () => {
      const s = get();
      if (s.index < s.history.length - 1) {
        const index = s.index + 1;
        const current = s.history[index];
        if (current) {
          set({ current, index });
          return;
        }
      }
      const look = generateLook(s.generateOpts());
      // Next look is the one deliberate re-roll, and it re-rolls the
      // whole occasion family at once: the new look becomes this
      // signature's memory, and every occasion sibling's remembered look
      // is dropped, so each deals a fresh palette on the next visit.
      // Signatures differing in anything else (weather, season, …) keep
      // their remembered looks.
      if (s.sigKey) {
        const memory: Record<string, Look> = {};
        for (const [key, value] of Object.entries(s.lookMemory)) {
          if (!isOccasionSibling(key, s.sigKey)) memory[key] = value;
        }
        memory[s.sigKey] = look;
        set({ lookMemory: pruneMemory(memory, s.sigKey) });
      }
      appendLook(look);
      writeStorage(get().persistSlice());
    },
    previous: () => {
      const s = get();
      if (s.index <= 0) return;
      const index = s.index - 1;
      const current = s.history[index];
      if (!current) return;
      set({ current, index, live: false });
      writeStorage(get().persistSlice());
    },
    hold: () => set({ live: false }),
    setLive: (live) => {
      set({ live });
      writeStorage(get().persistSlice());
    },
    setGender: (gender) => {
      set({ gender });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setOccasion: (occasion) => {
      set({ occasion });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setSeason: (season) => {
      set({ season, autoSeason: season === "all" ? get().autoSeason : false });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setAutoSeason: (autoSeason) => {
      set({ autoSeason, season: autoSeason ? "all" : get().season });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setSophistication: (sophistication) => {
      set({ sophistication });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setHarmony: (harmony) => {
      set({ harmony });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setPersonalSeason: (personalSeason) => {
      set({ personalSeason });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setWearerContrast: (wearerContrast) => {
      set({ wearerContrast });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setWeather: (weather) => {
      set({ weather });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setClosetMode: (closetMode) => {
      set({ closetMode });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setOwnedColors: (slot, colors) => {
      set({ ownedColors: { ...get().ownedColors, [slot]: colors } });
      writeStorage(get().persistSlice());
      get().refresh();
    },
    setIntervalSec: (intervalSec) => {
      set({ intervalSec });
      writeStorage(get().persistSlice());
    },
    applyPalette: (paletteId) => {
      const look = generateLook({ ...get().generateOpts(), paletteId });
      appendLook(look, { live: false });
      writeStorage(get().persistSlice());
    },
    adoptLook: (look, hold = true) => {
      appendLook(look, { live: hold ? false : get().live });
      writeStorage(get().persistSlice());
    },
    isSaved: (id) => get().saved.some((l) => l.id === id),
    toggleSave: (look) => {
      const target = look ?? get().current;
      if (!target) return;
      const exists = get().saved.some((l) => l.id === target.id);
      const saved = exists
        ? get().saved.filter((l) => l.id !== target.id)
        : [target, ...get().saved].slice(0, MAX_SAVED);
      set({ saved });
      writeStorage(get().persistSlice());
    },
    removeSaved: (id) => {
      set({ saved: get().saved.filter((l) => l.id !== id) });
      writeStorage(get().persistSlice());
    },
  };
});
