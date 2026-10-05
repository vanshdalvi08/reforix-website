/** Shared helpers for the landing page's motion code. Browser-only: call from effects. */

export const READY_EVENT = "rx:ready";

/** Added to <html> to stop the page scrolling (intro, mobile menu). */
export const LOCK_CLASS = "rx-lock";

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Matches the phone breakpoint in landing.css. */
export const isNarrow = (): boolean => window.innerWidth <= 820;

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/** True once the intro has finished (or was skipped). */
export const isIntroDone = (): boolean =>
  document.documentElement.dataset.rxReady === "1";

/** Tells the rest of the page that the intro is out of the way. */
export const markIntroDone = (): void => {
  if (isIntroDone()) return;
  document.documentElement.dataset.rxReady = "1";
  window.dispatchEvent(new Event(READY_EVENT));
};
