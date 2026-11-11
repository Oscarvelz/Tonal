import { useRef, type MouseEvent, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

/**
 * The quiet segmented row (2.0) — replaces the chip soup. One track, options
 * in sentence case, selection by value inversion (ink on the stage), the
 * SSENSE pattern. Scrolls sideways rather than wrapping when options are
 * many, so the row's height never changes.
 *
 * A drag is a scroll, never a tap (2.1.1, Oscar's order): moving through
 * the row — sideways to reach a clipped option, or down the page — must
 * not change the selection. The row remembers where a gesture started and
 * how far it had scrolled; a click that follows real movement is
 * swallowed before it can reach a button.
 */
const TAP_SLOP_PX = 8;

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
  const trackRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<{ x: number; y: number; scrollLeft: number; dragged: boolean } | null>(
    null,
  );

  const onPointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    gestureRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: trackRef.current?.scrollLeft ?? 0,
      dragged: false,
    };
  };

  const onPointerMoveCapture = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (
      Math.abs(event.clientX - gesture.x) > TAP_SLOP_PX ||
      Math.abs(event.clientY - gesture.y) > TAP_SLOP_PX
    ) {
      gesture.dragged = true;
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    const track = trackRef.current;
    const rowScrolled =
      gesture !== null && track !== null && Math.abs(track.scrollLeft - gesture.scrollLeft) > 2;
    if (gesture?.dragged || rowScrolled) {
      event.preventDefault();
      event.stopPropagation();
    }
    gestureRef.current = null;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm font-medium text-fg">{label}</span>
      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        onPointerDownCapture={onPointerDownCapture}
        onPointerMoveCapture={onPointerMoveCapture}
        onClickCapture={onClickCapture}
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
