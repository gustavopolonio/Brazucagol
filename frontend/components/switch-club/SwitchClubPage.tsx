"use client";

import { useState } from "react";
import { ArrowLeftRight, CircleDollarSign, Info, Trophy } from "lucide-react";

import { ClubBadge } from "@/components/layout/ClubBadge";
import { PanelCard } from "@/components/layout/PanelCard";
import {
  availableTransferClubs,
  currentPlayerClub,
  playerTransferPassesCount,
} from "@/components/switch-club/switch-club-data";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Select } from "@/components/ui/Select";

export function SwitchClubPage() {
  const [selectedClubId, setSelectedClubId] = useState(currentPlayerClub.id);
  const [isTransferConfirmationOpen, setIsTransferConfirmationOpen] = useState(false);
  const canSwitchClub = selectedClubId !== currentPlayerClub.id && playerTransferPassesCount > 0;

  function handleConfirmTransfer() {
    setIsTransferConfirmationOpen(false);
  }

  return (
    <>
      <PanelCard
        title={
          <span className="inline-flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Trocar time
          </span>
        }
      >
        <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
          <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
            <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Escolha um novo clube para jogar.
              </p>
            </div>

            <div className="px-3 py-3 md:px-5 md:py-5">
              <div className="flex items-end justify-between gap-4">
                <label className="block flex-1">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[var(--homepage-panel-text-muted)]">
                    Clubes disponíveis
                  </span>
                  <Select
                    aria-label="Selecionar novo clube"
                    onValueChange={setSelectedClubId}
                    options={availableTransferClubs.map((availableTransferClub) => ({
                      description:
                        `${availableTransferClub.shortName}${availableTransferClub.id === currentPlayerClub.id ? " · Clube atual" : ""}`,
                      value: availableTransferClub.id,
                      label: availableTransferClub.name,
                      leadingContent: (
                        <ClubOptionBadge
                          imageUrl={availableTransferClub.imageUrl}
                          shortName={availableTransferClub.shortName}
                        />
                      ),
                    }))}
                    value={selectedClubId}
                  />
                </label>

                <Button
                  className="h-fit gap-2 rounded-full px-5 py-3 text-sm font-black"
                  disabled={!canSwitchClub}
                  onClick={() => setIsTransferConfirmationOpen(true)}
                  variant="primary"
                >
                  <Trophy className="h-4 w-4" strokeWidth={3} />
                  Confirmar troca
                </Button>
              </div>

              <div className="mt-7 flex gap-3">
                <div className="flex flex-1 items-center gap-6 rounded-[18px] border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] p-4 text-sm font-semibold leading-relaxed text-[var(--homepage-panel-text)]">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--homepage-highlight-label)]" />
                  <p className="text-base">
                    Depois de confirmar, você passa a defender o novo clube imediatamente e
                    1 Passe de Transferência será removido do seu inventário.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2.5 rounded-[22px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] p-2 shadow-[0_10px_24px_var(--homepage-vip-shadow)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--homepage-vip-text)]">
                      Seus passes
                    </p>
                    <p className="text-center text-2xl font-black leading-none text-[var(--homepage-vip-text)]">
                      {playerTransferPassesCount}
                    </p>
                  </div>
                  <Button className="h-fit gap-2 rounded-full px-5 py-3 text-sm font-black" variant="secondary">
                    <CircleDollarSign className="h-4 w-4" strokeWidth={3} />
                    Comprar passe
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PanelCard>

      <ConfirmationModal
        cancelLabel="Cancelar"
        confirmLabel="Sim"
        message="Tem certeza que deseja trocar de time?"
        onCancel={() => setIsTransferConfirmationOpen(false)}
        onConfirm={handleConfirmTransfer}
        open={isTransferConfirmationOpen}
      />
    </>
  );
}

function ClubOptionBadge({
  imageUrl,
  shortName,
}: Readonly<{
  imageUrl?: string;
  shortName: string;
}>) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_4px_10px_rgba(73,54,20,0.12)]">
      <ClubBadge imageUrl={imageUrl} shortName={shortName} />
    </span>
  );
}
