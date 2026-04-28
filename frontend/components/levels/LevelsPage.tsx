"use client";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  CircleDot,
  Crown,
  Flag,
  Flame,
  Gem,
  Medal,
  Rocket,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { LevelIconBadge } from "@/components/layout/LevelIconBadge";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { PanelCard } from "@/components/layout/PanelCard";
import { levels } from "@/components/levels/levels-data";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useSession } from "@/lib/auth-client";

const iconByName: Record<string, LucideIcon> = {
  award: Award,
  "circle-dot": CircleDot,
  crown: Crown,
  flag: Flag,
  flame: Flame,
  gem: Gem,
  medal: Medal,
  rocket: Rocket,
  shield: Shield,
  star: Star,
  target: Target,
  trophy: Trophy,
  zap: Zap,
};

const mockedLoggedPlayerGoalsTotal = 198;

export function LevelsPage() {
  useSession();
  // const playerName = session?.user.name;
  const playerName = 'Boexatinha';
  const currentLevel =
    [...levels]
      .reverse()
      .find((level) => mockedLoggedPlayerGoalsTotal >= level.goalsRequired) ?? levels[0];
  const nextLevel = levels.find((level) => level.levelNumber === currentLevel.levelNumber + 1);
  const currentLevelIcon = iconByName[currentLevel.iconName];
  const goalsRemaining = nextLevel
    ? Math.max(0, nextLevel.goalsRequired - mockedLoggedPlayerGoalsTotal)
    : 0;
  const currentLevelProgressStart = currentLevel.goalsRequired;
  const currentLevelProgressEnd = nextLevel?.goalsRequired ?? currentLevel.goalsRequired;
  const currentLevelProgressPercent = nextLevel
    ? ((mockedLoggedPlayerGoalsTotal - currentLevelProgressStart) /
        (currentLevelProgressEnd - currentLevelProgressStart)) *
      100
    : 100;
  const currentLevelProgressPercentLabel = `${Math.round(currentLevelProgressPercent)}%`;

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Níveis
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          {playerName ? (
            <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <LevelIconBadge
                    className="h-12 w-12"
                    icon={currentLevelIcon}
                    iconClassName="w-full h-full p-1"
                  />
                  <div className="min-w-0">
                    <p className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
                      {playerName}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--homepage-panel-text)] md:text-base">
                      Você está {currentLevel.name} - Nível {currentLevel.levelNumber}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="rounded-[22px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(246,250,237,0.98)_100%)] px-4 py-3 text-center shadow-[0_12px_30px_rgba(73,54,20,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--homepage-highlight-label)]">
                        Gols atuais
                    </p>
                    <p className="mt-3 text-3xl leading-none font-black text-[var(--homepage-record-value)]">
                      {mockedLoggedPlayerGoalsTotal}
                    </p>
                  </div>

                  {nextLevel && (
                    <div className="rounded-[22px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(246,250,237,0.98)_100%)] px-4 py-3 text-center shadow-[0_12px_30px_rgba(73,54,20,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--homepage-highlight-label)]">
                        Próximo nível
                      </p>
                      <p className="mt-3 text-3xl leading-none font-black text-[var(--homepage-record-value)]">
                        {nextLevel.goalsRequired}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {nextLevel && (
                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-left text-sm font-black text-[var(--homepage-highlight-label)]">
                      Faltam {goalsRemaining} gols para o Nível {nextLevel.levelNumber}
                    </p>
                    <p className="shrink-0 text-right text-sm font-black text-[var(--homepage-highlight-label)]">
                      {currentLevelProgressPercentLabel}
                    </p>
                  </div>
                  <ProgressBar progressPercent={currentLevelProgressPercent} />
                </div>
              )}
            </div>
          ) : null}

          <div className="px-3 py-3 md:px-5 md:py-5">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[linear-gradient(180deg,rgba(247,247,247,0.95)_0%,rgba(238,248,208,0.75)_100%)] text-[var(--homepage-panel-text-strong)]">
                    <TableHead>Nível</TableHead>
                    <TableHead>Momento da carreira</TableHead>
                    <TableHead>Gols necessários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level) => {
                    const LevelIcon = iconByName[level.iconName];
                    const isCurrentPlayerLevel =
                      Boolean(playerName) && level.levelNumber === currentLevel.levelNumber;

                    return (
                      <TableRow
                        className={
                          isCurrentPlayerLevel
                            ? "border-t border-[var(--homepage-highlight-border)] bg-[linear-gradient(90deg,rgba(238,248,208,0.95)_0%,rgba(238,248,208,0.6)_100%)] text-[var(--homepage-panel-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                            : "border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                        }
                        key={level.levelNumber}
                      >
                        <TableCell>
                          <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 text-sm font-black text-[var(--homepage-highlight-value)]">
                            {String(level.levelNumber).padStart(2, "0")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <LevelIconBadge className="h-9 w-9" icon={LevelIcon} />
                            <span className="text-base font-black text-[var(--homepage-panel-text-strong)]">
                              {level.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-lg font-black text-[var(--homepage-record-value)]">
                            {level.goalsRequired}
                          </span>
                          <span className="ml-2 mr-8 text-sm font-bold text-[var(--homepage-panel-text-muted)]">
                            gols
                          </span>
                          {isCurrentPlayerLevel && (
                            <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 text-sm font-black text-[var(--homepage-highlight-value)]">
                              Seu nível
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
