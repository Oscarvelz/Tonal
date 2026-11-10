import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DRAPE_STEP_PROMPTS,
  DRAPE_STEP_TITLES,
  KEY_DRAPES,
  LEAD_DRAPES,
  METAL_DRAPES,
  type DrapeOption,
  type Family,
  type Temperature,
} from "@/lib/color/diagnosis";
import { SEASON_GUIDES } from "@/lib/color/theory";
import { PERSONAL_SEASON_LABEL, type PersonalSeason } from "@/lib/color/types";
import { useDress } from "@/lib/store";
import { cn } from "@/lib/utils";

function DrapeCard({
  option,
  onPick,
}: {
  option: DrapeOption;
  onPick: () => void;
}) {
  const [a, b] = option.hexes;
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex-1 overflow-hidden rounded-xl bg-surface text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.98]"
    >
      <span
        className="block h-24"
        style={{
          background: b
            ? `linear-gradient(120deg, ${a} 0 55%, ${b} 55% 100%)`
            : a,
        }}
      />
      <span className="block px-3 py-2.5">
        <span className="block text-sm font-medium text-fg">{option.label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.hint}</span>
      </span>
    </button>
  );
}

export function SeasonFinder() {
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const current = useDress((s) => s.personalSeason);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [temp, setTemp] = useState<Temperature | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [result, setResult] = useState<PersonalSeason | null>(null);

  function reset() {
    setStep(0);
    setTemp(null);
    setFamily(null);
    setResult(null);
  }

  if (!open) {
    return (
      <div className="mt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Find your season — three drapes
        </Button>
        {current !== "any" ? (
          <p className="mt-2 text-xs text-subtle">
            Currently set to {PERSONAL_SEASON_LABEL[current]}.
          </p>
        ) : null}
      </div>
    );
  }

  const guide = result ? SEASON_GUIDES[result] : null;

  return (
    <div className="mt-5 rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      {result && guide ? (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">
            Your season
          </p>
          <h3 className="mt-1 font-display text-3xl font-medium">
            {PERSONAL_SEASON_LABEL[result]}
          </h3>
          <p className="mt-2 text-sm text-fg">{guide.chroma}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{guide.note}</p>
          <p className="mt-3 text-sm text-fg">Wear {guide.best}.</p>
          <p className="mt-1 text-sm text-muted">Skip {guide.avoid}.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-subtle">{guide.metals}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                setPersonalSeason(result);
                toast(`Season set to ${PERSONAL_SEASON_LABEL[result]}. The generator now dresses for it.`);
                setOpen(false);
              }}
            >
              Use my season
            </Button>
            <Button type="button" variant="secondary" onClick={reset}>
              Start over
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">
            {DRAPE_STEP_TITLES[step]}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {step === 0
              ? "Three drapes, three dimensions: temperature, family, and the trait that leads. Judge each against your face in daylight — the right one makes the skin look clearer. A full analysis drapes dozens of cloths; this is the honest short road."
              : DRAPE_STEP_PROMPTS[step]}
          </p>
          <div className={cn("mt-4 flex gap-3", step === 2 && "flex-col sm:flex-row")}>
            {step === 0
              ? METAL_DRAPES.map((d) => (
                  <DrapeCard
                    key={d.id}
                    option={d}
                    onPick={() => {
                      setTemp(d.temp);
                      setStep(1);
                    }}
                  />
                ))
              : null}
            {step === 1 && temp
              ? KEY_DRAPES[temp].map((d) => (
                  <DrapeCard
                    key={d.id}
                    option={d}
                    onPick={() => {
                      setFamily(d.family);
                      setStep(2);
                    }}
                  />
                ))
              : null}
            {step === 2 && family
              ? LEAD_DRAPES[family].map((d) => (
                  <DrapeCard
                    key={d.id}
                    option={d}
                    onPick={() => setResult(d.season)}
                  />
                ))
              : null}
          </div>
          <div className="mt-4 flex gap-2">
            {step > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
