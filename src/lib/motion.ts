/**
 * Motion gates (2.0) — reduced motion is a designed mode, not an accident:
 * CSS handles transitions/animations globally in styles.css; JS-driven
 * motion (view transitions) checks here first.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Run a navigation inside a view transition when the engine supports it
 *  and the wearer hasn't asked for stillness; otherwise just navigate. */
export function withViewTransition(go: () => void | Promise<unknown>) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<unknown>) => unknown;
  };
  if (typeof doc.startViewTransition === "function" && !prefersReducedMotion()) {
    doc.startViewTransition(go);
  } else {
    void go();
  }
}
