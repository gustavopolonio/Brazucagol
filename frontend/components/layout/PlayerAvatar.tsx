import Image from "next/image";
import { UserRound } from "lucide-react";

export function PlayerAvatar({
  playerName,
  avatarUrl,
}: Readonly<{
  playerName: string;
  avatarUrl?: string;
}>) {
  if (avatarUrl) {
    return (
      <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/90 bg-[linear-gradient(180deg,var(--homepage-avatar-skin-start)_0%,var(--homepage-avatar-skin-end)_100%)] shadow-[0_2px_4px_var(--homepage-avatar-shadow)]">
        <Image
          alt={`Avatar de ${playerName}`}
          className="h-full w-full object-cover"
          height={36}
          src={avatarUrl}
          width={36}
        />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/90 bg-[linear-gradient(180deg,var(--homepage-avatar-fallback-start)_0%,var(--homepage-avatar-fallback-end)_100%)] shadow-[0_2px_4px_var(--homepage-avatar-shadow)]">
      <UserRound className="h-5 w-5 text-white" strokeWidth={2.5} />
    </div>
  );
}
