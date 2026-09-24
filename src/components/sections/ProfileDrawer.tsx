"use client";

import { Fragment } from "react";
import Drawer from "@/components/ui/Drawer";
import { profileBlocks } from "@/content/profile";

/* Desktop column geometry, all as a share of the drawer's content width so the
   ratio holds at any drawer size (a fixed-px gutter crushed the reading column
   on narrower viewports):

     main column 64% │ 8% │ divider │ 3% │ annotation 25%

   Each block wrapper spans the full content width and the paragraph inside it
   is the one constrained to 64% — that way an annotation, positioned against
   its own block, can use plain container-relative percentages.

   Below md there are no columns: annotations fall inline under their paragraph. */

/** Renders *emphasis* as italic, leaving the rest as plain text. */
function withEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function ProfileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Profile">
      <div className="relative pt-4 pb-20">
        <div
          aria-hidden
          className="absolute inset-y-0 right-[28%] hidden w-px bg-rule md:block"
        />

        {profileBlocks.map((block, i) => {
          // Index, not first:mt-0 — the divider above is this container's
          // first DOM child, so :first-child would land on that instead and
          // leave the opening paragraph with a full top margin.
          const first = i === 0;

          if (block.type === "pullquote") {
            return (
              <p
                key={i}
                className={`mb-12 text-[22px] font-medium leading-[1.35] text-text-strong-950 md:ml-[18%] md:w-[46%] ${
                  first ? "" : "mt-12"
                }`}
              >
                {withEmphasis(block.text)}
              </p>
            );
          }

          return (
            <div key={i} className={`relative ${first ? "" : "mt-10"}`}>
              <p className="text-[18px] leading-[1.6] text-text-strong-950 md:w-[64%]">
                {withEmphasis(block.text)}
              </p>
              {block.annotation && (
                // md:top-0 against this paragraph's own wrapper is what anchors
                // the annotation to the paragraph it belongs to — no measuring,
                // and it survives any reflow. Absolute so a tall annotation
                // never pushes the next paragraph down.
                // No rule above it in the side column. Below md the
                // annotation falls inline under its paragraph, where the rule
                // is the only thing separating the two, so it's kept there.
                <aside className="mt-8 border-t border-rule pt-3 md:absolute md:right-0 md:top-0 md:mt-0 md:w-[25%] md:border-t-0 md:pt-0">
                  <p className="text-[13px] tabular-nums text-text-sub-600">
                    {block.annotation.index}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.5] text-text-sub-600">
                    {withEmphasis(block.annotation.text)}
                  </p>
                </aside>
              )}
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}
