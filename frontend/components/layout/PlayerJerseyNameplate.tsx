import { Shirt } from "lucide-react";

export function PlayerJerseyNameplate({
  playerName,
  primaryColor,
}: Readonly<{
  playerName: string;
  primaryColor: string;
}>) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-(--homepage-nameplate-background) px-2 py-1 shadow-[inset_0_1px_0_var(--homepage-nameplate-inset)]">
      <Shirt
        className="h-5 w-5 shrink-0 drop-shadow-[0_1px_2px_var(--homepage-nameplate-shadow)]"
        strokeWidth={1}
        fill={primaryColor}
        stroke={primaryColor}
      />
      <p className="truncate text-[13px] font-black uppercase tracking-[0.14em] text-white [text-shadow:0_1px_2px_var(--homepage-nameplate-text-shadow)]">
        {playerName}
      </p>
    </div>
  );
}
