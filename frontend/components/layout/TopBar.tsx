import { PlayerAvatar } from "@/components/layout/PlayerAvatar";
import { PlayerJerseyNameplate } from "@/components/layout/PlayerJerseyNameplate";
import { ScoreboardTimer } from "@/components/layout/ScoreboardTimer";
import type { TopBarData } from "@/components/layout/layoutTypes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

const topBarData: TopBarData = {
  searchPlaceholder: "Procurar jogador por nome",
  currentRoundLabel: "19",
  onlineCount: "584",
  countdown: "15:01:34",
  currentSeasonLabel: "39",
  playerName: "Canhotinha10",
  clubPrimaryColor: "var(--club-auriverde-primary)",
  clubSecondaryColor: "var(--club-auriverde-secondary)",
  logoutLabel: "Sair",
};

export function TopBar() {
  return (
    <section className="px-3 py-1.5 grid gap-2 text-white bg-[linear-gradient(180deg,var(--homepage-header-overlay-start)_0%,var(--homepage-header-overlay-mid)_48%,var(--homepage-header-overlay-end)_100%)] xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:items-center">
      <label className="block rounded-full border border-(--homepage-search-border) bg-[linear-gradient(180deg,var(--homepage-search-start)_0%,var(--homepage-search-end)_100%)] px-3 py-1 shadow-[0_1px_0_var(--homepage-topbar-inset)_inset]">
        <span className="sr-only">{topBarData.searchPlaceholder}</span>
        <div className="flex items-center gap-2 px-2">
          <Search className="h-4 w-4 text-white/80" strokeWidth={2.5} />
          <Input
            className="w-full bg-transparent text-[13px] font-black text-white outline-none placeholder:text-white/70"
            placeholder={topBarData.searchPlaceholder}
            type="text"
          />
        </div>
      </label>

      <div className="grid gap-2 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <p className="text-[12px] font-black uppercase tracking-[0.12em]">{topBarData.currentSeasonLabel}ª temporada</p>
        <ScoreboardTimer countdown={topBarData.countdown} />
        <p className="text-[12px] font-black uppercase tracking-[0.12em]">{topBarData.currentRoundLabel}ª rodada</p>
      </div>

      <div className="flex items-center justify-end gap-6">
        <div className="flex min-w-0 items-center gap-2">
          <PlayerAvatar playerName={topBarData.playerName} />
          <PlayerJerseyNameplate
            playerName={topBarData.playerName}
            primaryColor={topBarData.clubPrimaryColor}
          />
        </div>
        <Button
          className="text-[13px] font-black tracking-[0.06em]"
          radius="sm"
          size="compact"
          variant="destructive"
        >
          {topBarData.logoutLabel}
        </Button>
      </div>
    </section>
  );
}
