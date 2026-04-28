"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

import {
  AvatarEyebrowsSvg,
  AvatarEyesSvg,
  AvatarMouthSvg,
  AvatarNoseSvg,
} from "@/components/avatar/AvatarFeatureSvgs";
import {
  getAvatarBackgroundOption,
  getAvatarBodyOption,
  getAvatarEyebrowOption,
  getAvatarEyeOption,
  getAvatarHairOption,
  getAvatarMouthOption,
  getAvatarNoseOption,
  type PlayerAvatarConfig,
} from "@/components/avatar/avatarOptions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PlayerAvatarRendererProps = {
  className?: string;
  config: PlayerAvatarConfig;
  enableZoomControls?: boolean;
  imagePriority?: boolean;
  playerName: string;
  variant?: "full" | "face";
};

const AVATAR_ZOOM_STEP = 0.25;
const MAX_AVATAR_ZOOM = 2.5;
const MIN_AVATAR_ZOOM = 1;

type PanPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startPan: PanPosition;
  startX: number;
  startY: number;
};

export function PlayerAvatarRenderer({
  className,
  config,
  enableZoomControls = false,
  imagePriority = false,
  playerName,
  variant = "full",
}: Readonly<PlayerAvatarRendererProps>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [zoom, setZoom] = useState(MIN_AVATAR_ZOOM);
  const [pan, setPan] = useState<PanPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const backgroundOption = getAvatarBackgroundOption(config.backgroundId);
  const bodyOption = getAvatarBodyOption(config.bodyId);
  const eyebrowOption = getAvatarEyebrowOption(config.eyebrowId);
  const eyeOption = getAvatarEyeOption(config.eyeId);
  const hairOption = getAvatarHairOption(config.hairId);
  const mouthOption = getAvatarMouthOption(config.mouthId);
  const noseOption = getAvatarNoseOption(config.noseId);
  const canZoomIn = zoom < MAX_AVATAR_ZOOM;
  const canZoomOut = zoom > MIN_AVATAR_ZOOM;

  function handleZoomIn() {
    setZoom((currentZoom) => {
      const nextZoom = Math.min(MAX_AVATAR_ZOOM, currentZoom + AVATAR_ZOOM_STEP);

      setPan((currentPan) => clampPanPosition(currentPan, nextZoom));

      return nextZoom;
    });
  }

  function handleZoomOut() {
    setZoom((currentZoom) => {
      const nextZoom = Math.max(MIN_AVATAR_ZOOM, currentZoom - AVATAR_ZOOM_STEP);

      setPan((currentPan) => clampPanPosition(currentPan, nextZoom));

      return nextZoom;
    });
  }

  function clampPanPosition(nextPan: PanPosition, nextZoom: number) {
    if (nextZoom <= MIN_AVATAR_ZOOM) {
      return { x: 0, y: 0 };
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return nextPan;
    }

    const { height, width } = viewport.getBoundingClientRect();
    const maxX = (width * (nextZoom - 1)) / 2;
    const maxY = (height * (nextZoom - 1)) / 2;

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!enableZoomControls || zoom <= MIN_AVATAR_ZOOM) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      pointerId: event.pointerId,
      startPan: pan,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextPan = {
      x: dragState.startPan.x + event.clientX - dragState.startX,
      y: dragState.startPan.y + event.clientY - dragState.startY,
    };

    setPan(clampPanPosition(nextPan, zoom));
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }

  return (
    <div
      aria-label={`Avatar de ${playerName}`}
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-white [container-type:size]",
        className,
      )}
      ref={viewportRef}
      role="img"
    >
      <div
        className={cn(
          "absolute inset-0 origin-center",
          !isDragging && "transition-transform duration-200 ease-out",
          enableZoomControls && zoom > MIN_AVATAR_ZOOM && "touch-none",
          enableZoomControls && "select-none",
          enableZoomControls &&
            zoom > MIN_AVATAR_ZOOM &&
            (isDragging ? "cursor-grabbing" : "cursor-grab"),
        )}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
        }}
      >
        {variant === "face" ? (
          <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#f1f3f5_0%,#d9dee3_100%)]" />
        ) : (
          <Image
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
            draggable={false}
            height={1024}
            priority={imagePriority}
            src={backgroundOption.imageUrl ?? "/images/profile/campo.png"}
            width={1024}
          />
        )}

        <div
          className={cn(
            "absolute left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2",
            variant === "face"
              ? "top-[180%] size-[min(380cqw,380cqh)]"
              : "top-[58%] size-[min(86cqw,86cqh)]",
          )}
        >
          <Image
            alt=""
            className={cn(
              "absolute inset-0 z-[1] h-full w-full object-contain",
              bodyOption.className,
            )}
            draggable={false}
            height={1024}
            priority={imagePriority}
            src={bodyOption.imageUrl ?? "/images/profile/avatar_01.png"}
            width={1024}
          />

          <AvatarEyesSvg
            className={eyeOption.layerClassName}
            color={config.eyeColor}
            eyeId={config.eyeId}
          />

          <AvatarEyebrowsSvg
            className={eyebrowOption.layerClassName}
            color={config.eyebrowColor}
            eyebrowId={config.eyebrowId}
          />

          <AvatarNoseSvg
            className={noseOption.layerClassName}
            noseId={config.noseId}
          />

          <AvatarMouthSvg
            className={mouthOption.layerClassName}
            mouthId={config.mouthId}
          />

          {hairOption.imageUrl ? (
            <Image
              alt=""
              className={hairOption.layerClassName}
              draggable={false}
              height={300}
              priority={imagePriority}
              src={hairOption.imageUrl}
              width={300}
            />
          ) : null}
        </div>
      </div>

      {enableZoomControls ? (
        <div className="absolute bottom-3 right-3 z-20 flex overflow-hidden rounded-full border border-white/80 bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_8px_18px_rgba(0,0,0,0.18)] backdrop-blur">
          <Button
            aria-label="Diminuir zoom do avatar"
            className="flex h-9 w-9 items-center justify-center text-(--homepage-panel-text-strong) transition hover:bg-[var(--homepage-panel-surface-soft)] disabled:cursor-default disabled:opacity-40"
            disabled={!canZoomOut}
            onClick={handleZoomOut}
            size="none"
            title="Diminuir zoom"
            variant="unstyled"
          >
            <ZoomOut className="h-4 w-4" strokeWidth={2.6} />
          </Button>
          <Button
            aria-label="Aumentar zoom do avatar"
            className="flex h-9 w-9 items-center justify-center border-l border-(--homepage-panel-divider-soft) text-(--homepage-panel-text-strong) transition hover:bg-[var(--homepage-panel-surface-soft)] disabled:cursor-default disabled:opacity-40"
            disabled={!canZoomIn}
            onClick={handleZoomIn}
            size="none"
            title="Aumentar zoom"
            variant="unstyled"
          >
            <ZoomIn className="h-4 w-4" strokeWidth={2.6} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
