import { useSyncExternalStore } from "react";

/**
 * The stage (2.0): Daylight or Evening. Both are achromatic — chrome chroma
 * is pinned at 0 in styles.css, so the only hue on screen belongs to the
 * clothes. First run follows the system (set pre-paint by the inline script
 * in spa/index.html); the header toggle flips it and the choice persists.
 */
export type Stage = "daylight" | "evening";

const KEY = "tonal-stage";

let stage: Stage =
  typeof document !== "undefined" && document.documentElement.dataset.stage === "evening"
    ? "evening"
    : "daylight";

const listeners = new Set<() => void>();

function apply(next: Stage) {
  stage = next;
  document.documentElement.dataset.stage = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode — the stage still flips for the session */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "evening" ? "#191919" : "#f2f2f2");
  listeners.forEach((fn) => fn());
}

export function setStage(next: Stage) {
  apply(next);
}

export function toggleStage() {
  apply(stage === "evening" ? "daylight" : "evening");
}

export function useStage(): Stage {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => stage,
  );
}
