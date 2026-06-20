import Frame from "@/components/layout/Frame";
import Rail from "@/components/layout/Rail";
import Header from "@/components/layout/Header";
import Bio from "@/components/sections/Bio";
import RecentWork from "@/components/sections/RecentWork";
import CopyEmail from "@/components/CopyEmail";

export default function Home() {
  return (
    <Frame>
      <CopyEmail />
      <Header />
      {/* Content frame: outer rules start 12px below the nav divider and run
          full height; inner rules are drawn per-rail (mt-3 = same 12px start). */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-3 border-x border-rule"
        />
        <div className="relative pt-3">
          <Rail>
            <Bio />
          </Rail>
          <RecentWork />
          <div className="h-24" />
        </div>
      </div>
    </Frame>
  );
}
