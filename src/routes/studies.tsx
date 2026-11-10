import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { PaletteCard } from "@/components/palette-card";
import { paletteMatches } from "@/lib/color/engine";
import { PALETTES } from "@/lib/color/palettes";
import {
  HARMONY_LABEL,
  OCCASION_LABEL,
  SEASON_LABEL,
  SOPHISTICATION_LABEL,
  type Harmony,
  type Occasion,
  type Season,
  type Sophistication,
} from "@/lib/color/types";
import { useDress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studies")({ component: StudiesPage });

type GroupBy = "harmony" | "occasion" | "sophistication" | "season";

function StudiesPage() {
  const gender = useDress((s) => s.gender);
  const occasion = useDress((s) => s.occasion);
  const season = useDress((s) => s.season);
  const autoSeason = useDress((s) => s.autoSeason);
  const sophistication = useDress((s) => s.sophistication);
  const harmony = useDress((s) => s.harmony);
  const personalSeason = useDress((s) => s.personalSeason);
  const [groupBy, setGroupBy] = useState<GroupBy>("harmony");

  const filtered = useMemo(
    () =>
      PALETTES.filter((p) =>
        paletteMatches(p, {
          gender,
          occasion,
          season: autoSeason ? "all" : season,
          sophistication,
          harmony,
          personalSeason,
        }),
      ),
    [gender, occasion, season, autoSeason, sophistication, harmony, personalSeason],
  );

  const groups = useMemo(() => groupPalettes(filtered, groupBy), [filtered, groupBy]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
          Color studies
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Chords, not trends
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {PALETTES.length} editorial studies. The live runway draws from these plus hundreds of
          generated cloth chords — thousands of full looks once garments permute. Wear any study
          to lock it on the figure.
        </p>
      </header>

      <FilterBar extra />

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Categorize</legend>
        {(
          [
            ["harmony", "By harmony"],
            ["sophistication", "By taste"],
            ["occasion", "By register"],
            ["season", "By season"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setGroupBy(key)}
            className={cn(
              "h-10 rounded-full px-3.5 text-sm transition-colors duration-150",
              groupBy === key
                ? "bg-accent text-accent-fg"
                : "bg-surface text-muted shadow-[var(--shadow-border)] hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </fieldset>

      <p className="text-sm text-muted tabular-nums">{filtered.length} studies in this filter</p>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-surface px-5 py-10 text-center shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl">No studies in this cut</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Loosen a refinement — season, taste, or personal season — or switch register.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="mb-4 font-display text-3xl font-medium tracking-tight">
                {group.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((p) => (
                  <PaletteCard key={p.id} palette={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function groupPalettes(list: typeof PALETTES, by: GroupBy) {
  const map = new Map<string, typeof PALETTES>();
  for (const p of list) {
    const keys =
      by === "harmony"
        ? [p.harmony]
        : by === "sophistication"
          ? [p.sophistication]
          : by === "season"
            ? [p.season]
            : p.occasions;
    for (const key of keys) {
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
  }
  return [...map.entries()].map(([key, items]) => ({
    key,
    title:
      by === "harmony"
        ? HARMONY_LABEL[key as Harmony]
        : by === "sophistication"
          ? SOPHISTICATION_LABEL[key as Sophistication]
          : by === "season"
            ? SEASON_LABEL[key as Season]
            : OCCASION_LABEL[key as Occasion],
    items,
  }));
}
