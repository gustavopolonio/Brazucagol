import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function TableContainer({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"div">>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[22px] border border-[var(--homepage-panel-divider)] bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function Table({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"table">>) {
  return <table className={cn("min-w-full border-collapse text-left", className)} {...props} />;
}

export function TableHeader({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"thead">>) {
  return <thead className={className} {...props} />;
}

export function TableBody({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"tbody">>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"tr">>) {
  return <tr className={className} {...props} />;
}

export function TableHead({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"th">>) {
  return (
    <th
      className={cn("px-4 py-4 text-xs font-black uppercase tracking-[0.18em]", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<"td">>) {
  return <td className={cn("px-4 py-4 align-middle", className)} {...props} />;
}
