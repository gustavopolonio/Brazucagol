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

import { levels, type LevelData, type LevelIconName } from "@/components/levels/levels-data";

export const levelIconByName: Record<LevelIconName, LucideIcon> = {
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

export function getLevelForGoals(totalGoals: number): LevelData {
  return [...levels].reverse().find((level) => totalGoals >= level.goalsRequired) ?? levels[0];
}
