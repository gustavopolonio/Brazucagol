"use client";

import { ImageUp, MessageCircle, PencilLine, Send, UserPen } from "lucide-react";

import { Button } from "@/components/ui/Button";

function AvatarEditMenu({
  onEditBackground,
  onEditPlayer,
}: Readonly<{
  onEditBackground: () => void;
  onEditPlayer: () => void;
}>) {
  return (
    <div className="group/avatar-edit absolute right-3 top-3 z-20">
      <Button
        aria-label="Abrir opções de edição da imagem"
        className="flex items-center justify-center border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] text-(--homepage-panel-text-strong) shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)] hover:brightness-105"
        radius="xl"
        size="icon"
        variant="unstyled"
      >
        <UserPen className="h-5 w-5" strokeWidth={2.4} />
      </Button>

      <div className="pointer-events-none absolute right-0 top-full w-52 pt-2 opacity-0 transition-all duration-200 ease-out group-hover/avatar-edit:pointer-events-auto group-hover/avatar-edit:opacity-100 group-focus-within/avatar-edit:pointer-events-auto group-focus-within/avatar-edit:opacity-100">
        <div className="overflow-hidden rounded-[18px] border border-(--homepage-panel-divider) bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] shadow-[0_1px_0_rgba(255,255,255,0.92)_inset,0_12px_28px_rgba(0,0,0,0.18)]">
          <Button
            className="flex w-full items-center gap-3 border-b border-(--homepage-panel-divider-soft) px-4 py-3 text-left font-black tracking-[0.12em] text-(--homepage-panel-text-strong) transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] hover:text-[var(--rounds-highlight-text)]"
            onClick={onEditPlayer}
            radius="none"
            size="none"
            variant="unstyled"
          >
            <PencilLine className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            <span className="text-sm leading-none">Editar jogador</span>
          </Button>
          <Button
            className="flex w-full items-center gap-3 px-4 py-3 text-left font-black tracking-[0.12em] text-(--homepage-panel-text-strong) transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] hover:text-[var(--rounds-highlight-text)]"
            onClick={onEditBackground}
            radius="none"
            size="none"
            variant="unstyled"
          >
            <ImageUp className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            <span className="text-sm leading-none">Editar fundo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AvatarMessageMenu({
  playerName,
}: Readonly<{
  playerName: string;
}>) {
  return (
    <div className="group/avatar-message absolute right-3 top-3 z-20">
      <Button
        aria-label={`Abrir conversa com ${playerName}`}
        className="flex items-center justify-center border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] text-(--homepage-panel-text-strong) shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)] hover:brightness-105"
        radius="xl"
        size="icon"
        variant="unstyled"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
      </Button>

      <div className="pointer-events-none absolute right-0 top-full w-72 pt-2 opacity-0 transition-all duration-200 ease-out group-hover/avatar-message:pointer-events-auto group-hover/avatar-message:opacity-100 group-focus-within/avatar-message:pointer-events-auto group-focus-within/avatar-message:opacity-100">
        <div className="overflow-hidden rounded-[18px] border border-(--homepage-panel-divider) bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] shadow-[0_1px_0_rgba(255,255,255,0.92)_inset,0_12px_28px_rgba(0,0,0,0.18)]">
          <div className="border-b border-(--homepage-panel-divider-soft) px-4 py-3">
            <p className="text-sm text-center font-black tracking-[0.16em] text-(--homepage-record-label)">
              Mensagem privada
            </p>
          </div>

          <div className="space-y-3 p-4">
            <textarea
              className="min-h-28 w-full resize-none rounded-[16px] border border-(--homepage-panel-divider) bg-white/90 px-4 py-3 text-sm font-semibold text-(--homepage-panel-text-strong) outline-none transition placeholder:text-(--homepage-panel-text-muted) focus:border-(--homepage-highlight-border) focus:bg-white focus:shadow-[0_0_0_3px_rgba(238,248,208,0.85)]"
              placeholder={`Escreva uma mensagem para ${playerName}...`}
            />

            <Button
              className="w-full justify-center gap-2"
              radius="xl"
              size="md"
              variant="primary"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
              Enviar mensagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileAvatarActionMenu({
  isViewingOwnProfile,
  onEditBackground,
  onEditPlayer,
  playerName,
}: Readonly<{
  isViewingOwnProfile: boolean;
  onEditBackground?: () => void;
  onEditPlayer?: () => void;
  playerName: string;
}>) {
  if (isViewingOwnProfile) {
    return (
      <AvatarEditMenu
        onEditBackground={onEditBackground ?? (() => undefined)}
        onEditPlayer={onEditPlayer ?? (() => undefined)}
      />
    );
  }

  return <AvatarMessageMenu playerName={playerName} />;
}
