import Image from "next/image";

export function ClubBadge({
  shortName,
  imageUrl,
}: Readonly<{
  shortName: string;
  imageUrl?: string;
  size?: "small" | "regular";
}>) {

  return (
    <span
      className= "inline-flex items-center justify-center overflow-hidden text-center font-black uppercase tracking-[0.08em] text-foreground max-w-23 w-full"
    >
      {imageUrl ? (
        <Image
          alt={`Escudo ${shortName}`}
          className="h-full w-full object-cover"
          src={imageUrl}
          width={100}
          height={100}
        />
      ) : (
        shortName
      )}
    </span>
  );
}
