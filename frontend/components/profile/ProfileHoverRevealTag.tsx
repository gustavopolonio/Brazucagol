import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function ProfileHoverRevealTag({
  compactLabel,
  fullLabel,
  className,
  ...props
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement> & {
  compactLabel: ReactNode;
  fullLabel: string;
  className: string;
}>) {
  return (
    <button
      className={cn(
        "group/tag inline-flex h-10 w-fit items-center overflow-hidden rounded-[16px] border text-sm font-black uppercase tracking-[0.12em]",
        "cursor-default transition enabled:cursor-pointer enabled:hover:brightness-105",
        className,
      )}
      title={fullLabel}
      type="button"
      {...props}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center leading-none">
        {compactLabel}
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 opacity-0 transition-all duration-200 ease-out group-hover/tag:max-w-40 group-hover/tag:pr-3 group-hover/tag:opacity-100 group-focus-within/tag:max-w-40 group-focus-within/tag:pr-3 group-focus-within/tag:opacity-100">
        {fullLabel}
      </span>
    </button>
  );
}
