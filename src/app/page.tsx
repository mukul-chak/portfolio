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
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-3 z-[15] border-x border-rule"
        />
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
