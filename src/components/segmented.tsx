import { cn } from "@/lib/utils";

/**
 * The quiet segmented row (2.0) — replaces the chip soup. One track, options
 * in sentence case, selection by value inversion (ink on the stage), the
 * SSENSE pattern. Scrolls sideways rather than wrapping when options are
 * many, so the row's height never changes.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm font-medium text-fg">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="chip-scroll -mx-1 flex flex-1 gap-0.5 overflow-x-auto rounded-full bg-surface p-0.5 shadow-[var(--shadow-border)]"
      >
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                on ? "bg-accent font-medium text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
