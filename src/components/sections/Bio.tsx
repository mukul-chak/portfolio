"use client";

import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import { EMAIL } from "@/content/site";

export default function Bio() {
  const preview = useHoverPreview(["ascend", "saag"]);

  return (
    <section
      className="relative mt-4 space-y-6 text-[17px] sm:text-[18px] leading-[1.65] text-text-sub-600"
    >
      <p>
        An art-director-turned-product designer with a knack for turning
        paper-napkin ideas into scalable digital products.
      </p>
      <p>
        I currently lead product design for{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={preview.show("ascend")}
          onMouseLeave={preview.hide}
          className={preview.raised("ascend")}
        >
          Ascend
        </InlineLink>
        , a financial operations platform built for insurance, where I’ve led
        product design since joining as its first designer in 2024. I’m also
        a design director and advisor at{" "}
        <InlineLink
          href="#"
          onMouseEnter={preview.show("saag")}
          onMouseLeave={preview.hide}
          className={preview.raised("saag")}
        >
          SAAG
        </InlineLink>{" "}
        where I advise on product strategy and craft next-gen product experiences.
      </p>
      <p>
        Press <Kbd>c</Kbd> to copy my email or{" "}
        <InlineLink href={`mailto:${EMAIL}`}>write to me</InlineLink>.
      </p>

      {preview.panel}
    </section>
  );
}
