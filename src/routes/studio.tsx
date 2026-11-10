import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FilterBar } from "@/components/filter-bar";
import { LookHero } from "@/components/look-panel";
import { generateAiLook } from "@/lib/ai/generate-look";
import { generateLook } from "@/lib/color/engine";
import type { Look } from "@/lib/color/types";
import { Button } from "@/components/ui/button";
import { useDress } from "@/lib/store";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const ask = useServerFn(generateAiLook);
  const adoptLook = useDress((s) => s.adoptLook);
  const generateOpts = useDress((s) => s.generateOpts);
  const gender = useDress((s) => s.gender);
  const occasion = useDress((s) => s.occasion);
  const sophistication = useDress((s) => s.sophistication);
  const harmony = useDress((s) => s.harmony);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [look, setLook] = useState<Look | null>(null);

  async function onGrok() {
    if (busy) return;
    setBusy(true);
    try {
      const result = await ask({
        data: {
          gender,
          occasion,
          sophistication,
          harmony,
          notes: notes.trim() || undefined,
        },
      });
      if (result.ok) {
        setLook(result.look);
        adoptLook(result.look, true);
        toast("Grok dressed a look. Held on the runway.");
      } else {
        toast(result.error);
      }
    } catch {
      toast("Grok could not be reached. Try a local look.");
    } finally {
      setBusy(false);
    }
  }

  function onLocal() {
    const next = generateLook(generateOpts());
    setLook(next);
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
          The live runway on Dress is the local engine — it cycles without spending AI.
          Here, Grok composes a single sophisticated look from your brief. Use it when you
          want a mind, not a shuffle.
        </p>
      </header>

      <FilterBar extra />

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void onGrok();
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
            {busy ? "Composing…" : "Ask Grok"}
          </Button>
          <Button type="button" variant="secondary" onClick={onLocal} disabled={busy}>
            Local engine
          </Button>
        </div>
        <p className="text-xs text-subtle">One look per tap. Grok is not on a timer.</p>
      </form>

      {look ? <LookHero look={look} /> : null}
    </div>
  );
}
