import { PanelCard } from "@/components/layout/PanelCard";
import { Button } from "@/components/ui/Button";

const sponsors = ["Arena Pixel", "Canal do Boleiro", "Loja da Torcida"];

export function SponsorsCard() {
  return (
    <PanelCard title="PARCEIROS">
      <div className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)] p-4 pt-8">
        <div className="space-y-2">
          {sponsors.map((sponsor) => (
            <div
              className="rounded-[14px] border border-(--homepage-sponsor-border) bg-card px-4 py-3 text-[14px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text-strong) transition hover:bg-(--homepage-panel-hover)"
              key={sponsor}
            >
              {sponsor}
            </div>
          ))}
        </div>

        <Button
          className="mt-4 w-full text-[14px] font-black tracking-[0.12em]"
          radius="xl"
          size="lg"
          variant="primary"
        >
          Vire um parceiro
        </Button>
      </div>
    </PanelCard>
  );
}
