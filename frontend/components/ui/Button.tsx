import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant =
  | "unstyled"
  | "primary"
  | "secondary"
  | "destructive"
  | "carousel"
  | "menu";

type ButtonSize =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "compact"
  | "icon";

type ButtonRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  radius?: ButtonRadius;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
  unstyled: "",
  primary:
    "inline-flex items-center justify-center border border-[var(--homepage-partner-border)] bg-[linear-gradient(180deg,var(--homepage-partner-start)_0%,var(--homepage-partner-end)_100%)] text-white shadow-[0_4px_0_var(--homepage-partner-shadow)] hover:brightness-105",
  secondary:
    "inline-flex items-center justify-center border border-[var(--homepage-account-item-border)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-account-item-end)_100%)] text-[var(--homepage-panel-text-strong)] shadow-[0_1px_0_var(--homepage-account-item-inset)_inset] hover:border-[var(--homepage-account-item-hover-border)] hover:bg-[linear-gradient(180deg,var(--homepage-account-item-hover-start)_0%,var(--homepage-account-item-hover-end)_100%)] hover:shadow-[0_1px_0_var(--homepage-account-item-hover-inset)_inset,0_6px_12px_var(--homepage-account-item-hover-shadow)]",
  destructive:
    "inline-flex items-center justify-center border border-[var(--homepage-logout-border)] bg-[linear-gradient(180deg,var(--homepage-logout-start)_0%,var(--homepage-logout-end)_100%)] text-white shadow-[0_1px_0_var(--homepage-logout-inset)_inset] hover:brightness-110",
  carousel:
    "inline-flex items-center justify-center border border-[var(--homepage-carousel-border)] bg-[linear-gradient(180deg,var(--homepage-carousel-start)_0%,var(--homepage-carousel-end)_100%)] text-[var(--homepage-carousel-foreground)] shadow-[0_2px_0_var(--homepage-carousel-inset)_inset,0_4px_10px_var(--homepage-carousel-shadow)] hover:brightness-105",
  menu:
    "w-full flex items-center justify-between text-left text-[15px] font-black text-[var(--homepage-panel-text)] hover:bg-[var(--homepage-panel-hover)] hover:text-[var(--homepage-panel-hover-foreground)]",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  none: "",
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-4 py-3",
  compact: "px-4 py-1",
  icon: "h-10 w-10",
};

const buttonRadiusClasses: Record<ButtonRadius, string> = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-[6px]",
  lg: "rounded-[10px]",
  xl: "rounded-[14px]",
  full: "rounded-full",
};

export function Button({
  children,
  className,
  radius = "none",
  size = "none",
  type = "button",
  variant = "unstyled",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={cn(
        "cursor-pointer transition disabled:cursor-default disabled:opacity-60",
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        buttonRadiusClasses[radius],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
