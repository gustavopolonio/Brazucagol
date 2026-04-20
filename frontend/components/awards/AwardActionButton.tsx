import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

type AwardActionButtonProps = {
  onClick: () => void;
  title: string;
};

export function AwardActionButton({
  onClick,
  title,
}: Readonly<AwardActionButtonProps>) {
  return (
    <Button
      aria-label={`Abrir tabela de ${title}`}
      className="group flex w-full items-center justify-between gap-4 rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(246,246,246,0.96)_100%)] px-4 py-3 text-left shadow-[0_16px_32px_rgba(73,54,20,0.08)] hover:-translate-y-0.5 hover:border-[var(--homepage-account-item-hover-border)] hover:shadow-[0_22px_38px_rgba(73,54,20,0.12)]"
      onClick={onClick}
      radius="xl"
      variant="secondary"
    >
      <p className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
        {title}
      </p>

      <span className="flex items-center gap-0.5 text-sm text-[var(--homepage-highlight-label)]">
        Ver mais
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Button>
  );
}
