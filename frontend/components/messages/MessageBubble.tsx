import { cn } from "@/lib/cn";
import type { MessageCategory, MessageItem } from "@/components/messages/messages-data";

const senderNameColors = [
  "#2563eb",
  "#16a34a",
  "#db2777",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#dc2626",
  "#4f46e5",
  "#0f766e",
  "#be185d",
  "#b45309",
  "#4338ca",
  "#047857",
  "#c026d3",
  "#1d4ed8",
];

export function MessageBubble({
  colorAuthorName,
  isGroupedWithPrevious,
  message,
  messageCategory,
}: Readonly<{
  colorAuthorName?: boolean;
  isGroupedWithPrevious?: boolean;
  message: MessageItem;
  messageCategory: MessageCategory;
}>) {
  const shouldShowAuthorName =
    !isGroupedWithPrevious &&
    (messageCategory === "system" ||
      ((messageCategory === "club" || messageCategory === "global") && !message.isOwn));
  const authorNameColor = getAuthorNameColor({
    colorAuthorName,
    message,
    messageCategory,
  });

  return (
    <article
      className={cn(
        "relative flex w-fit max-w-[88%] flex-col gap-1 rounded-[10px] px-3 py-2 shadow-[0_8px_18px_rgba(73,54,20,0.08)] before:pointer-events-none after:pointer-events-none [&>*]:relative [&>*]:z-10",
        message.isOwn
          ? cn(
            "ml-auto border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] text-[var(--homepage-highlight-value)]",
            isGroupedWithPrevious
              ? "gap-0"
              : "rounded-tr-[1px] before:absolute before:-right-[11px] before:top-[-1px] before:h-[14px] before:w-[11px] before:bg-[var(--homepage-highlight-border)] before:[clip-path:polygon(0_0,100%_0,0_100%)] before:content-[''] after:absolute after:-right-[9px] after:top-0 after:h-3 after:w-[9px] after:bg-[var(--homepage-highlight-start)] after:[clip-path:polygon(0_0,100%_0,0_100%)] after:content-['']",
          )
          : cn(
            "mr-auto border border-[var(--homepage-panel-divider)] bg-white text-[var(--homepage-panel-text)]",
            isGroupedWithPrevious
              ? "gap-0"
              : "rounded-tl-[1px] before:absolute before:-left-[11px] before:top-[-1px] before:h-[14px] before:w-[11px] before:bg-[var(--homepage-panel-divider)] before:[clip-path:polygon(0_0,100%_0,100%_100%)] before:content-[''] after:absolute after:-left-[9px] after:top-0 after:h-3 after:w-[9px] after:bg-white after:[clip-path:polygon(0_0,100%_0,100%_100%)] after:content-['']",
          ),
      )}
    >
      {shouldShowAuthorName ? (
        <span className="text-sm font-black" style={{ color: authorNameColor }}>
          {message.authorName}
        </span>
      ) : null}
      <p className="flex items-end justify-between gap-2 text-sm font-semibold leading-relaxed">
        <span className="min-w-0 whitespace-pre-wrap wrap-anywhere">{message.body}</span>
        <time className="inline-block shrink-0 break-normal align-baseline text-[12px] font-bold leading-none opacity-70">
          {message.sentAt}
        </time>
      </p>
    </article>
  );
}

function getSenderColorIndex(authorName: string) {
  return Array.from(authorName).reduce(
    (currentHash, character) => (currentHash * 31 + character.charCodeAt(0)) >>> 0,
    7,
  ) % senderNameColors.length;
}

function getAuthorNameColor({
  colorAuthorName,
  message,
  messageCategory,
}: {
  colorAuthorName?: boolean;
  message: MessageItem;
  messageCategory: MessageCategory;
}) {
  if (messageCategory === "system") {
    return message.authorName === "Loja" ? "#db2777" : "#2563eb";
  }

  if (messageCategory === "private") {
    return "#16a34a";
  }

  if (colorAuthorName && !message.isOwn) {
    return senderNameColors[getSenderColorIndex(message.authorName)];
  }

  return undefined;
}
