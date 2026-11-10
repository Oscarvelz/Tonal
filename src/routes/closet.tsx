import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LookStrip } from "@/components/look-panel";
import { Mannequin } from "@/components/mannequin";
import { OCCASION_LABEL } from "@/lib/color/types";
import { Button } from "@/components/ui/button";
import { useDress } from "@/lib/store";

export const Route = createFileRoute("/closet")({ component: ClosetPage });

function ClosetPage() {
  const saved = useDress((s) => s.saved);
  const adoptLook = useDress((s) => s.adoptLook);
  const removeSaved = useDress((s) => s.removeSaved);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
          Closet
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Held looks
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Saved on this device. Tap a look to hold it on the runway and dress from the
          checklist.
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="rounded-xl bg-surface px-5 py-10 text-center shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl">Nothing held yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Save from the live runway or a color study. Looks stay on this phone or tablet.
          </p>
          <Button className="mt-5" onClick={() => void navigate({ to: "/" })}>
            Open the runway
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {saved.map((look) => (
            <li
              key={look.id}
              className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
            >
              <button
                type="button"
                className="bg-bg-elevated px-6 pt-4"
                onClick={() => {
                  adoptLook(look, true);
                  void navigate({ to: "/" });
                }}
              >
                <Mannequin look={look} className="mx-auto h-64 w-auto" />
              </button>
              <div className="flex flex-col gap-3 p-4">
                <LookStrip
                  look={look}
                  onWear={() => {
                    adoptLook(look, true);
                    void navigate({ to: "/" });
                  }}
                />
                <p className="text-xs text-subtle">
                  {OCCASION_LABEL[look.occasion]} · {look.harmony}
                </p>
                <Button variant="ghost" onClick={() => removeSaved(look.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
