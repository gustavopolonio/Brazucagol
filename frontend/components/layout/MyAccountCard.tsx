"use client";

import { usePathname, useRouter } from "next/navigation";

import { PanelCard } from "@/components/layout/PanelCard";
import type { AccountOption } from "@/components/layout/layoutTypes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ArrowLeftRight, Mail, Settings, Star, User } from "lucide-react";

const accountOptionIcons = {
  mail: Mail,
  user: User,
  "arrow-left-right": ArrowLeftRight,
  star: Star,
  settings: Settings,
} as const;

const accountOptions: AccountOption[] = [
  { label: "Mensagens", iconName: "mail", primaryColor: "var(--account-messages-primary)", secondaryColor: "var(--account-messages-secondary)", unreadCount: 12 },
  { label: "Perfil", href: "/perfil", iconName: "user", primaryColor: "var(--account-profile-primary)", secondaryColor: "var(--account-profile-secondary)" },
  { label: "Trocar Time", iconName: "arrow-left-right", primaryColor: "var(--account-switch-club-primary)", secondaryColor: "var(--account-switch-club-secondary)" },
  { label: "Meus VIPs", iconName: "star", primaryColor: "var(--account-vips-primary)", secondaryColor: "var(--account-vips-secondary)" },
  { label: "Configurações", iconName: "settings", primaryColor: "var(--account-settings-primary)", secondaryColor: "var(--account-settings-secondary)" },
];

export function MyAccountCard() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <PanelCard title="MINHA CONTA">
      <div className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)] p-4 pt-8">
        <div className="space-y-2">
          {accountOptions.map((accountOption) => {
            const AccountOptionIcon = accountOptionIcons[accountOption.iconName];
            const optionHref = accountOption.href;
            const isUnavailable = !optionHref;
            const isSelected = optionHref ? pathname === optionHref : false;

            return (
              <Button
                className={cn(
                  "justify-start gap-3 rounded-[14px] px-3 py-2.5 duration-150",
                  isSelected
                    ? "bg-[linear-gradient(180deg,var(--rounds-highlight-start)_0%,var(--rounds-highlight-end)_100%)] text-[var(--rounds-highlight-text)] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]"
                    : "",
                  isUnavailable
                    ? "border border-dashed border-[var(--homepage-panel-divider)] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.78)_0px,rgba(255,255,255,0.78)_8px,rgba(229,233,219,0.82)_8px,rgba(229,233,219,0.82)_16px)] text-[var(--homepage-panel-text-muted)] hover:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.78)_0px,rgba(255,255,255,0.78)_8px,rgba(229,233,219,0.82)_8px,rgba(229,233,219,0.82)_16px)] hover:text-[var(--homepage-panel-text-muted)]"
                    : "",
                )}
                disabled={isUnavailable}
                key={accountOption.label}
                onClick={optionHref ? () => router.push(optionHref, { scroll: false }) : undefined}
                variant="menu"
              >
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <AccountOptionIcon
                    className="h-5 w-5"
                    strokeWidth={2.5}
                    style={{
                      color: accountOption.primaryColor,
                      filter: `drop-shadow(0 0 1px ${accountOption.secondaryColor}) drop-shadow(0 0 4px ${accountOption.secondaryColor})`,
                    }}
                  />
                  {accountOption.unreadCount ? (
                    <span className="absolute -bottom-1 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full border border-white bg-[linear-gradient(180deg,var(--homepage-notification-start)_0%,var(--homepage-notification-end)_100%)] px-1 text-[9px] font-black leading-none text-white shadow-[0_1px_0_var(--homepage-topbar-inset)_inset,0_2px_5px_var(--homepage-notification-shadow)]">
                      {accountOption.unreadCount > 99 ? "99+" : accountOption.unreadCount}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "",
                    isSelected ? "text-[var(--rounds-highlight-text)]" : "",
                  )}
                >
                  {accountOption.label}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-(--homepage-vip-border) bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] px-2 py-1 text-center shadow-[0_4px_0_var(--homepage-vip-shadow)]">
          <p className="text-[12px] font-black tracking-[0.18em] text-(--homepage-vip-text)">VIP 7 dias 10 minutos</p>
        </div>
      </div>
    </PanelCard>
  );
}
