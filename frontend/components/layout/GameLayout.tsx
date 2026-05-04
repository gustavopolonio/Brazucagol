import type { ReactNode } from "react";

import { ClubBadgeList } from "@/components/layout/ClubBadgeList";
import { Footer } from "@/components/layout/Footer";
import { HeaderPanel } from "@/components/layout/HeaderPanel";
import { BackgroundPitch } from "@/components/layout/BackgroundPitch";
import { MyAccountCard } from "@/components/layout/MyAccountCard";
import { NavigationCard } from "@/components/layout/NavigationCard";
import { OnlinePlayersCounter } from "@/components/layout/OnlinePlayersCounter";
import { Pitch } from "@/components/layout/Pitch";
import { SponsorsCard } from "@/components/layout/SponsorsCard";
import { TopBar } from "@/components/layout/TopBar";
import { FloatingMessages } from "@/components/messages/FloatingMessages";

export function GameLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <BackgroundPitch>
      <div
        className="relative rounded-b-md bg-position-[center_-14px] shadow-[0_10px_24px_var(--homepage-shell-shadow)]"
        style={{ backgroundImage: "url('/images/homepage/header-stadium.png')" }}
      >
        <TopBar />
        <HeaderPanel />
        <div className="absolute bottom-1.5 left-1.5">
          <OnlinePlayersCounter />
        </div>
      </div>

      <ClubBadgeList />

      <section className="grid gap-5 xl:grid-cols-[220px_1fr_220px]">
        <NavigationCard />
        <Pitch>{children}</Pitch>
        <div className="flex flex-col gap-5">
          <MyAccountCard />
          <SponsorsCard />
        </div>
      </section>

      <Footer />
      <FloatingMessages />
    </BackgroundPitch>
  );
}
