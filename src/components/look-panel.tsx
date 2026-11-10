import { Bookmark, BookmarkCheck, ChevronLeft, Pause, Play, RefreshCw } from "lucide-react";
import { dressingSteps, ratioParts } from "@/lib/color/engine";
import { textOn } from "@/lib/color/convert";
import {
  HARMONY_LABEL,
  OCCASION_LABEL,
  SOPHISTICATION_LABEL,
  type Look,
} from "@/lib/color/types";
import { Button } from "@/components/ui/button";
import { GarmentStack, Mannequin } from "@/components/mannequin";
import { cn } from "@/lib/utils";
import { useDress } from "@/lib/store";

export function RatioBar({ look }: { look: Look }) {
  const parts = ratioParts(look);
  return (
    <div className="overflow-hidden rounded-md shadow-[var(--shadow-border)]">
      <div className="flex h-10">
        {parts.map((part, i) => (
          <div
            key={part.key}
            className="relative flex items-end px-2 pb-1"
            style={{
              flexGrow: i === 0 ? 6 : i === 1 ? 3 : 1,
              background: part.piece.hex,
              color: textOn(part.piece.hex),
            }}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
              {part.label} · {part.piece.colorName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LookHero({
  look,
  ticking,
}: {
  look: Look;
  ticking?: boolean;
}) {
  const live = useDress((s) => s.live);
  const intervalSec = useDress((s) => s.intervalSec);
  const nextLook = useDress((s) => s.nextLook);
  const previous = useDress((s) => s.previous);
  const canPrevious = useDress((s) => s.index > 0);
  const setLive = useDress((s) => s.setLive);
  const toggleSave = useDress((s) => s.toggleSave);
  const saved = useDress((s) => s.isSaved(look.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[auto_minmax(0,1fr)] lg:gap-8">
        <div className="relative mx-auto w-fit sm:mx-0">
          <div
            key={look.id}
            className="look-enter rounded-xl bg-bg-elevated px-2 pt-2 shadow-[var(--shadow-border)]"
          >
            <Mannequin look={look} className="mx-auto h-72 w-auto sm:h-80" />
          </div>
          {live && ticking ? (
            <div className="absolute inset-x-3 -bottom-1 h-0.5 overflow-hidden rounded-full bg-border">
              <div
                key={look.id}
                className="progress-live h-full bg-accent"
                style={{ animationDuration: `${intervalSec}s` }}
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <header>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">
              {OCCASION_LABEL[look.occasion]} · {HARMONY_LABEL[look.harmony]} ·{" "}
              {SOPHISTICATION_LABEL[look.sophistication]}
              {look.source === "ai" ? " · Grok" : look.source === "engine" ? " · Engine" : " · Study"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl lg:text-4xl">
              {look.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{look.mood}</p>
            {look.strategyName ? (
              <p className="mt-1 text-sm text-fg">Strategy · {look.strategyName}</p>
            ) : null}
          </header>

          <div className="flex flex-wrap gap-2">
            <Button onClick={previous} variant="outline" disabled={!canPrevious}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button onClick={nextLook} variant="primary">
              <RefreshCw className="size-4" />
              Next look
            </Button>
            <Button
              onClick={() => setLive(!live)}
              variant={live ? "secondary" : "outline"}
              aria-pressed={live}
            >
              {live ? <Pause className="size-4" /> : <Play className="size-4" />}
              {live ? "Hold" : "Live"}
            </Button>
            <Button onClick={() => toggleSave(look)} variant="ghost">
              {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saved ? "Saved" : "Save"}
            </Button>
          </div>

          <RatioBar look={look} />
        </div>
      </div>

      <GarmentStack look={look} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            Dress in order
          </h3>
          <ol className="mt-3 space-y-2">
            {dressingSteps(look).map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-fg">
                <span className="mt-0.5 font-display text-base tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            Why it works
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg">{look.theory}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{look.wear}</p>
          {look.ruleTitles && look.ruleTitles.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {look.ruleTitles.map((title) => (
                <li
                  key={title}
                  className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted shadow-[var(--shadow-border)]"
                >
                  {title}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export function LookStrip({ look, onWear }: { look: Look; onWear?: () => void }) {
  const swatches = [
    look.pieces.layer && look.layerKind !== "none" ? look.pieces.layer.hex : null,
    look.pieces.top.hex,
    look.pieces.bottom.hex,
    look.pieces.shoes.hex,
  ].filter(Boolean) as string[];

  return (
    <button
      type="button"
      onClick={onWear}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl bg-surface p-3 text-left shadow-[var(--shadow-border)]",
        "transition-[transform,background-color] duration-150 ease-out hover:bg-surface-2 active:scale-[0.99]",
      )}
    >
      <div className="flex h-12 overflow-hidden rounded-md">
        {swatches.map((hex) => (
          <span key={hex} className="h-12 w-5" style={{ background: hex }} />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-fg">{look.name}</p>
        <p className="truncate text-xs text-muted">
          {OCCASION_LABEL[look.occasion]} · {look.pieces.top.garment}
          {look.strategyName ? ` · ${look.strategyName}` : ""}
        </p>
      </div>
    </button>
  );
}
