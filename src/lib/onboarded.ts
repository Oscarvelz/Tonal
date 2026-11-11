import { useSyncExternalStore } from "react";

/**
 * Whether the first-run setup has been seen (2.0). Its own key, deliberately
 * outside the frozen tonal-v1 slice: this is face state, not dress state.
 */
const KEY = "tonal-seen";

let seen =
  typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";

const listeners = new Set<() => void>();

export function markSeen() {
  seen = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* private mode — it simply offers again next visit */
  }
  listeners.forEach((fn) => fn());
}

export function useSeen(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => seen,
  );
}
