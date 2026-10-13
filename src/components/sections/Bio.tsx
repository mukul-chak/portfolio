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
        I design products people trust with consequential things: their
        money, their work, their decisions. Most of the craft is restraint —
        knowing how much complexity to reveal and how much to quietly carry,
        so a product does just enough to earn that trust.
      </p>
      <p>
        I lead product design at{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={preview.show("ascend")}
          onMouseLeave={preview.hide}
          className={preview.raised("ascend")}
        >
          Ascend
        </InlineLink>
        , where I joined as the first designer. I’ve built the products
        thousands of insurance businesses use to move money, and the design
        system, team, and AI tooling behind them. I’m still hands-on in all of
        it, and I’ve learned which decisions need speed, which need a system,
        and which aren’t design problems at all.
      </p>
      <p>
        Press <Kbd>c</Kbd> to copy my email or{" "}
        <InlineLink href={`mailto:${EMAIL}`}>write to me</InlineLink>.
      </p>

      {preview.panel}
    </section>
  );
}
