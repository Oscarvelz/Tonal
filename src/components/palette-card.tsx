import { textOn } from "@/lib/color/convert";
import {
  HARMONY_LABEL,
  OCCASION_LABEL,
  SOPHISTICATION_LABEL,
  type Palette,
} from "@/lib/color/types";
import { Button } from "@/components/ui/button";
import { useDress } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";

export function PaletteCard({ palette }: { palette: Palette }) {
  const applyPalette = useDress((s) => s.applyPalette);
  const navigate = useNavigate();
  const colors = [
    palette.colors.dominant,
    palette.colors.secondary,
    palette.colors.accent,
    palette.colors.optional,
  ].filter(Boolean);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex h-28 sm:h-32">
        {colors.map((c, i) => (
          <div
            key={`${c!.hex}-${i}`}
            className="flex flex-1 flex-col justify-end px-2 pb-2"
            style={{
              background: c!.hex,
              color: textOn(c!.hex),
              flexGrow: i === 0 ? 5 : i === 1 ? 3 : 2,
            }}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] opacity-90">
              {c!.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {HARMONY_LABEL[palette.harmony]} · {SOPHISTICATION_LABEL[palette.sophistication]}
          </p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">{palette.name}</h3>
          <p className="mt-1 text-sm text-muted">{palette.mood}</p>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-fg">{palette.theory}</p>
        <p className="text-xs text-subtle">
          {palette.occasions.map((o) => OCCASION_LABEL[o]).join(" · ")}
        </p>
        <div className="mt-auto pt-1">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              applyPalette(palette.id);
              void navigate({ to: "/" });
            }}
          >
            Wear this study
          </Button>
        </div>
      </div>
    </article>
  );
}
