import type { RoundMatch } from "@/components/rounds/rounds-data";

export function MatchStatusBadge({
  status,
}: Readonly<{
  status: RoundMatch["status"];
}>) {
  const label =
    status === "scheduled" ? "Abre com a rodada" : status === "live" ? "Ao vivo" : "Placar final";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-(--homepage-nameplate-background) px-3 py-1.5 shadow-[inset_0_1px_0_var(--homepage-nameplate-inset)]">
      {status === "live" ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--rounds-live-end)] shadow-[0_0_0_3px_rgba(53,240,140,0.16)]" />
      ) : null}
      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white [text-shadow:0_1px_2px_var(--homepage-nameplate-text-shadow)]">
        {label}
      </span>
    </div>
  );
}
