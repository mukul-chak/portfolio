export type NameMark = {
  /** Device pixel ratio the offsets were snapped to; callers animating a mark
   *  snap to this too, so a moving mark stays as crisp as a parked one. */
  dpr: number;
  /** Stem width, taken from the M's own uprights. */
  strokeWidth: number;
  /** Cap height — the strokes occupy exactly the M's cap band. */
  capHeight: number;
  /** Left stroke, from the text origin. Sits on the M's left upright, and
   *  never moves: it's what keeps the name's left edge locked to the body
   *  name's below it. */
  leftX: number;
  /** Right stroke at rest — the M's right upright, so the pair reads as the
   *  letter's skeleton. */
  rightRestX: number;
  /** Right stroke at full scroll — the far edge of the name's own ink. */
  rightOpenX: number;
};

/**
 * Derives the two header marks from the typeface itself rather than from
 * hand-picked numbers: at rest they ARE the M's two uprights, same width,
 * same cap band, same positions. Change the font, the size or the weight and
 * the marks follow, because nothing here is a constant.
 *
 * The uprights can't come from font metrics — only the rasterised glyph knows
 * where they fall — so this scans a drawn M for columns inked across (nearly)
 * the full cap height. The M's two diagonals are never inked for more than a
 * fraction of any single column, which is exactly what separates them out.
 *
 * `el` supplies the font; it only needs the same computed font as the name.
 *
 * Everything returned is snapped to whole device pixels. The two uprights are
 * the same width in the typeface, but at their raw sub-pixel offsets (1.3 and
 * 12.5) they land on different pixel phases, so the browser antialiases one
 * heavier than the other and they read as two different weights. Snapping
 * costs a few tenths of a pixel of fidelity to the glyph and buys two marks
 * that are visibly identical, which is the whole point of them.
 */
export function measureNameMark(el: HTMLElement, name: string): NameMark | null {
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize);
  if (!size) return null;

  // 10x oversample. The uprights are ~2.4px at render size, so scanning whole
  // pixel columns there would quantise the width by nearly half of it.
  const S = 10;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(size * S * 2);
  canvas.height = Math.ceil(size * S * 3);
  const g = canvas.getContext("2d", { willReadFrequently: true });
  if (!g) return null;

  // Set after sizing: assigning width/height resets the whole context state.
  g.font = `${cs.fontStyle} ${cs.fontWeight} ${size * S}px ${cs.fontFamily}`;
  g.textBaseline = "alphabetic";
  g.fillStyle = "#000";

  // Ink edge, not advance width — the trailing "i" carries a right side
  // bearing, and landing the stroke on the advance would leave it floating
  // a pixel clear of the letter it's supposed to close on.
  const nameInkRight = g.measureText(name).actualBoundingBoxRight / S;

  const ox = Math.round(size * S * 0.4);
  const oy = Math.round(size * S * 2);
  g.fillText("M", ox, oy);

  const { width: w, height: h } = canvas;
  const px = g.getImageData(0, 0, w, h).data;
  const colInk = new Array<number>(w).fill(0);
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < h; y++) {
    let inked = false;
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 40) {
        colInk[x]++;
        inked = true;
      }
    }
    if (inked) {
      if (top < 0) top = y;
      bottom = y;
    }
  }
  if (top < 0) return null;

  const capPx = bottom - top + 1;
  const fullColumn = capPx * 0.92;
  const runs: [number, number][] = [];
  for (let x = 0; x < w; x++) {
    if (colInk[x] < fullColumn) continue;
    const last = runs[runs.length - 1];
    if (last && x === last[1] + 1) last[1] = x;
    else runs.push([x, x]);
  }
  if (runs.length < 2) return null;

  const left = runs[0];
  const right = runs[runs.length - 1];

  const dpr = window.devicePixelRatio || 1;
  const snap = (v: number) => Math.round(v * dpr) / dpr;
  const strokeWidth = snap((left[1] - left[0] + 1) / S);

  return {
    dpr,
    strokeWidth,
    capHeight: snap(capPx / S),
    leftX: snap((left[0] - ox) / S),
    rightRestX: snap((right[0] - ox) / S),
    rightOpenX: snap(nameInkRight - strokeWidth),
  };
}
