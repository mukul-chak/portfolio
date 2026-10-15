"use client";

import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import { EMAIL } from "@/content/site";

export default function Bio() {
  const preview = useHoverPreview(["ascend"]);

  return (
    <section
      className="relative mt-4 space-y-6 text-[17px] sm:text-[18px] leading-[1.65] text-text-sub-600"
    >
      <p>
        I design products people trust with the things they can’t afford to
        lose: their money, their time, and their effort. What I’ve learned is
        that trust is largely a matter of restraint, of knowing how much of the
        machinery to show and how much to absorb, so that a product does
        exactly enough and nothing that would give anyone a reason to doubt it.
      </p>
      <p>
        Currently leading product design at{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={preview.show("ascend")}
          onMouseLeave={preview.hide}
          className={preview.raised("ascend")}
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
      <p>
        Press <Kbd>c</Kbd> to copy my email or{" "}
        <InlineLink href={`mailto:${EMAIL}`}>write to me</InlineLink>.
      </p>

      {preview.panel}
    </section>
  );
}
