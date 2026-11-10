import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FilterBar } from "@/components/filter-bar";
import { LookHero } from "@/components/look-panel";
import { composeFromBrief } from "@/lib/ai/local-look";
import type { BriefReading } from "@/lib/ai/local-look";
import { generateLook } from "@/lib/color/engine";
import type { Look } from "@/lib/color/types";
import { Button } from "@/components/ui/button";
import { useDress } from "@/lib/store";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const adoptLook = useDress((s) => s.adoptLook);
  const generateOpts = useDress((s) => s.generateOpts);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [look, setLook] = useState<Look | null>(null);
  const [reading, setReading] = useState<BriefReading | null>(null);

  async function onAsk() {
    if (busy) return;
    setBusy(true);
    try {
      // Let the button paint its composing state before the search runs.
      await new Promise((r) => setTimeout(r, 30));
      const { look: next, reading: read } = composeFromBrief(
        notes.trim(),
        generateOpts(),
      );
      setLook(next);
      setReading(read);
      adoptLook(next, true);
      toast("Tonal dressed a look. Held on the runway.");
    } finally {
      setBusy(false);
    }
  }

  function onLocal() {
    const next = generateLook(generateOpts());
    setLook(next);
    setReading(null);
    adoptLook(next, true);
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
          Studio
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Ask for a chord
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          The live runway on Dress is the local engine — it cycles on its own. Here,
          Tonal reads your brief itself — the occasion, the season, colors and
          fabrics by name — and composes a single look from it. Nothing leaves
          this device; there is no AI to reach.
        </p>
      </header>

      <FilterBar extra />

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void onAsk();
        }}
      >
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle" htmlFor="brief">
          Brief
        </label>
        <textarea
          id="brief"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={240}
          rows={3}
          placeholder="Dinner in a warm room. No black. I have camel loafers."
          className="w-full resize-none rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            <Sparkles className="size-4" />
            {busy ? "Composing…" : "Ask Tonal"}
          </Button>
          <Button type="button" variant="secondary" onClick={onLocal} disabled={busy}>
            Local engine
          </Button>
        </div>
        <p className="text-xs text-subtle">One look per tap. Composed here, on this device.</p>
        {reading ? (
          <div className="flex flex-col gap-1 text-xs leading-relaxed">
            {reading.used.length ? (
              <p className="text-muted">
                Read as: <span className="text-fg">{reading.used.join(" · ")}</span>
              </p>
            ) : reading.hadBrief ? (
              <p className="text-muted">
                None of those words are in Tonal's vocabulary yet — this look follows the dials above.
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
      </form>

      {look ? <LookHero look={look} /> : null}
    </div>
  );
}
