import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

export function RoundsIconButton({
  ariaLabel,
  icon,
  onClick,
}: Readonly<{
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
}>) {
  return (
    <Button
      aria-label={ariaLabel}
      className="border-transparent bg-transparent text-[var(--rounds-text-secondary)] shadow-none hover:text-[var(--homepage-panel-text-strong)]"
      onClick={onClick}
      radius="full"
      size="icon"
      variant="secondary"
    >
      {icon}
    </Button>
  );
}
