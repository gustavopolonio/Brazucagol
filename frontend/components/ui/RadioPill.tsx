import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type RadioPillProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
};

export function RadioPill({
  checked,
  children,
  className,
  ...props
}: Readonly<RadioPillProps>) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-black transition",
        checked
          ? "border-[var(--homepage-highlight-label)] bg-white/78 shadow-[0_0_0_1px_var(--homepage-highlight-label)_inset]"
          : "border-transparent bg-white/78 hover:brightness-105",
        className,
      )}
    >
      <input checked={checked} className="sr-only" type="radio" {...props} />
      {children}
    </label>
  );
}
