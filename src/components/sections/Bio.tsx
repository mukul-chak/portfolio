"use client";

import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import { EMAIL } from "@/content/site";
import { OPEN_CONTACT_EVENT } from "@/components/ContactDrawer";
import { OPEN_ABOUT_EVENT } from "@/components/AboutDrawer";
import { copyEmailWithToast } from "@/components/CopyEmail";

function openAbout(e: React.MouseEvent) {
  e.preventDefault();
  window.dispatchEvent(new Event(OPEN_ABOUT_EVENT));
}

// mailto stays as the href for anyone without JavaScript.
function openContact(e: React.MouseEvent) {
  e.preventDefault();
  window.dispatchEvent(new Event(OPEN_CONTACT_EVENT));
}

export default function Bio() {
  const preview = useHoverPreview();

  return (
    <section
      // md:pr-6: on desktop the lines stop 24px further from the column's
      // right rule (40px of clearance, against the Rail's 16px), so the
      // longest ones don't run up against it.
      className="relative mt-4 space-y-6 text-[17px] sm:text-[18px] leading-[1.65] text-text-sub-600 md:pr-6"
    >
      <p>
        Mukul is an art-director-turned-product designer with a knack for
        turning paper-napkin ideas into scalable digital products. He
        currently leads product design for{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={preview.show("ascend")}
          onMouseLeave={preview.hide}
          // One step up from the rule colour, so the word with a note
          // attached reads as such against the body copy.
          className={`decoration-stroke-sub-300 ${preview.raised("ascend")}`}
        >
          Ascend
        </InlineLink>
        , an accounting automation platform purpose-built for insurance.
      </p>
      {/* Two versions of one line, switched on input rather than width —
          the rule the hover notes use: the hotkey badges only where there's
          a keyboard and a fine pointer (md and up), plain links everywhere
          else, tablets included. One <p>, so the section's spacing is the
          same either way. */}
      <p>
        <InlineLink href="#about" onClick={openAbout} className="whitespace-nowrap">
          Learn more
        </InlineLink>
        <span className="hidden md:pointer-fine:inline">
          {" "}
          <Kbd>L</Kbd>
        </span>
        {/* The badges' own 2px margin counts toward the 16px. */}
        <Slash className="md:pointer-fine:ml-[14px]" />
        <InlineLink
          href={`mailto:${EMAIL}`}
          onClick={(e) => {
            // Copies inside the click itself, which iOS requires for
            // clipboard access, with the same toast as the C hotkey.
            e.preventDefault();
            void copyEmailWithToast();
          }}
          className="whitespace-nowrap"
        >
          Copy email
        </InlineLink>
        <span className="hidden md:pointer-fine:inline">
          {" "}
          <Kbd>C</Kbd>
        </span>
        <Slash className="md:pointer-fine:ml-[14px]" />
        <InlineLink href={`mailto:${EMAIL}`} onClick={openContact} className="whitespace-nowrap">
          Reach out
        </InlineLink>
        <span className="hidden md:pointer-fine:inline">
          {" "}
          <Kbd>R</Kbd>
        </span>
      </p>

      {preview.panel}
    </section>
  );
}

/** The CTA line's separator: 16px either side. */
function Slash({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`mx-4 ${className}`}>/</span>;
}
