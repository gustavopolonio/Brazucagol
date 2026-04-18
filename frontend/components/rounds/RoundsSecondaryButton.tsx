import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type RoundsSecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export function RoundsSecondaryButton({
  active,
  children,
  className,
  ...buttonProps
}: Readonly<RoundsSecondaryButtonProps>) {
  return (
    <Button
      className={cn(
        "rounded-full px-4 py-2 text-[13px] font-black tracking-[0.08em]",
        active
          ? "bg-[linear-gradient(135deg,var(--rounds-highlight-start)_0%,var(--rounds-highlight-end)_100%)] text-[var(--rounds-highlight-text)]"
          : "",
        className
      )}
      radius="full"
      variant={active ? "unstyled" : "secondary"}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
