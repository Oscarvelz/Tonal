import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ratioParts } from "@/lib/color/engine";
import { OCCASION_LABEL, type Look } from "@/lib/color/types";
import { withViewTransition } from "@/lib/motion";
import { useDress } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({ component: SavedPage });

/**
 * Saved (2.0) — the looks held on this device, as lookbook plates: the chord
 * first, the name under it. Tap a plate to wear it. These same looks are the
 * wardrobe the closet mode dresses from.
 */
function SavedPage() {
  const saved = useDress((s) => s.saved);
  const adoptLook = useDress((s) => s.adoptLook);
  const removeSaved = useDress((s) => s.removeSaved);
  const closetMode = useDress((s) => s.closetMode);
  const setClosetMode = useDress((s) => s.setClosetMode);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[32px] font-medium leading-tight text-fg">Saved</h1>
        <p className="mt-1 text-sm text-muted">
          {saved.length
            ? `${saved.length} ${saved.length === 1 ? "look" : "looks"} held on this device. Tap one to wear it.`
            : "Nothing held yet."}
        </p>
      </header>

      {saved.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <div className="max-w-xl">
            <p className="font-medium text-fg">Dress from my closet</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              The generator refuses colors you don't own: a new look's 60% and 30% must sit
              close to a piece in one of these held looks. Twelve pieces that all agree beat a
              million theoretical looks.
            </p>
          </div>
          <Button
            variant={closetMode ? "primary" : "outline"}
            aria-pressed={closetMode}
            onClick={() => setClosetMode(!closetMode)}
          >
            {closetMode ? "On — closet only" : "Off"}
          </Button>
        </div>
      ) : null}

      {saved.length === 0 ? (
        <div className="flex flex-col items-start gap-4 py-6">
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            When a look is right, save it from Today. Held looks are also your wardrobe —
            Matiz can dress you from them alone.
          </p>
          <Button asChild>
            <Link to="/">Dress me</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {saved.map((look) => (
            <li
              key={look.id}
              className="relative overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]"
            >
              <button
                type="button"
                onClick={(e) => {
                  // The one shared-element journey (2.0): this plate's chord
                  // strip is named as Today's hero, then the wear navigates
                  // inside the transition.
                  const strip =
                    e.currentTarget.querySelector<HTMLElement>("[data-chord]");
                  if (strip) strip.style.viewTransitionName = "chord-hero";
                  withViewTransition(async () => {
                    adoptLook(look, true);
                    await navigate({ to: "/" });
                  });
                }}
                className="block w-full text-left transition-transform duration-150 ease-out active:scale-[0.99]"
                aria-label={`Wear ${look.name}`}
              >
                <PlateChord look={look} />
                <div className="px-4 py-3">
                  <p className="font-display text-xl font-medium leading-tight text-fg">
                    {look.name}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    {OCCASION_LABEL[look.occasion]} · {look.pieces.top.garment}
                    {look.strategyName ? ` · ${look.strategyName}` : ""}
                  </p>
                  {look.whyLine ? (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {look.whyLine}
                    </p>
                  ) : null}
                </div>
              </button>
              <button
                type="button"
                onClick={() => removeSaved(look.id)}
                aria-label={`Remove ${look.name}`}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-bg/85 text-muted shadow-[var(--shadow-border)] transition-colors hover:text-fg active:scale-95"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlateChord({ look }: { look: Look }) {
  const parts = ratioParts(look);
  const grows = [6, 3, 1] as const;
  return (
    <div data-chord className="flex h-20 gap-0.5 bg-mat p-1.5">
      {parts.map((part, i) => (
        <div
          key={part.key}
          className="rounded-[2px]"
          style={{ flexGrow: grows[i], background: part.piece.hex }}
        />
      ))}
    </div>
  );
}
