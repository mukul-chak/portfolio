"use client";

import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import { copy } from "@/content/copy";
import { OPEN_CONTACT_EVENT } from "@/components/drawers/ContactDrawer";
import { OPEN_ABOUT_EVENT } from "@/components/drawers/AboutDrawer";
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
        {copy.bio.paragraph.map((part, i) =>
          part.link ? (
            <InlineLink
              key={i}
              href={copy.orgs[part.link].href}
              external
              onMouseEnter={preview.show(part.link)}
              onMouseLeave={preview.hide}
              // One step up from the rule colour, so the words with a note
              // attached read as such against the body copy.
              className={`decoration-stroke-sub-300 ${preview.raised(part.link)}`}
            >
              {part.text}
            </InlineLink>
          ) : (
            part.text
          ),
        )}
      </p>
      {/* Two versions of one line, switched on input rather than width —
          the rule the hover notes use: the hotkey badges only where there's
          a keyboard and a fine pointer (md and up), plain links everywhere
          else, tablets included. One <p>, so the section's spacing is the
          same either way. pt-4, not mt-4: a margin would collapse into the
          section's 24px gap instead of adding to it. */}
      <p className="pt-4">
        <InlineLink href="#about" onClick={openAbout} className="whitespace-nowrap">
          {copy.bio.aboutLink}
        </InlineLink>
        <span className="hidden md:pointer-fine:inline">
          {" "}
          <Kbd>L</Kbd>
        </span>
        {/* The badges' own 2px margin counts toward the 16px. */}
        <Slash className="md:pointer-fine:ml-[14px]" />
        <InlineLink
          href={`mailto:${copy.site.email}`}
          onClick={(e) => {
            // Copies inside the click itself, which iOS requires for
            // clipboard access, with the same toast as the C hotkey.
            e.preventDefault();
            void copyEmailWithToast();
          }}
          className="whitespace-nowrap"
        >
          {copy.bio.copyEmailLink}
        </InlineLink>
        <span className="hidden md:pointer-fine:inline">
          {" "}
          <Kbd>C</Kbd>
        </span>
        <Slash className="md:pointer-fine:ml-[14px]" />
        <InlineLink href={`mailto:${copy.site.email}`} onClick={openContact} className="whitespace-nowrap">
          {copy.bio.contactLink}
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
