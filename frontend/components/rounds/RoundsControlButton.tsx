import type { ReactNode } from "react";

import { RoundsSecondaryButton } from "@/components/rounds/RoundsSecondaryButton";

export function RoundsControlButton({
  icon,
  iconPosition = "start",
  label,
  onClick,
}: Readonly<{
  icon: ReactNode;
  iconPosition?: "start" | "end";
  label: string;
  onClick: () => void;
}>) {
  return (
    <RoundsSecondaryButton className="space-x-1" onClick={onClick}>
      {iconPosition === "start" ? icon : null}
      <span>{label}</span>
      {iconPosition === "end" ? icon : null}
    </RoundsSecondaryButton>
  );
}
