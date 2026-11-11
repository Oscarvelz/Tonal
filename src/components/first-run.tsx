import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const CONTRAST_OPTIONS: Array<{
  value: WearerContrast;
  label: string;
  hair: string;
  skin: string;
  line: string;
}> = [
  {
    value: "high",
    label: "High",
    hair: "#2a1a12",
    skin: "#eec9a0",
    line: "The jump is obvious across the room.",
  },
  {
    value: "medium",
    label: "Medium",
    hair: "#5a4030",
    skin: "#c89878",
    line: "Hair and skin clearly differ, but gently.",
  },
  {
    value: "low",
    label: "Low",
    hair: "#8a7360",
    skin: "#a8805f",
    line: "Hair and skin sit close — the face reads as one tone.",
  },
];

/**
 * First run (2.0) — under thirty seconds, skippable at every step:
 * wardrobe → the ten-second contrast check → season (optional). Each answer
 * dresses the look waiting behind the setup, because the setters regenerate.
 */
export function FirstRun() {
  const [step, setStep] = useState(0);
  const setGender = useDress((s) => s.setGender);
  const setWearerContrast = useDress((s) => s.setWearerContrast);
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const gender = useDress((s) => s.gender);

  const done = step >= 3;

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

        {!done ? (
          <p className="mt-8 font-mono text-[11px] text-subtle">Step {step + 1} of 3</p>
        ) : null}

        {step === 0 ? (
          <div className="mt-2 flex flex-col gap-4">
            <h1 className="font-display text-[28px] font-medium leading-tight text-fg">
              Who are we dressing?
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {(["men", "women"] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={gender === g}
                  onClick={() => {
                    setGender(g);
                    setStep(1);
                  }}
                  className={cn(
                    "h-14 rounded-lg bg-surface text-[15px] font-medium shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.97]",
                    gender === g ? "text-fg shadow-[var(--shadow-border-hover)]" : "text-muted",
                  )}
                >
                  {g === "men" ? "Men" : "Women"}
                </button>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Same colors, different wardrobe. Change it any time in You.
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-2 flex flex-col gap-4">
            <h1 className="font-display text-[28px] font-medium leading-tight text-fg">
              How far apart are your hair and your skin?
            </h1>
            <p className="-mt-2 text-sm leading-relaxed text-muted">
              Mirror, daylight, ten seconds. The clothes should mirror that distance.
            </p>
            <div className="flex flex-col gap-2.5">
              {CONTRAST_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setWearerContrast(option.value);
                    setStep(2);
                  }}
                  className="rounded-lg bg-surface px-3.5 py-3 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <span className="flex h-8 overflow-hidden rounded-[4px]">
                    <span className="h-full flex-1" style={{ background: option.hair }} />
                    <span className="h-full flex-1" style={{ background: option.skin }} />
                  </span>
                  <span className="mt-2 block text-[15px] font-medium text-fg">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">{option.line}</span>
                </button>
              ))}
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
          <div className="mt-2 flex flex-col gap-4">
            <h1 className="font-display text-[28px] font-medium leading-tight text-fg">
              Your season, if you know it
            </h1>
            <p className="-mt-2 text-sm leading-relaxed text-muted">
              Optional. Matiz's twelve regions, after Munsell. Don't know it? Skip — three
              drapes in You (under Your colors) find it properly.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PERSONAL_SEASONS.map((p: PersonalSeason) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPersonalSeason(p);
                    setStep(3);
                  }}
                  className="h-10 rounded-full bg-surface px-4 text-sm text-fg shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.97]"
                >
                  {PERSONAL_SEASON_LABEL[p]}
                </button>
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
          <div className="mt-16 flex flex-col items-start gap-4">
            <h1 className="font-display text-[32px] font-medium leading-tight text-fg">
              Your first look is ready.
            </h1>
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
