import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDress } from "@/lib/store";
import type { WearerContrast } from "@/lib/color/rules";

/**
 * The ten-second check (1.3) — the fast front door, ahead of the drapes.
 * Hair against skin: high, medium, or low. It reads no photos and guesses
 * nothing; the wearer answers from a mirror, in daylight.
 */
const OPTIONS: Array<{
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
    line: "The jump is obvious across the room — dark hair against light skin, or bright eyes in a deep face.",
  },
  {
    value: "medium",
    label: "Medium",
    hair: "#5a4030",
    skin: "#c89878",
    line: "Hair and skin clearly differ, but gently — a step, not a leap.",
  },
  {
    value: "low",
    label: "Low",
    hair: "#8a7360",
    skin: "#a8805f",
    line: "Hair and skin sit close — fair on fair, deep on deep. The face reads as one tone.",
  },
];

export function ContrastCheck() {
  const wearerContrast = useDress((s) => s.wearerContrast);
  const setWearerContrast = useDress((s) => s.setWearerContrast);

  return (
    <div className="mt-6 rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
        The ten-second check
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Before the twelve seasons, the older question: how far apart are your hair and your
        skin? That distance is your contrast, and the clothes should mirror it — high contrast
        gets light against dark, low contrast stays inside a narrow value range. Mirror,
        daylight, ten seconds. Any gender, any skin tone.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
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
              <span className="flex overflow-hidden rounded-md">
                <span className="h-9 flex-1" style={{ background: option.hair }} />
                <span className="h-9 flex-1" style={{ background: option.skin }} />
              </span>
              <span className="mt-2 block font-display text-lg font-medium text-fg">
                {option.label}
                {on ? " · set" : ""}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                {option.line}
              </span>
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
