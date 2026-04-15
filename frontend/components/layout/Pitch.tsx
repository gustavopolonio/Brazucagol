import type { ReactNode } from "react";

export function Pitch({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative overflow-hidden rounded-sm border-[3px] border-white/90 bg-[repeating-linear-gradient(90deg,var(--homepage-card-pitch-stripe-light)_0px,var(--homepage-card-pitch-stripe-light)_56px,var(--homepage-card-pitch-stripe-dark)_56px,var(--homepage-card-pitch-stripe-dark)_112px)] p-4 shadow-[0_10px_20px_var(--homepage-card-shadow),inset_0_0_0_2px_var(--homepage-card-inset)]">
      <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-0.75 -translate-x-1/2 bg-white/65" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/65" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/75" />

      <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-br-full border-b-[3px] border-r-[3px] border-white/80" />
      <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 rounded-bl-full border-b-[3px] border-l-[3px] border-white/80" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 rounded-tr-full border-r-[3px] border-t-[3px] border-white/80" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 rounded-tl-full border-l-[3px] border-t-[3px] border-white/80" />

      <div className="pointer-events-none absolute left-0 top-1/2 h-44 w-28 -translate-y-1/2 border-[3px] border-l-0 border-white/65" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-44 w-28 -translate-y-1/2 border-[3px] border-r-0 border-white/65" />

      <div className="pointer-events-none absolute left-0 top-1/2 h-24 w-12 -translate-y-1/2 border-[3px] border-l-0 border-white/65" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-24 w-12 -translate-y-1/2 border-[3px] border-r-0 border-white/65" />

      <div className="pointer-events-none absolute left-24 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white/75" />
      <div className="pointer-events-none absolute right-24 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white/75" />

      <div className="pointer-events-none absolute left-27.5 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/65 [clip-path:inset(0_0_0_50%)]" />
      <div className="pointer-events-none absolute right-27.5 top-1/2 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/65 [clip-path:inset(0_50%_0_0)]" />

      {children}
    </div>
  );
}
