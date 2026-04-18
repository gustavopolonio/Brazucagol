"use client";

import { useState } from "react";

import { PanelCard } from "@/components/layout/PanelCard";
import { RoundsDayView } from "@/components/rounds/RoundsDayView";
import { RoundsMonthView } from "@/components/rounds/RoundsMonthView";
import {
  addMonths,
  buildRoundsTimeline,
  getCurrentRoundStart,
  type RoundSchedule,
} from "@/components/rounds/rounds-data";
import type { ViewMode } from "@/components/rounds/rounds-view-mode";
import { CalendarDays } from "lucide-react";

export function RoundsPage() {
  const [referenceDate] = useState(() => new Date());
  const currentRoundStart = getCurrentRoundStart(referenceDate);
  const rounds = buildRoundsTimeline(currentRoundStart, referenceDate);
  const roundsByKey = new Map(rounds.map((round) => [round.roundKey, round]));
  const currentRound = rounds.find((round) => round.roundKey === currentRoundStart.toISOString()) ?? rounds[0];
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedRoundKey, setSelectedRoundKey] = useState(currentRound.roundKey);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentRound.roundStart.getFullYear(), currentRound.roundStart.getMonth(), 1)
  );

  const selectedRound = roundsByKey.get(selectedRoundKey) ?? currentRound;
  const selectedCompetition = selectedRound.activeCompetitions[0];
  const selectedRoundIndex = rounds.findIndex((round) => round.roundKey === selectedRound.roundKey);

  const changeRound = (direction: -1 | 1) => {
    const nextRoundIndex = selectedRoundIndex + direction;
    const nextRoundSchedule = rounds[nextRoundIndex];

    if (!nextRoundSchedule) {
      return;
    }

    setSelectedRoundKey(nextRoundSchedule.roundKey);
    setSelectedMonth(
      new Date(nextRoundSchedule.roundStart.getFullYear(), nextRoundSchedule.roundStart.getMonth(), 1)
    );
  };

  const changeMonth = (direction: -1 | 1) => {
    setSelectedMonth((currentMonth) => addMonths(currentMonth, direction));
  };

  const selectRound = (round: RoundSchedule) => {
    setSelectedRoundKey(round.roundKey);
    setSelectedMonth(new Date(round.roundStart.getFullYear(), round.roundStart.getMonth(), 1));
  };

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Acompanhe todas as rodadas da temporada
        </span>
      }
    >
      <main className="space-y-5 rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        {viewMode === "day" ? (
          <RoundsDayView
            onChangeRound={changeRound}
            onSelectCurrentRound={() => setSelectedRoundKey(currentRound.roundKey)}
            onViewModeChange={setViewMode}
            selectedCompetition={selectedCompetition}
            selectedRound={selectedRound}
            viewMode={viewMode}
          />
        ) : (
          <RoundsMonthView
            currentRound={currentRound}
            onChangeMonth={changeMonth}
            onRoundSelect={(round) => {
              selectRound(round);
              setViewMode("day");
            }}
            onSelectCurrentMonth={() => {
              setSelectedMonth(
                new Date(currentRound.roundStart.getFullYear(), currentRound.roundStart.getMonth(), 1)
              );
            }}
            onViewModeChange={setViewMode}
            roundsByKey={roundsByKey}
            selectedMonth={selectedMonth}
            selectedRound={selectedRound}
            viewMode={viewMode}
          />
        )}
      </main>
    </PanelCard>
  );
}
