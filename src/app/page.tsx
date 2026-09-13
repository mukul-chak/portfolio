import { headers } from "next/headers";
import Frame from "@/components/layout/Frame";
import Rail from "@/components/layout/Rail";
import Header from "@/components/layout/Header";
import HeaderRuleConnector from "@/components/layout/HeaderRuleConnector";
import Bio from "@/components/sections/Bio";
import BodyName from "@/components/sections/BodyName";
import RecentWork from "@/components/sections/RecentWork";
import CopyEmail from "@/components/CopyEmail";
import BottomScrim from "@/components/layout/BottomScrim";

export default async function Home() {
  // Vercel injects geo headers at the edge — no third-party API, no rate limits.
  // Absent in local dev, where LocationTime falls back to the viewer's own timezone.
  const h = await headers();
  const rawCity = h.get("x-vercel-ip-city");
  const city = rawCity ? decodeURIComponent(rawCity) : undefined;
  const tz = h.get("x-vercel-ip-timezone") ?? undefined;

  return (
    <Frame>
      <BottomScrim />
      <CopyEmail />
      <Header city={city} tz={tz} />
      {/* Outer vertical rule, pinned to the viewport (not page scroll): it used
          to be a single absolute box starting below Header's natural in-flow
          position, which only held at scrollY 0 — Header is sticky, so past
          that it just sat on top of the rule's middle. Fixed + a static top
          offset (header's own 45px height, no added gap) keeps it flush with
          the header at every scroll position, running seamlessly through
          Header's own bottom-corner plus buttons with no break.
          z-[17]: stays above the bottom fade overlays (z-[16]) — only the
          narrower rule-x column verticals (z-[15]) fall under that fade,
          by request; this wide outer rule is intentionally unaffected. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[17]"
        style={{ top: 45 }}
      >
        <div className="mx-auto h-full max-w-frame px-5 sm:px-8 xl:px-0">
          {/* Plain block, not absolute — an absolutely-positioned inset-0
              child fills its ancestor's padding box (ignoring the padding
              above), which silently pushed this to the viewport's raw
              edges instead of Frame's own content edges. A normal child
              sizes to the content box, same as everything else in Frame.
              rule-x, not border-x border-rule: every vertical line on the
              page is now the same 4px/2px dotted pattern, not a mix of
              solid and dotted. */}
          <div className="h-full rule-x" />
        </div>
      </div>
      <div className="relative">
        <div className="relative pt-3">
          {/* Bridges Rail's own narrower column verticals up to the header's
              bottom edge — the 12px pt-3 gap otherwise leaves them starting
              in mid-air instead of touching the header. */}
          <HeaderRuleConnector>
            <Rail elevateRule>
              <BodyName />
              <Bio />
            </Rail>
          </HeaderRuleConnector>
          <RecentWork />
          <div className="h-24" />
        </div>
      </div>
    </Frame>
  );
}
