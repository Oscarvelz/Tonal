import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GENDER_LABEL,
  HARMONY_LABEL,
  HARMONIES,
  OCCASION_LABEL,
  OCCASIONS,
  PERSONAL_SEASON_LABEL,
  PERSONAL_SEASONS,
  SEASON_LABEL,
  SEASONS,
  SOPHISTICATION_LABEL,
  SOPHISTICATIONS,
  type Gender,
  type Harmony,
  type Occasion,
  type PersonalSeason,
  type Season,
  type Sophistication,
} from "@/lib/color/types";
import { useDress, type Weather } from "@/lib/store";
import type { WearerContrast } from "@/lib/color/rules";

const CONTRAST_LABEL: Record<WearerContrast | "any", string> = {
  any: "Not set",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const WEATHER_LABEL: Record<Weather, string> = {
  any: "Any",
  hot: "Hot",
  mild: "Mild",
  cold: "Cold",
};

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 shrink-0 rounded-full px-3.5 text-sm transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
        active
          ? "bg-accent text-accent-fg"
          : "bg-surface text-muted shadow-[var(--shadow-border)] hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar({ extra = false }: { extra?: boolean }) {
  const [open, setOpen] = useState(false);
  const gender = useDress((s) => s.gender);
  const occasion = useDress((s) => s.occasion);
  const season = useDress((s) => s.season);
  const autoSeason = useDress((s) => s.autoSeason);
  const sophistication = useDress((s) => s.sophistication);
  const harmony = useDress((s) => s.harmony);
  const personalSeason = useDress((s) => s.personalSeason);
  const wearerContrast = useDress((s) => s.wearerContrast);
  const weather = useDress((s) => s.weather);
  const setGender = useDress((s) => s.setGender);
  const setOccasion = useDress((s) => s.setOccasion);
  const setSeason = useDress((s) => s.setSeason);
  const setSophistication = useDress((s) => s.setSophistication);
  const setHarmony = useDress((s) => s.setHarmony);
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const setWearerContrast = useDress((s) => s.setWearerContrast);
  const setWeather = useDress((s) => s.setWeather);

  const refined =
    (!autoSeason && season !== "all") ||
    sophistication !== "any" ||
    harmony !== "any" ||
    personalSeason !== "any" ||
    wearerContrast !== "any" ||
    weather !== "any";

  return (
    <div className="flex flex-col gap-3">
      <Row label="Wardrobe">
        {(["men", "women"] as Gender[]).map((g) => (
          <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
            {GENDER_LABEL[g]}
          </Chip>
        ))}
      </Row>
      <Row label="Register">
        {OCCASIONS.map((o: Occasion) => (
          <Chip key={o} active={occasion === o} onClick={() => setOccasion(o)}>
            {OCCASION_LABEL[o]}
          </Chip>
        ))}
      </Row>
      {extra ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex h-11 w-fit items-center gap-2 rounded-md px-3 text-sm text-muted shadow-[var(--shadow-border)] transition-colors duration-150 hover:text-fg"
          >
            <SlidersHorizontal className="size-4" />
            {open ? "Hide refinements" : "Refine"}
            {refined && !open ? (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-fg">
                on
              </span>
            ) : null}
          </button>
          {open ? (
            <>
              <Row label="Season">
                <Chip active={autoSeason || season === "all"} onClick={() => setSeason("all")}>
                  Auto / any
                </Chip>
                {SEASONS.filter((s) => s !== "all").map((s: Season) => (
                  <Chip key={s} active={!autoSeason && season === s} onClick={() => setSeason(s)}>
                    {SEASON_LABEL[s]}
                  </Chip>
                ))}
              </Row>
              <Row label="Register of taste">
                <Chip active={sophistication === "any"} onClick={() => setSophistication("any")}>
                  Any
                </Chip>
                {SOPHISTICATIONS.map((s: Sophistication) => (
                  <Chip
                    key={s}
                    active={sophistication === s}
                    onClick={() => setSophistication(s)}
                  >
                    {SOPHISTICATION_LABEL[s]}
                  </Chip>
                ))}
              </Row>
              <Row label="Harmony">
                <Chip active={harmony === "any"} onClick={() => setHarmony("any")}>
                  Any chord
                </Chip>
                {HARMONIES.map((h: Harmony) => (
                  <Chip key={h} active={harmony === h} onClick={() => setHarmony(h)}>
                    {HARMONY_LABEL[h]}
                  </Chip>
                ))}
              </Row>
              <Row label="Personal season">
                <Chip active={personalSeason === "any"} onClick={() => setPersonalSeason("any")}>
                  Skip
                </Chip>
                {PERSONAL_SEASONS.map((p: PersonalSeason) => (
                  <Chip
                    key={p}
                    active={personalSeason === p}
                    onClick={() => setPersonalSeason(p)}
                  >
                    {PERSONAL_SEASON_LABEL[p]}
                  </Chip>
                ))}
              </Row>
              <Row label="Face contrast">
                {(["any", "high", "medium", "low"] as Array<WearerContrast | "any">).map(
                  (c) => (
                    <Chip
                      key={c}
                      active={wearerContrast === c}
                      onClick={() => setWearerContrast(c)}
                    >
                      {CONTRAST_LABEL[c]}
                    </Chip>
                  ),
                )}
              </Row>
              <Row label="Weather">
                {(["any", "hot", "mild", "cold"] as Weather[]).map((w) => (
                  <Chip key={w} active={weather === w} onClick={() => setWeather(w)}>
                    {WEATHER_LABEL[w]}
                  </Chip>
                ))}
              </Row>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
        {label}
      </p>
      <div className="chip-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{children}</div>
    </div>
  );
}
