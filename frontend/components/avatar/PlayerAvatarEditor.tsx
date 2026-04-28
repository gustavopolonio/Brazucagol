"use client";

import Image from "next/image";
import {
  Check,
  Eye,
  Palette,
  Scissors,
  Shirt,
  Dices,
  Smile,
  UserRound,
} from "lucide-react";
import { useState, type ComponentType } from "react";

import {
  AvatarEyebrowsSvg,
  AvatarEyesSvg,
  AvatarMouthSvg,
  AvatarNoseSvg,
} from "@/components/avatar/AvatarFeatureSvgs";
import {
  AVATAR_BACKGROUND_OPTIONS,
  AVATAR_BASE_OPTIONS,
  AVATAR_EYE_OPTIONS,
  AVATAR_EYEBROW_OPTIONS,
  AVATAR_HAIR_OPTIONS,
  AVATAR_MOUTH_OPTIONS,
  AVATAR_NOSE_OPTIONS,
  AVATAR_SOCK_OPTIONS,
  EYEBROW_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  getAvatarBaseOptionId,
  getAvatarBodyIdForBaseAndSocks,
  getAvatarBodyOption,
  getAvatarSockOptionId,
  type AvatarBaseOptionId,
  type AvatarEyeOptionId,
  type AvatarEyebrowOptionId,
  type AvatarHairOptionId,
  type AvatarMouthOptionId,
  type AvatarNoseOptionId,
  type AvatarSockOptionId,
  type PlayerAvatarConfig,
} from "@/components/avatar/avatarOptions";
import { PlayerAvatarRenderer } from "@/components/avatar/PlayerAvatarRenderer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

type AvatarEditorTab =
  | "body"
  | "socks"
  | "hair"
  | "eyes"
  | "eyebrows"
  | "nose"
  | "mouth";

type PlayerAvatarEditorProps = {
  currentConfig: PlayerAvatarConfig;
  onClose: () => void;
  onSave: (config: PlayerAvatarConfig) => void;
  open: boolean;
  playerName: string;
};

const editorTabs: Array<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  id: AvatarEditorTab;
  label: string;
}> = [
  { icon: UserRound, id: "body", label: "Avatar" },
  { icon: Shirt, id: "socks", label: "Meia" },
  { icon: Scissors, id: "hair", label: "Cabelo" },
  { icon: Eye, id: "eyes", label: "Olhos" },
  { icon: Palette, id: "eyebrows", label: "Sobrancelha" },
  { icon: Shirt, id: "nose", label: "Nariz" },
  { icon: Smile, id: "mouth", label: "Boca" },
];

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

function ColorPicker({
  color,
  label,
  onChange,
  options,
}: Readonly<{
  color: string;
  label: string;
  onChange: (color: string) => void;
  options: string[];
}>) {
  return (
    <div className="space-y-3 rounded-[14px] border border-[var(--homepage-panel-divider)] bg-white/80 p-4">
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--homepage-record-label)]">
        {label}
      </p>
      <div className="flex items-center justify-between gap-3">
        <input
          aria-label={label}
          className="h-9 w-12 cursor-pointer rounded-[8px] border border-[var(--homepage-panel-divider)] bg-transparent p-1"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={color}
        />

        <div className="flex flex-wrap gap-2">
          {options.map((optionColor) => (
            <Button
              aria-label={`${label} ${optionColor}`}
              className={cn(
                "h-9 w-9 rounded-full border shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]",
                optionColor === color
                  ? "border-[var(--rounds-highlight-text)] ring-2 ring-[rgba(132,212,0,0.34)]"
                  : "border-black/20",
              )}
              key={optionColor}
              onClick={() => onChange(optionColor)}
              style={{ backgroundColor: optionColor }}
              variant="unstyled"
            >
              <span className="sr-only">{optionColor}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRandomOption<TOption>(options: TOption[]) {
  return options[Math.floor(Math.random() * options.length)];
}

export function PlayerAvatarEditor({
  currentConfig,
  onClose,
  onSave,
  open,
  playerName,
}: Readonly<PlayerAvatarEditorProps>) {
  const [draftConfig, setDraftConfig] = useState(currentConfig);
  const [selectedTab, setSelectedTab] = useState<AvatarEditorTab>("body");
  const selectedBaseId = getAvatarBaseOptionId(draftConfig.bodyId);
  const selectedSockId = getAvatarSockOptionId(draftConfig.bodyId);

  function updateDraftConfig(update: Partial<PlayerAvatarConfig>) {
    setDraftConfig((previousConfig) => ({
      ...previousConfig,
      ...update,
    }));
  }

  function handleSave() {
    onSave(draftConfig);
    onClose();
  }

  function handleRandomize() {
    const baseOption = getRandomOption(AVATAR_BASE_OPTIONS);
    const sockOption = getRandomOption(AVATAR_SOCK_OPTIONS);

    setDraftConfig({
      backgroundId: getRandomOption(AVATAR_BACKGROUND_OPTIONS).id,
      bodyId: getAvatarBodyIdForBaseAndSocks(baseOption.id, sockOption.id),
      eyebrowColor: getRandomOption(EYEBROW_COLOR_OPTIONS),
      eyebrowId: getRandomOption(AVATAR_EYEBROW_OPTIONS).id,
      eyeColor: getRandomOption(EYE_COLOR_OPTIONS),
      eyeId: getRandomOption(AVATAR_EYE_OPTIONS).id,
      hairId: getRandomOption(AVATAR_HAIR_OPTIONS).id,
      mouthId: getRandomOption(AVATAR_MOUTH_OPTIONS).id,
      noseId: getRandomOption(AVATAR_NOSE_OPTIONS).id,
    });
  }

  return (
    <Modal
      className="w-full overflow-hidden rounded-[22px]"
      onClose={onClose}
      open={open}
      title="Editar jogador"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(250px,360px)_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[18px] border border-[var(--homepage-panel-divider)] bg-white shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
            <PlayerAvatarRenderer
              config={draftConfig}
              enableZoomControls
              playerName={playerName}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap"
              onClick={handleSave}
              radius="xl"
              size="md"
              variant="primary"
            >
              <Check className="h-4 w-4" strokeWidth={2.6} />
              Salvar
            </Button>
            <Button
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap"
              onClick={handleRandomize}
              radius="xl"
              size="md"
              variant="secondary"
            >
              <Dices className="h-4 w-4" strokeWidth={2.6} />
              Aleatório
            </Button>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {editorTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedTab === tab.id;

              return (
                <Button
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[14px] border px-3 py-2 text-sm font-black uppercase tracking-[0.08em]",
                    isSelected
                      ? "border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] text-[var(--rounds-highlight-text)] shadow-[0_1px_0_var(--homepage-highlight-inset)_inset]"
                      : "border-[var(--homepage-panel-divider)] bg-white/80 text-[var(--homepage-panel-text-strong)] hover:bg-white",
                  )}
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  variant="unstyled"
                >
                  <Icon className="h-4 w-4" strokeWidth={2.6} />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {selectedTab === "body" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {AVATAR_BASE_OPTIONS.map((option) => {
                const selected = selectedBaseId === option.id;

                return (
                  <Button
                    className={cn(
                      "relative overflow-hidden rounded-[14px] border bg-white p-0 text-left",
                      selected
                        ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                        : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                    )}
                    key={option.id}
                    onClick={() =>
                      updateDraftConfig({
                        bodyId: getAvatarBodyIdForBaseAndSocks(
                          option.id as AvatarBaseOptionId,
                          selectedSockId,
                        ),
                      })
                    }
                    variant="unstyled"
                  >
                    <SelectionCheck selected={selected} />
                    <Image
                      alt=""
                      className="aspect-square w-full object-cover"
                      height={180}
                      src={option.imageUrl ?? "/images/profile/avatar_01.png"}
                      width={180}
                    />
                    <span className="block truncate border-t border-[var(--homepage-panel-divider-soft)] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}

          {selectedTab === "socks" ? (
            <div className="grid grid-cols-2 gap-3">
              {AVATAR_SOCK_OPTIONS.map((option) => {
                const bodyId = getAvatarBodyIdForBaseAndSocks(
                  selectedBaseId,
                  option.id as AvatarSockOptionId,
                );
                const bodyOption = getAvatarBodyOption(bodyId);
                const selected = selectedSockId === option.id;

                return (
                  <Button
                    className={cn(
                      "relative overflow-hidden rounded-[14px] border bg-white p-0 text-left",
                      selected
                        ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                        : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                    )}
                    key={option.id}
                    onClick={() =>
                      updateDraftConfig({
                        bodyId,
                      })
                    }
                    variant="unstyled"
                  >
                    <SelectionCheck selected={selected} />
                    <Image
                      alt=""
                      className="aspect-square w-full object-cover"
                      height={180}
                      src={bodyOption.imageUrl ?? "/images/profile/avatar_01.png"}
                      width={180}
                    />
                    <span className="block truncate border-t border-[var(--homepage-panel-divider-soft)] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}

          {selectedTab === "hair" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {AVATAR_HAIR_OPTIONS.map((option) => {
                const selected = draftConfig.hairId === option.id;

                return (
                  <Button
                    className={cn(
                      "relative overflow-hidden rounded-[14px] border bg-white p-0 text-left",
                      selected
                        ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                        : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                    )}
                    key={option.id}
                    onClick={() =>
                      updateDraftConfig({
                        hairId: option.id as AvatarHairOptionId,
                      })
                    }
                    variant="unstyled"
                  >
                    <SelectionCheck selected={selected} />
                    <div className="flex aspect-square items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f3f6ea_100%)]">
                      {option.imageUrl ? (
                        <Image
                          alt=""
                          className="h-full w-full object-cover"
                          height={180}
                          src={option.imageUrl}
                          width={180}
                        />
                      ) : (
                        <span className="text-3xl font-black text-[var(--homepage-panel-text-muted)]">
                          -
                        </span>
                      )}
                    </div>
                    <span className="block truncate border-t border-[var(--homepage-panel-divider-soft)] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}

          {selectedTab === "eyes" ? (
            <div className="space-y-4">
              <ColorPicker
                color={draftConfig.eyeColor}
                label="Cor dos olhos"
                onChange={(eyeColor) => updateDraftConfig({ eyeColor })}
                options={EYE_COLOR_OPTIONS}
              />

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {AVATAR_EYE_OPTIONS.map((option) => {
                  const selected = draftConfig.eyeId === option.id;

                  return (
                    <Button
                      className={cn(
                        "relative overflow-hidden rounded-[14px] border bg-white p-3 text-left",
                        selected
                          ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                          : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                      )}
                      key={option.id}
                      onClick={() =>
                        updateDraftConfig({
                          eyeId: option.id as AvatarEyeOptionId,
                        })
                      }
                      variant="unstyled"
                    >
                      <SelectionCheck selected={selected} />
                      <AvatarEyesSvg
                        className="h-20 w-full"
                        color={draftConfig.eyeColor}
                        eyeId={option.id}
                      />
                      <span className="block truncate pt-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                        {option.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedTab === "eyebrows" ? (
            <div className="space-y-4">
              <ColorPicker
                color={draftConfig.eyebrowColor}
                label="Cor da sobrancelha"
                onChange={(eyebrowColor) =>
                  updateDraftConfig({ eyebrowColor })
                }
                options={EYEBROW_COLOR_OPTIONS}
              />

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {AVATAR_EYEBROW_OPTIONS.map((option) => {
                  const selected = draftConfig.eyebrowId === option.id;

                  return (
                    <Button
                      className={cn(
                        "relative overflow-hidden rounded-[14px] border bg-white p-3 text-left",
                        selected
                          ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                          : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                      )}
                      key={option.id}
                      onClick={() =>
                        updateDraftConfig({
                          eyebrowId: option.id as AvatarEyebrowOptionId,
                        })
                      }
                      variant="unstyled"
                    >
                      <SelectionCheck selected={selected} />
                      <AvatarEyebrowsSvg
                        className="h-16 w-full"
                        color={draftConfig.eyebrowColor}
                        eyebrowId={option.id}
                      />
                      <span className="block truncate pt-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                        {option.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedTab === "nose" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {AVATAR_NOSE_OPTIONS.map((option) => {
                const selected = draftConfig.noseId === option.id;

                return (
                  <Button
                    className={cn(
                      "relative overflow-hidden rounded-[14px] border bg-white p-3 text-left",
                      selected
                        ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                        : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                    )}
                    key={option.id}
                    onClick={() =>
                      updateDraftConfig({
                        noseId: option.id as AvatarNoseOptionId,
                      })
                    }
                    variant="unstyled"
                  >
                    <SelectionCheck selected={selected} />
                    <AvatarNoseSvg className="h-24 w-full" noseId={option.id} />
                    <span className="block truncate pt-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}

          {selectedTab === "mouth" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {AVATAR_MOUTH_OPTIONS.map((option) => {
                const selected = draftConfig.mouthId === option.id;

                return (
                  <Button
                    className={cn(
                      "relative overflow-hidden rounded-[14px] border bg-white p-3 text-left",
                      selected
                        ? "border-[var(--homepage-highlight-border)] ring-2 ring-[rgba(132,212,0,0.32)]"
                        : "border-[var(--homepage-panel-divider)] hover:border-[var(--homepage-highlight-border)]",
                    )}
                    key={option.id}
                    onClick={() =>
                      updateDraftConfig({
                        mouthId: option.id as AvatarMouthOptionId,
                      })
                    }
                    variant="unstyled"
                  >
                    <SelectionCheck selected={selected} />
                    <AvatarMouthSvg
                      className="h-24 w-full"
                      mouthId={option.id}
                    />
                    <span className="block truncate pt-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
