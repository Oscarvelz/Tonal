import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { FilterBar } from "@/components/filter-bar";
import { LookHero } from "@/components/look-panel";
import { catalogStats, formatSpace, lookSpace } from "@/lib/color/engine";
import { calendarSeason } from "@/lib/color/garments";
import { strategiesMatching } from "@/lib/color/strategies";
import { useDress, type IntervalSec } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: DressPage });

function DressPage() {
  const current = useDress((s) => s.current);
  const live = useDress((s) => s.live);
  const intervalSec = useDress((s) => s.intervalSec);
  const setIntervalSec = useDress((s) => s.setIntervalSec);
  const refresh = useDress((s) => s.refresh);
  const hydrated = useDress((s) => s.hydrated);
  const gender = useDress((s) => s.gender);
  const occasion = useDress((s) => s.occasion);
  const season = useDress((s) => s.season);
  const autoSeason = useDress((s) => s.autoSeason);
  const sophistication = useDress((s) => s.sophistication);
  const harmony = useDress((s) => s.harmony);
  const personalSeason = useDress((s) => s.personalSeason);

  const stats = catalogStats();
  const space = useMemo(
    () =>
      lookSpace({
        gender,
        occasion,
        season: autoSeason ? calendarSeason() : season,
        sophistication,
        harmony,
        personalSeason,
      }),
    [gender, occasion, season, autoSeason, sophistication, harmony, personalSeason],
  );
  const strategyCount = useMemo(
    () => strategiesMatching({ gender, occasion, sophistication }).length,
    [gender, occasion, sophistication],
  );

  useEffect(() => {
    if (!live || !hydrated) return;
    const id = window.setInterval(() => refresh(), intervalSec * 1000);
    return () => window.clearInterval(id);
  }, [live, intervalSec, refresh, hydrated, current?.id]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
            Live runway
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Dress faster
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Looks refresh on their own. Previous restores the one you just passed.
            {` ${formatSpace(space)} combinations in this cut · ${strategyCount} strategies · ${stats.rules} rules.`}
          </p>
        </div>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Refresh speed</legend>
          {([6, 10, 15] as IntervalSec[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIntervalSec(n)}
              className={cn(
                "h-10 min-w-11 rounded-full px-3 text-sm tabular-nums transition-colors duration-150",
                intervalSec === n
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              {n}s
            </button>
          ))}
        </fieldset>
      </header>

      <FilterBar extra />

      {current ? (
        <LookHero look={current} ticking={live} />
      ) : (
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      )}
    </div>
  );
}
