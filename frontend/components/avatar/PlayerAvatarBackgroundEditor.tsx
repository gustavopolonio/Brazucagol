"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import {
  AVATAR_BACKGROUND_OPTIONS,
  type AvatarBackgroundOptionId,
  type PlayerAvatarConfig,
} from "@/components/avatar/avatarOptions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

type PlayerAvatarBackgroundEditorProps = {
  currentConfig: PlayerAvatarConfig;
  onClose: () => void;
  onSave: (config: PlayerAvatarConfig) => void;
  open: boolean;
};

function SelectionCheck({ selected }: Readonly<{ selected: boolean }>) {
  if (!selected) {
    return null;
  }

  return (
    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--homepage-highlight-border)] bg-white text-[var(--rounds-highlight-text)] shadow-[0_4px_10px_rgba(0,0,0,0.14)]">
      <Check className="h-4 w-4" strokeWidth={3} />
    </span>
  );
}

export function PlayerAvatarBackgroundEditor({
  currentConfig,
  onClose,
  onSave,
  open,
}: Readonly<PlayerAvatarBackgroundEditorProps>) {
  function handleSelectBackground(backgroundId: AvatarBackgroundOptionId) {
    onSave({
      ...currentConfig,
      backgroundId,
    });
    onClose();
  }

  return (
    <Modal
      className="w-full max-w-3xl overflow-hidden rounded-[22px]"
      onClose={onClose}
      open={open}
      title="Editar fundo"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {AVATAR_BACKGROUND_OPTIONS.map((option) => {
          const selected = currentConfig.backgroundId === option.id;

          return (
            <Button
              className={cn(
                "relative overflow-hidden rounded-[14px] border bg-white p-0 text-left",
                selected
                  ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                  : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
              )}
              key={option.id}
              onClick={() => handleSelectBackground(option.id)}
              variant="unstyled"
            >
              <SelectionCheck selected={selected} />
              <Image
                alt=""
                className="aspect-video w-full object-cover"
                height={220}
                src={option.imageUrl ?? "/images/profile/campo.png"}
                width={360}
              />
              <span className="block truncate border-t border-[var(--homepage-panel-divider-soft)] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                {option.label}
              </span>
            </Button>
          );
        })}
      </div>
    </Modal>
  );
}
