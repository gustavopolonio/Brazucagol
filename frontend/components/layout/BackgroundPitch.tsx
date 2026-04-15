import type { ReactNode } from "react";

export function BackgroundPitch({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,var(--homepage-pitch-highlight-strong)_0%,transparent_22%),radial-gradient(circle_at_72%_34%,var(--homepage-pitch-highlight-soft)_0%,transparent_18%),radial-gradient(circle_at_58%_78%,var(--homepage-pitch-vignette)_0%,transparent_24%),repeating-linear-gradient(90deg,var(--homepage-pitch-stripe-light)_0px,var(--homepage-pitch-stripe-light)_44px,var(--homepage-pitch-stripe-dark)_44px,var(--homepage-pitch-stripe-dark)_88px),linear-gradient(180deg,var(--homepage-pitch-gradient-top)_0%,var(--background)_100%)] opacity-100" />
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(var(--homepage-noise-dot)_0.8px,transparent_0.9px)] bg-size-[7px_7px]" />
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(120deg,transparent_0%,var(--homepage-sheen)_48%,transparent_52%)] bg-size-[180px_180px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-380 flex-col px-4 py-0 sm:px-5 lg:px-6">
        {children}
      </div>
    </main>
  );
}
