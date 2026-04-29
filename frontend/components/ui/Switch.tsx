"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-checked" | "role"
> & {
  checked: boolean;
};

export function Switch({
  checked,
  className,
  disabled,
  ...props
}: Readonly<SwitchProps>) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--homepage-highlight-label)]",
        checked
          ? "border-[var(--homepage-partner-border)] bg-[linear-gradient(180deg,var(--homepage-partner-start)_0%,var(--homepage-partner-end)_100%)] shadow-[0_3px_0_var(--homepage-partner-shadow)]"
          : "border-[var(--homepage-account-item-border)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-account-item-end)_100%)] shadow-[0_1px_0_var(--homepage-account-item-inset)_inset]",
        disabled ? "cursor-default opacity-60" : "cursor-pointer",
        className,
      )}
      disabled={disabled}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          "h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(26,21,14,0.24)] transition-transform",
          checked ? "translate-x-6" : "translate-x-0",
        )}
      />
    </button>
  );
}
