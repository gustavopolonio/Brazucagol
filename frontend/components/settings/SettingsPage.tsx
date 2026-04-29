"use client";

import { useState } from "react";
import { Settings, Trash2, Volume2, VolumeX } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Switch } from "@/components/ui/Switch";

export function SettingsPage() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const SoundIcon = isSoundEnabled ? Volume2 : VolumeX;

  function handleDeleteAccount() {
    setIsDeleteAccountModalOpen(false);
  }

  return (
    <>
      <PanelCard
        title={
          <span className="inline-flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </span>
        }
      >
        <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pb-4 pt-10 opacity-95">
          <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
            <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Preferências da conta
              </p>
            </div>

            <div className="space-y-4 px-3 py-3 md:px-5 md:py-5">
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[var(--homepage-panel-divider)] bg-white/80 p-4 shadow-[0_8px_20px_rgba(73,54,20,0.08)]">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--homepage-account-item-border)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-account-item-end)_100%)] text-[var(--homepage-panel-text-strong)]">
                    <SoundIcon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-black text-[var(--homepage-panel-text-strong)]">
                      Som do jogo
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
                      {isSoundEnabled ? "Ligado" : "Desligado"}
                    </p>
                  </div>
                </div>

                <Switch
                  aria-label="Alternar som do jogo"
                  checked={isSoundEnabled}
                  onClick={() => setIsSoundEnabled((currentValue) => !currentValue)}
                />
              </div>

              <div className="flex flex-col gap-4 rounded-[18px] border border-[var(--homepage-logout-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,242,238,0.96)_100%)] p-4 shadow-[0_8px_20px_rgba(129,45,28,0.1)] md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--homepage-logout-border)] bg-[linear-gradient(180deg,var(--homepage-logout-start)_0%,var(--homepage-logout-end)_100%)] text-white shadow-[0_1px_0_var(--homepage-logout-inset)_inset]">
                    <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-black text-[var(--homepage-panel-text-strong)]">
                      Excluir conta
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
                      Remover jogador e histórico da conta.
                    </p>
                  </div>
                </div>

                <Button
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black"
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={3} />
                  Excluir
                </Button>
              </div>
            </div>
          </section>
        </main>
      </PanelCard>

      <ConfirmationModal
        cancelLabel="Cancelar"
        confirmLabel="Excluir"
        message="Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita."
        onCancel={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        open={isDeleteAccountModalOpen}
      />
    </>
  );
}
