/**
 * `t` remapped to run 0→1 across [from, to], clamped outside it.
 *
 * Lets several things ride one scroll progress value on their own staggered
 * windows, instead of each needing its own scroll listener and thresholds.
 *
 * A zero-width or inverted window degrades to a hard switch at `to` rather
 * than dividing by zero — the windows here are derived from measured layout,
 * so they can legitimately collapse for a frame before the first measurement
 * lands.
 */
export function phase(t: number, from: number, to: number) {
  if (to <= from) return t >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (t - from) / (to - from)));
}
