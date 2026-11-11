import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChordFields } from "@/components/chord";
import { CONTRAST_OPTIONS, ContrastPlates } from "@/components/contrast-check";
import { SEASON_REGIONS } from "@/lib/color/munsell";
import { SEASON_STRIPS } from "@/lib/color/season-strips";
import { SEASON_GUIDES } from "@/lib/color/theory";
import {
  PERSONAL_SEASON_LABEL,
  PERSONAL_SEASONS,
  type Gender,
  type PersonalSeason,
} from "@/lib/color/types";
import type { WearerContrast } from "@/lib/color/rules";
import { markSeen } from "@/lib/onboarded";
import { useDress } from "@/lib/store";
import { cn } from "@/lib/utils";

/** First-run lines: the terse cut of the shared check's copy. */
const FIRST_RUN_LINES: Record<WearerContrast, string> = {
  high: "The jump is obvious across the room.",
  medium: "Hair and skin clearly differ, but gently.",
  low: "Hair and skin sit close — the face reads as one tone.",
};

const SEASON_FAMILIES = [
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "autumn", label: "Autumn" },
  { key: "winter", label: "Winter" },
] as const;

function kindLabel(season: PersonalSeason): string {
  const kind = SEASON_REGIONS[season].kind;
  return kind === "warm"
    ? "warm"
    : kind === "cool"
      ? "cool"
      : kind === "warm-neutral"
        ? "warm-leaning"
        : "cool-leaning";
}

/**
 * First run (2.0; premium pass 2.3) — under thirty seconds, skippable at
 * every step: wardrobe → the ten-second contrast check → season
 * (optional). Each answer dresses the look waiting behind the setup,
 * because the setters regenerate — and the done screen finally shows
 * that look. A tap registers before the page turns: the chosen card
 * inverts for a beat on the house grammar, then the step advances.
 */
export function FirstRun() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const setGender = useDress((s) => s.setGender);
  const setWearerContrast = useDress((s) => s.setWearerContrast);
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const gender = useDress((s) => s.gender);
  const wearerContrast = useDress((s) => s.wearerContrast);
  const personalSeason = useDress((s) => s.personalSeason);
  const current = useDress((s) => s.current);

  const done = step >= 3;

  /** Let the choice land — invert, hold a beat, then apply and advance. */
  const choose = (key: string, apply: () => void, next: number) => {
    if (picked !== null) return;
    setPicked(key);
    window.setTimeout(() => {
      apply();
      setStep(next);
      setPicked(null);
    }, 300);
  };

  const recap = [
    gender === "men" ? "Men" : "Women",
    wearerContrast !== "any" ? `${wearerContrast} contrast` : "contrast open",
    personalSeason !== "any" ? PERSONAL_SEASON_LABEL[personalSeason] : "season open",
  ].join(" · ");

  return (
    <div className="fade-in fixed inset-0 z-50 overflow-y-auto bg-bg" role="dialog" aria-modal="true" aria-label="Welcome to Matiz">
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold uppercase tracking-[0.3em] text-fg">Matiz</p>
          {!done ? (
            <button
              type="button"
              onClick={markSeen}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              Skip setup
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-fg" : "bg-surface-2",
              )}
            />
          ))}
        </div>

        {step === 0 ? (
          <div key="step-0" className="fade-in mt-6 flex flex-col gap-4">
            <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
              Who are we dressing?
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {(["men", "women"] as Gender[]).map((g, i) => {
                const on = picked === g;
                return (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={gender === g}
                    onClick={() => choose(g, () => setGender(g), 1)}
                    className={cn(
                      "flex min-h-[148px] flex-col justify-between rounded-lg px-4 py-4 text-left shadow-[var(--shadow-border)] transition-all duration-300 ease-out active:scale-[0.98]",
                      on ? "bg-fg shadow-[var(--shadow-border-hover)]" : "bg-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] transition-colors duration-300",
                        on ? "text-bg/50" : "text-subtle",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span className="block">
                      <span
                        className={cn(
                          "block font-display text-[22px] font-medium transition-colors duration-300",
                          on ? "text-bg" : "text-fg",
                        )}
                      >
                        {g === "men" ? "Men" : "Women"}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[13px] leading-snug transition-colors duration-300",
                          on ? "text-bg/70" : "text-muted",
                        )}
                      >
                        Same colors, cut for {g === "men" ? "men" : "women"}.
                      </span>
                      <span
                        className={cn(
                          "mt-2.5 block font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] transition-colors duration-300",
                          on ? "text-bg/50" : "text-subtle",
                        )}
                      >
                        tops · bottoms
                        <br />
                        layers · shoes
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Change it any time in You.
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <div key="step-1" className="fade-in mt-6 flex flex-col gap-4">
            <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
              How far apart are your hair and your skin?
            </h1>
            <p className="-mt-2 text-sm leading-relaxed text-muted">
              Mirror, daylight, ten seconds. The clothes should mirror that distance.
            </p>
            <div className="flex flex-col gap-2.5">
              {CONTRAST_OPTIONS.map((option) => {
                const on = picked === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      choose(option.value, () => setWearerContrast(option.value), 2)
                    }
                    className={cn(
                      "rounded-lg px-3.5 py-3.5 text-left shadow-[var(--shadow-border)] transition-all duration-300 ease-out active:scale-[0.99]",
                      on ? "bg-fg shadow-[var(--shadow-border-hover)]" : "bg-surface",
                    )}
                  >
                    <ContrastPlates pairs={option.pairs} />
                    <span
                      className={cn(
                        "mt-2.5 block font-display text-[17px] font-medium transition-colors duration-300",
                        on ? "text-bg" : "text-fg",
                      )}
                    >
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[13px] transition-colors duration-300",
                        on ? "text-bg/70" : "text-muted",
                      )}
                    >
                      {FIRST_RUN_LINES[option.value]}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block font-mono text-[11px] transition-colors duration-300",
                        on ? "text-bg/50" : "text-subtle",
                      )}
                    >
                      {option.gap}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="self-start text-sm text-muted underline underline-offset-4 transition-colors hover:text-fg"
            >
              Not sure — skip
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div key="step-2" className="fade-in mt-6 flex flex-col gap-4">
            <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
              Your season, if you know it
            </h1>
            <p className="-mt-2 text-sm leading-relaxed text-muted">
              Optional. Matiz's twelve regions, after Munsell — each card wears its
              season's own colors. Don't know it? Skip — three drapes in You (under
              Your colors) find it properly.
            </p>
            <div className="flex flex-col">
              {SEASON_FAMILIES.map((family, fi) => (
                <div key={family.key} className={fi === 0 ? undefined : "mt-5"}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                    {family.label}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {PERSONAL_SEASONS.filter(
                      (p: PersonalSeason) => SEASON_GUIDES[p].family === family.key,
                    ).map((p: PersonalSeason) => {
                      const on = picked === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => choose(p, () => setPersonalSeason(p), 3)}
                          className={cn(
                            "rounded-lg px-3 py-3 text-left shadow-[var(--shadow-border)] transition-all duration-300 ease-out active:scale-[0.98]",
                            on ? "bg-fg shadow-[var(--shadow-border-hover)]" : "bg-surface",
                          )}
                        >
                          <span
                            className={cn(
                              "block font-display text-[17px] font-medium transition-colors duration-300",
                              on ? "text-bg" : "text-fg",
                            )}
                          >
                            {PERSONAL_SEASON_LABEL[p]}
                          </span>
                          <span className="mt-2 flex gap-0.5 rounded-lg bg-mat p-1.5" aria-hidden>
                            {SEASON_STRIPS[p].map((hex) => (
                              <span
                                key={hex}
                                className="h-9 flex-1 rounded-[2px]"
                                style={{ background: hex }}
                              />
                            ))}
                          </span>
                          <span
                            className={cn(
                              "mt-2 block font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-300",
                              on ? "text-bg/50" : "text-subtle",
                            )}
                          >
                            {kindLabel(p)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="self-start text-sm text-muted underline underline-offset-4 transition-colors hover:text-fg"
            >
              Decide later
            </button>
          </div>
        ) : null}

        {done ? (
          <div key="step-3" className="fade-in mt-10 flex flex-col items-start gap-4">
            <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
              Your first look is ready.
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
              {recap}
            </p>
            {current ? (
              <div className="w-full">
                <ChordFields look={current} />
                <p className="mt-3 font-display text-[21px] leading-snug text-fg">
                  {current.whyLine}
                </p>
              </div>
            ) : null}
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Two questions each morning — occasion and weather. The chord does the rest, and
              it never changes until you ask.
            </p>
            <Button onClick={markSeen} className="mt-2">
              See it
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
