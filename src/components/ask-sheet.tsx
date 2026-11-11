import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { composeFromBrief, type BriefReading } from "@/lib/ai/local-look";
import {
  HARMONIES,
  HARMONY_LABEL,
  SOPHISTICATION_LABEL,
  SOPHISTICATIONS,
  type Harmony,
  type Sophistication,
} from "@/lib/color/types";
import { useDress } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/segmented";

/**
 * Ask Tonal (2.0) — the Studio brief as a sheet on Today. The interpreter
 * (local-look.ts) is unchanged from 1.1, including its honesty: what it read,
 * what it could not honor, and what it did not use are reported back in its
 * own words. Everything runs on the device.
 */
export function AskSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const generateOpts = useDress((s) => s.generateOpts);
  const adoptLook = useDress((s) => s.adoptLook);
  const storeSophistication = useDress((s) => s.sophistication);
  const storeHarmony = useDress((s) => s.harmony);

  const [notes, setNotes] = useState("");
  const [sophistication, setSophistication] = useState<Sophistication | "any">("any");
  const [harmony, setHarmony] = useState<Harmony | "any">("any");
  const [reading, setReading] = useState<BriefReading | null>(null);

  useEffect(() => {
    if (open) {
      setSophistication(storeSophistication);
      setHarmony(storeHarmony);
    }
  }, [open, storeSophistication, storeHarmony]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ask = () => {
    const base = { ...generateOpts(), sophistication, harmony };
    const { look, reading: read } = composeFromBrief(notes, base);
    adoptLook(look, true);
    setReading(read);
  };

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Ask Matiz">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fade-in absolute inset-0 h-full w-full bg-black/45"
      />
      <div className="sheet-in absolute inset-x-0 bottom-0 rounded-t-[10px] bg-bg-elevated px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-object)] sm:inset-x-6 sm:bottom-6 sm:rounded-[10px] lg:left-1/2 lg:right-auto lg:w-[36rem] lg:-translate-x-1/2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-fg">Ask Matiz</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Describe the brief in your own words. Matiz reads it here, on this device —
              nothing leaves the phone.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask Matiz"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-fg active:scale-95"
          >
            <X className="size-5" strokeWidth={1.7} />
          </button>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anniversary dinner Friday, navy and burgundy, nothing black, linen if possible…"
          className="mt-4 w-full resize-none rounded-md bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus:shadow-[var(--shadow-border-hover)]"
        />

        <div className="mt-4 flex flex-col gap-2.5">
          <Segmented
            label="Register"
            value={sophistication}
            onChange={setSophistication}
            options={[
              { value: "any" as const, label: "Any" },
              ...SOPHISTICATIONS.map((s) => ({
                value: s as Sophistication | "any",
                label: SOPHISTICATION_LABEL[s],
              })),
            ]}
          />
          <Segmented
            label="Harmony"
            value={harmony}
            onChange={setHarmony}
            options={[
              { value: "any" as const, label: "Any chord" },
              ...HARMONIES.map((h) => ({
                value: h as Harmony | "any",
                label: HARMONY_LABEL[h],
              })),
            ]}
          />
        </div>

        {reading ? (
          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-[13px] leading-relaxed">
            {reading.used.length ? (
              <p className="text-muted">
                Read as: <span className="text-fg">{reading.used.join(" · ")}</span>
              </p>
            ) : reading.hadBrief ? (
              <p className="text-muted">
                None of those words are in Matiz's vocabulary yet — this look follows the
                dials above.
              </p>
            ) : (
              <p className="text-muted">Read from the dials above — no brief words needed.</p>
            )}
            {reading.relaxed.length ? (
              <p className="text-muted">
                Could not fully honor: {reading.relaxed.join(", ")}.
              </p>
            ) : null}
            {reading.ignored.length ? (
              <p className="text-subtle">Not used: {reading.ignored.join(", ")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={ask} className="flex-1">
            {reading ? "Ask again" : "Ask Matiz"}
          </Button>
          {reading ? (
            <Button type="button" variant="outline" onClick={onClose}>
              Done — wear it
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
