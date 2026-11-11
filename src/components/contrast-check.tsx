import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDress } from "@/lib/store";
import type { WearerContrast } from "@/lib/color/rules";

/**
 * The ten-second check (1.3) — the fast front door, ahead of the drapes.
 * Hair against skin: high, medium, or low. It reads no photos and guesses
 * nothing; the wearer answers from a mirror, in daylight.
 *
 * The pairs (2.3) are calibrated on the app's own converters, anchored on
 * true black hair — #171310, Munsell N 1/, the majority case. One black,
 * three skins form the ladder (ΔL* 76 / 46 / 27 — bands: high ≥ 55,
 * medium 30–54, low ≤ 29), and Low carries a second pair for its fair
 * line (ΔL* 16). Contrast is a value gap, not a colour: the same black
 * hair reads high, medium and low depending on the skin beside it.
 * One definition, shared by this check and the first-run setup.
 */
export type ContrastPair = { hair: string; skin: string };

export const CONTRAST_OPTIONS: Array<{
  value: WearerContrast;
  label: string;
  pairs: ContrastPair[];
  /** The hair↔skin distance in Munsell value steps. */
  gap: string;
  line: string;
}> = [
  {
    value: "high",
    label: "High",
    pairs: [{ hair: "#171310", skin: "#f0c69c" }],
    gap: "value gap · 7 steps",
    line: "The jump is obvious across the room — dark hair against light skin, or bright eyes in a deep face.",
  },
  {
    value: "medium",
    label: "Medium",
    pairs: [{ hair: "#171310", skin: "#a5713f" }],
    gap: "value gap · 4 steps",
    line: "Hair and skin clearly differ, but gently — a step, not a leap.",
  },
  {
    value: "low",
    label: "Low",
    pairs: [
      { hair: "#171310", skin: "#6b4423" },
      { hair: "#b99f7f", skin: "#ecc9a2" },
    ],
    gap: "value gap · 1–2 steps",
    line: "Hair and skin sit close — fair on fair, deep on deep. The face reads as one tone.",
  },
];

/**
 * A pair, presented as a specimen: hair and skin as square chips on the
 * mat plate (so the colours read identically on both stages), each half
 * named in the mono data voice. Low stacks its two lines.
 */
export function ContrastPlates({ pairs }: { pairs: ContrastPair[] }) {
  return (
    <span className="flex flex-col gap-2" aria-hidden>
      {pairs.map((pair, i) => (
        <span key={i} className="block">
          <span className="flex gap-0.5 rounded-lg bg-mat p-1.5">
            <span className="h-10 flex-1 rounded-[2px]" style={{ background: pair.hair }} />
            <span className="h-10 flex-1 rounded-[2px]" style={{ background: pair.skin }} />
          </span>
          <span className="mt-1 flex font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
            <span className="flex-1">Hair</span>
            <span className="flex-1">Skin</span>
          </span>
        </span>
      ))}
    </span>
  );
}

export function ContrastCheck() {
  const wearerContrast = useDress((s) => s.wearerContrast);
  const setWearerContrast = useDress((s) => s.setWearerContrast);

  return (
    <div className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-sm font-medium text-fg">The ten-second check</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Before the twelve seasons, the older question: how far apart are your hair and your
        skin? That distance is your contrast, and the clothes should mirror it — high contrast
        gets light against dark, low contrast stays inside a narrow value range. Mirror,
        daylight, ten seconds. Any gender, any skin tone.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {CONTRAST_OPTIONS.map((option) => {
          const on = wearerContrast === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setWearerContrast(option.value);
                toast.success(
                  `Face contrast: ${option.label} — the generator mirrors it from here.`,
                );
              }}
              className={cn(
                "rounded-lg px-3 py-3 text-left shadow-[var(--shadow-border)] transition-colors duration-150",
                on ? "bg-surface-2" : "bg-bg-elevated hover:bg-surface-2",
              )}
            >
              <ContrastPlates pairs={option.pairs} />
              <span className="mt-2.5 block font-display text-lg font-medium text-fg">
                {option.label}
                {on ? " · set" : ""}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                {option.line}
              </span>
              <span className="mt-2 block font-mono text-[11px] text-subtle">{option.gap}</span>
            </button>
          );
        })}
      </div>
      {wearerContrast !== "any" ? (
        <button
          type="button"
          onClick={() => setWearerContrast("any")}
          className="mt-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Clear the check
        </button>
      ) : null}
      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-subtle">
        A phone selfie is a bad test — screens shift color and indoor light lies. Daylight and
        real cloth next to the face are the real test; the drapes below are the deeper one.
      </p>
    </div>
  );
}
