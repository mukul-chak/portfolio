import { headers } from "next/headers";
import Frame from "@/components/layout/Frame";
import Rail from "@/components/layout/Rail";
import Header from "@/components/layout/Header";
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
          to be a single absolute box starting 12px below Header's natural
          in-flow position, which only produced a real 12px gap at scrollY 0 —
          Header is sticky, so past that it just sat on top of the rule's
          middle with zero clearance. Fixed + a static top offset (header's
          own 45px height + the 12px gap) keeps that clearance at every
          scroll position instead of just the first screen's worth. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[15]"
        style={{ top: 57 }}
      >
        <div className="mx-auto h-full max-w-frame px-5 sm:px-8 xl:px-0">
          {/* Plain block, not absolute — an absolutely-positioned inset-0
              child fills its ancestor's padding box (ignoring the padding
              above), which silently pushed this to the viewport's raw
              edges instead of Frame's own content edges. A normal child
              sizes to the content box, same as everything else in Frame. */}
          <div className="h-full border-x border-rule" />
        </div>
      </div>
      <div className="relative">
        <div className="relative pt-3">
          <Rail elevateRule>
            <BodyName />
            <Bio />
          </Rail>
          <RecentWork />
          <div className="h-24" />
        </div>
      </div>
    </Frame>
  );
}
