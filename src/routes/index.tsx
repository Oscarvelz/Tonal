import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, BookmarkCheck, ChevronLeft, RefreshCw, Sparkles } from "lucide-react";
import { AskSheet } from "@/components/ask-sheet";
import { ChordFields, PiecesList, WhyBlock } from "@/components/chord";
import { Mannequin } from "@/components/mannequin";
import { Segmented } from "@/components/segmented";
import { Button } from "@/components/ui/button";
import {
  OCCASION_LABEL,
  OCCASIONS,
  PERSONAL_SEASON_LABEL,
  type Occasion,
} from "@/lib/color/types";
import { useDress, type Weather } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: TodayPage });

const WEATHER_OPTIONS: Array<{ value: Weather; label: string }> = [
  { value: "any", label: "Any" },
  { value: "hot", label: "Hot" },
  { value: "mild", label: "Mild" },
  { value: "cold", label: "Cold" },
];

/**
 * Today (2.0) — the whole product on one screen, in the doctrine's order:
 * two questions, one look, the reason in one line. The look never changes
 * itself; it changes when the wearer asks.
 */
function TodayPage() {
  const current = useDress((s) => s.current);
  const occasion = useDress((s) => s.occasion);
  const weather = useDress((s) => s.weather);
  const personalSeason = useDress((s) => s.personalSeason);
  const wearerContrast = useDress((s) => s.wearerContrast);
  const closetMode = useDress((s) => s.closetMode);
  const savedCount = useDress((s) => s.saved.length);
  const canPrevious = useDress((s) => s.index > 0);
  const setOccasion = useDress((s) => s.setOccasion);
  const setWeather = useDress((s) => s.setWeather);
  const setClosetMode = useDress((s) => s.setClosetMode);
  const nextLook = useDress((s) => s.nextLook);
  const previous = useDress((s) => s.previous);
  const toggleSave = useDress((s) => s.toggleSave);
  const isSaved = useDress((s) => (current ? s.isSaved(current.id) : false));

  const [view, setView] = useState<"chord" | "figure">("chord");
  const [askOpen, setAskOpen] = useState(false);

  const profileBits = [
    personalSeason !== "any" ? PERSONAL_SEASON_LABEL[personalSeason] : null,
    wearerContrast !== "any"
      ? `${wearerContrast[0]!.toUpperCase()}${wearerContrast.slice(1)} contrast`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="The two questions" className="flex flex-col gap-2.5">
        <p className="text-sm text-muted">
          {profileBits.length ? (
            <>
              Dressing for {profileBits.join(" · ").toLowerCase()}.{" "}
              <Link to="/you" className="text-fg underline underline-offset-4">
                Your colors
              </Link>
            </>
          ) : (
            <>
              No season set.{" "}
              <Link to="/you" className="text-fg underline underline-offset-4">
                Find yours
              </Link>{" "}
              — the looks get sharper.
            </>
          )}
        </p>
        <Segmented
          label="Occasion"
          value={occasion}
          onChange={(v: Occasion) => setOccasion(v)}
          options={OCCASIONS.map((o) => ({ value: o, label: OCCASION_LABEL[o] }))}
        />
        <Segmented label="Weather" value={weather} onChange={setWeather} options={WEATHER_OPTIONS} />
        {savedCount > 0 ? (
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-medium text-fg">Closet</span>
            <button
              type="button"
              aria-pressed={closetMode}
              onClick={() => setClosetMode(!closetMode)}
              className={cn(
                "h-9 rounded-full px-3.5 text-sm shadow-[var(--shadow-border)] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                closetMode ? "bg-accent font-medium text-accent-fg" : "bg-surface text-muted hover:text-fg",
              )}
            >
              From my closet
            </button>
            {closetMode ? (
              <span className="text-[13px] text-muted">Only what you own</span>
            ) : null}
          </div>
        ) : null}
      </section>

      {current ? (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <header>
              <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
                {current.name}
              </h1>
              <p className="mt-1 text-sm text-muted">{current.mood}</p>
            </header>

            <div>
              <div className="mb-2 flex justify-end">
                <div
                  role="group"
                  aria-label="Look view"
                  className="flex gap-0.5 rounded-full bg-surface p-0.5 shadow-[var(--shadow-border)]"
                >
                  {(
                    [
                      { value: "chord", label: "Chord" },
                      { value: "figure", label: "Figure" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={view === option.value}
                      onClick={() => setView(option.value)}
                      className={cn(
                        "h-7 rounded-full px-3 text-[13px] transition-colors duration-150",
                        view === option.value
                          ? "bg-accent font-medium text-accent-fg"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {view === "chord" ? (
                <ChordFields look={current} />
              ) : (
                <div className="rounded-lg bg-mat p-2.5 sm:p-3">
                  <Mannequin look={current} className="mx-auto h-72 w-auto sm:h-80" />
                </div>
              )}
            </div>

            {current.whyLine ? (
              <p className="font-display text-[21px] font-medium leading-snug text-fg">
                {current.whyLine}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={previous} disabled={!canPrevious}>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button onClick={nextLook} className="flex-1 active:scale-[0.98]">
                <RefreshCw className="size-4" />
                Next look
              </Button>
              <Button variant="outline" onClick={() => toggleSave(current)}>
                {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setAskOpen(true)}>
                <Sparkles className="size-4" />
                Ask
              </Button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <section aria-label="The pieces">
              <h2 className="text-sm font-medium text-fg">The pieces</h2>
              <div className="mt-1">
                <PiecesList look={current} />
              </div>
            </section>
            <WhyBlock look={current} />
          </div>
        </div>
      ) : (
        <div className="h-64 animate-pulse rounded-lg bg-surface" />
      )}

      <AskSheet open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
