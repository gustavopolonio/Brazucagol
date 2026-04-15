export function OldScoreboardLogo() {
  return (
    <div className="relative w-[318px]">
      <div className="relative overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,var(--homepage-logo-frame-top)_0%,var(--homepage-logo-frame-upper-mid)_24%,var(--homepage-logo-frame-mid)_52%,var(--homepage-logo-frame-lower-mid)_78%,var(--homepage-logo-frame-bottom)_100%)] p-[4px] shadow-[0_16px_26px_var(--homepage-logo-frame-shadow)]">
        <div className="relative overflow-hidden rounded-[8px] border-[3px] border-[var(--homepage-logo-screen-border)] bg-[var(--homepage-logo-screen-background)] px-8 py-4 shadow-[inset_0_2px_0_var(--homepage-logo-screen-inset-top),inset_0_-16px_30px_var(--homepage-logo-screen-inset-bottom)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--homepage-logo-radial-start)_0%,var(--homepage-logo-radial-end)_72%)]" />
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(var(--homepage-logo-grid)_1px,transparent_1px),linear-gradient(90deg,var(--homepage-logo-grid)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--homepage-logo-shine-start)_0%,transparent_22%,transparent_78%,var(--homepage-logo-shine-end)_100%)]" />

          <h1 className="relative text-left leading-none">
            <span className="block font-mono text-[50px] font-black uppercase tracking-[0.08em] text-[var(--homepage-logo-brazuca)] [text-shadow:0_0_5px_var(--homepage-logo-brazuca-glow-strong),0_0_12px_var(--homepage-logo-brazuca-glow-soft)]">
              BRAZUCA
            </span>
            <span className="mt-2 block font-mono text-[42px] font-black uppercase tracking-[0.14em] text-[var(--homepage-logo-gol)] [text-shadow:0_0_6px_var(--homepage-logo-gol-glow-strong),0_0_14px_var(--homepage-logo-gol-glow-soft),0_0_2px_var(--homepage-logo-gol-glow-blue)]">
              GOL
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
