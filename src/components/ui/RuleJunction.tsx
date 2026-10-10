import * as Button from "@/components/ui/Button";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The plus that marks a crossing of a horizontal and a vertical rule.
 *
 * Positioning stays with the caller (`className`), because the two rules meet
 * in a different containing block at every junction — the header's own border
 * box, a rail's column box, a filmstrip divider. What's shared is the mark
 * itself: a 20px ghost square whose centre is the crossing point, which is why
 * every caller pairs its `left`/`right`/`top` offset with the matching
 * translate rather than anchoring an edge.
 *
 * The ±0.5px offsets callers pass are not fudge: a 1px rule's visual centre
 * sits half a pixel past the box edge it's drawn on, so edge + 0.5px is the
 * line, and `left-0` would be a real, measurable half-pixel off.
 *
 * Desktop only (md:) — below that the rules themselves aren't drawn.
 */
export default function RuleJunction({ className = "" }: { className?: string }) {
  return (
    // flex, not a plain block: the button is inline-level, so a block wrapper
    // sizes to the line box — 20px of button plus ~3px of descender space
    // below it. Every caller centres on the junction with a half-height
    // translate, which is computed against THIS element's height, so those
    // 3px landed the whole mark 1.5px high. flex makes the wrapper exactly
    // the button's own 20px box, and the translate exact with it.
    <div className={`absolute hidden md:flex ${className}`}>
      <Button.Root
        variant="neutral"
        mode="ghost"
        size="xs"
        square
        aria-label="Add"
        className="h-[20px] w-[20px] rounded-none text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
      >
        <PlusIcon />
      </Button.Root>
    </div>
  );
}
