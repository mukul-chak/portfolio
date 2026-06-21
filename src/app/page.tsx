import Frame from "@/components/layout/Frame";
import Rail from "@/components/layout/Rail";
import Header from "@/components/layout/Header";
import Bio from "@/components/sections/Bio";
import BodyName from "@/components/sections/BodyName";
import RecentWork from "@/components/sections/RecentWork";
import CopyEmail from "@/components/CopyEmail";
import LocationTime from "@/components/ui/LocationTime";
import BottomScrim from "@/components/layout/BottomScrim";

export default function Home() {
  return (
    <Frame>
      <BottomScrim />
      <CopyEmail />
      <Header />
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-3 border-x border-rule"
        />
        <div className="relative pt-3">
          <Rail className="relative">
            <div className="absolute inset-x-0 top-0 flex justify-end pr-3">
              <LocationTime />
            </div>
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
