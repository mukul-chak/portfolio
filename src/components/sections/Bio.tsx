import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { EMAIL } from "@/content/site";

export default function Bio() {
  return (
    <section className="mt-2 space-y-6 text-[20px] leading-[1.65] text-body">
      <p>
        An art-director-turned-product designer with a knack for turning
        paper-napkin ideas into scalable digital products.
      </p>
      <p>
        I currently lead product design for{" "}
        <InlineLink href="https://www.useascend.com" external>
          Ascend
        </InlineLink>
        , a financial operations platform built for insurance, where I've driven
        and evolved the core platform experience over the last 8 years. I'm also
        a design director and advisor at{" "}
        <InlineLink href="#">SAAG</InlineLink> where I advise on product
        strategy and craft next-gen product experiences.
      </p>
      <p>
        Press <Kbd>c</Kbd> to copy my email or{" "}
        <InlineLink href={`mailto:${EMAIL}`}>write to me</InlineLink>.
      </p>
    </section>
  );
}
