/**
 * Renders a string with tabular figures: every digit in an equal-width
 * slot, so dates, counts and ticking clocks don't shift as they change.
 *
 * `font-variant-numeric: tabular-nums` can't do it here — the Reform
 * Grotesk and Monument files the site ships carry no `tnum` feature, so
 * their figures stay proportional (in Reform a "1" is ~58% the width of a
 * "0"). Instead each digit sits in an inline-block 1ch wide — the width of
 * "0", the widest figure in both faces at the weights used — centred, so
 * the figures keep their own shapes on a fixed pitch. Text is unchanged
 * for copying and for screen readers.
 *
 * Letter-spaced text (the header clock's tracking) sets --tnum-ls to the
 * same amount, so the slots keep it.
 */
export default function Tabular({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\d)/).map((part, i) =>
        /^\d$/.test(part) ? (
          <span key={i} className="tnum-digit">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
