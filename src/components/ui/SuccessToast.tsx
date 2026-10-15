"use client";

import { toast } from "@/components/ui/toast";

/**
 * The site's one confirmation toast — a title and a detail line beside a
 * check — shared by "Email copied" and "Message sent" so the two can't
 * drift apart.
 */
export function showSuccessToast(title: string, detail: string) {
  toast.custom(
    () => (
      // AlignUI's alert at its default `small`, which is what their toast is
      // built from: px-2.5 py-2, gap-2, rounded-lg, and the stroke variant's
      // shadow-regular-md.
      //
      // No fixed width — their alerts size to content, and the 260px this
      // used to carry left 45px of empty space to the right of the longest
      // line.
      //
      // An inset ring rather than a border: a 1px border would add 2px back
      // to each axis of a box that now has no slack to absorb it.
      <div className="inset-ring-1 inset-ring-stroke-soft-200 flex items-start gap-2 rounded-[2px] bg-background px-2.5 py-2 shadow-regular-md">
        <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
          {/* No exact AlignUI 700 tier (same gap flagged for the
              header MC animation earlier) — strong-950/white-0 is the
              nearest fit, and matches Button.tsx's own "filled"
              variant (bg-text-strong-950 text-bg-white-0) for the
              identical dark-badge/light-icon pattern. This pair
              inverts together per theme (dark badge+light check in
              light mode, light badge+dark check in dark mode), unlike
              a static black/white pair, which stays fixed and would
              need separately verifying contrast in both themes. */}
          <circle cx="8" cy="8" r="8" fill="var(--color-text-strong-950)" />
          <path
            d="M4.5 8.5l2.5 2.5 4.5-5"
            stroke="var(--color-bg-white-0)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <p className="text-label-sm text-text-strong-950">{title}</p>
          <p className="text-paragraph-sm text-text-sub-600">{detail}</p>
        </div>
      </div>
    ),
    { duration: 3000 },
  );
}
