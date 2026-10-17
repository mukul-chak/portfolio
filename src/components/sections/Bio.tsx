"use client";

import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import { EMAIL } from "@/content/site";
import { OPEN_CONTACT_EVENT } from "@/components/ContactDrawer";
import { copyEmailWithToast } from "@/components/CopyEmail";

// mailto stays as the href for anyone without JavaScript.
function openContact(e: React.MouseEvent) {
  e.preventDefault();
  window.dispatchEvent(new Event(OPEN_CONTACT_EVENT));
}

export default function Bio() {
  const preview = useHoverPreview();

  return (
    <section
      className="relative mt-4 space-y-6 text-[17px] sm:text-[18px] leading-[1.65] text-text-sub-600"
    >
      <p>
        I design products people{" "}
        {/* Not a link — there's nowhere to go — so a dotted underline, the
            convention for a term with a note attached, and only where the
            note can actually open: md and up, with a fine pointer. On touch
            or a phone it's plain text and the note doesn't exist. */}
        <span
          onMouseEnter={preview.show("trust")}
          onMouseLeave={preview.hide}
          className={`md:pointer-fine:cursor-default md:pointer-fine:underline md:pointer-fine:decoration-dotted md:pointer-fine:decoration-stroke-sub-300 md:pointer-fine:decoration-1 md:pointer-fine:underline-offset-[3px] md:pointer-fine:transition-colors md:pointer-fine:hover:text-text-strong-950 md:pointer-fine:hover:decoration-text-strong-950 ${preview.raised("trust")}`}
        >
          trust
        </span>{" "}
        with the things they can’t afford to lose: their money, their time, and
        their effort.
      </p>
      <p>
        Currently leading product design at{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={preview.show("ascend")}
          onMouseLeave={preview.hide}
          // One step up from the rule colour, so the two words with notes
          // attached read as such against the body copy.
          className={`decoration-stroke-sub-300 ${preview.raised("ascend")}`}
        >
          Ascend
        </InlineLink>
        , I joined the company in 2024 to build its design function. Since
        then, I’ve designed the core product that more than 4,000 insurance
        businesses rely on to generate revenue, and over the same time, built
        the team which now spans product and brand, along with the systems,
        operations, and AI tooling it runs on.
      </p>
      <p>
        I do my best work on opinionated teams, the kind that share a specific
        conviction about how software should work, feel, look, and perform.
      </p>
      {/* Two versions of one line, switched on input rather than width —
          the rule the "trust" note uses: the hotkeys only where there's a
          keyboard and a fine pointer (md and up), the tap version
          everywhere else, tablets included. One <p>, so the section's
          spacing is the same either way. */}
      <p>
        <span className="hidden md:pointer-fine:inline">
          Press <Kbd>c</Kbd> to copy my email or <Kbd>w</Kbd> to{" "}
          <InlineLink href={`mailto:${EMAIL}`} onClick={openContact}>
            write to me
          </InlineLink>
          .
        </span>
        <span className="md:pointer-fine:hidden">
          <InlineLink
            href={`mailto:${EMAIL}`}
            onClick={(e) => {
              // Copies inside the tap itself, which iOS requires for
              // clipboard access, with the same toast as the "c" hotkey.
              e.preventDefault();
              void copyEmailWithToast();
            }}
          >
            Copy my email
          </InlineLink>{" "}
          or{" "}
          <InlineLink href={`mailto:${EMAIL}`} onClick={openContact}>
            write to me
          </InlineLink>
          .
        </span>
      </p>

      {preview.panel}
    </section>
  );
}
