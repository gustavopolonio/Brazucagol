'use client';

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { ActionButtonData } from "@/components/layout/layoutTypes";

export function ActionButton({ actionButton }: Readonly<{ actionButton: ActionButtonData }>) {
  const [remainingSeconds, setRemainingSeconds] = useState(actionButton.cooldownRemainingSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentRemainingSeconds) => {
        if (currentRemainingSeconds <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return currentRemainingSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds]);

  const progressPercent = useMemo(() => {
    if (actionButton.cooldownTotalSeconds <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.max(0, ((actionButton.cooldownTotalSeconds - remainingSeconds) / actionButton.cooldownTotalSeconds) * 100),
    );
  }, [actionButton.cooldownTotalSeconds, remainingSeconds]);

  const isAvailable = remainingSeconds <= 0;

  return (
    <Button className="group flex min-h-27 flex-col items-center justify-end gap-2 text-center transition hover:-translate-y-1" variant="unstyled">
      <span
        className="relative flex h-19.5 w-19.5 items-center justify-center rounded-full p-1.5 shadow-[0_4px_0_var(--homepage-action-shadow)]"
        style={{
          background: `conic-gradient(from 0deg, ${actionButton.primaryColor} 0deg ${progressPercent * 3.6}deg, var(--homepage-action-track) ${progressPercent * 3.6}deg 360deg)`,
        }}
      >
        <span
          className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-(--homepage-action-inner-border) text-sm font-black uppercase tracking-[0.18em] text-foreground"
          style={{
            background: `linear-gradient(180deg, ${actionButton.secondaryColor} 0%, ${actionButton.primaryColor} 100%)`,
          }}
        >
          {isAvailable ? (
            <Image
              alt="Bola de futebol"
              className="h-full w-full animate-[spin_7.4s_linear_infinite] object-contain drop-shadow-[0_1px_2px_var(--homepage-action-ball-shadow)]"
              width={44}
              height={44}
              src="/images/ui/soccer-ball.png"
            />
          ) : (
            <span className="text-[18px] font-black tracking-[0.02em] text-white drop-shadow-[0_1px_2px_var(--homepage-action-text-shadow)]">
              {formatCooldown(remainingSeconds)}
            </span>
          )}
        </span>
      </span>
      <span className="text-[13px] font-black uppercase tracking-[0.14em] text-white">{actionButton.label}</span>
    </Button>
  );
}

function formatCooldown(remainingSeconds: number) {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  if (hours > 0) {
    return `${hours}:${padTime(minutes)}:${padTime(seconds)}`;
  }

  return `${minutes}:${padTime(seconds)}`;
}

function padTime(value: number) {
  return value.toString().padStart(2, "0");
}
