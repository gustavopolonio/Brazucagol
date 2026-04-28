import { Medal, Star } from "lucide-react";

import type { RolePresentation } from "@/components/profile/profileTypes";

export const numberFormatter = new Intl.NumberFormat("pt-BR");
export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function calculateConversionPercent(convertedGoals: number, totalTries: number) {
  if (totalTries <= 0) {
    return 0;
  }

  return Math.round((convertedGoals / totalTries) * 100);
}

export function formatSeasonLabel(seasonNumber: number) {
  return `${seasonNumber}ª temporada`;
}

export function formatPlacementLabel(placement: number) {
  return `${placement}º lugar`;
}

export function renderPlacementIcon(placement: number) {
  if (placement === 1) {
    return <Medal className="h-4 w-4 text-[#d4a017]" strokeWidth={2.2} />;
  }

  if (placement === 2) {
    return <Medal className="h-4 w-4 text-[#9aa4b2]" strokeWidth={2.2} />;
  }

  if (placement === 3) {
    return <Medal className="h-4 w-4 text-[#b56a3c]" strokeWidth={2.2} />;
  }

  return <Star className="h-4 w-4 text-[var(--homepage-highlight-label)]" strokeWidth={2.2} />;
}

export function getTopRankBallImage(overallTopRank?: number) {
  if (!overallTopRank || overallTopRank < 1 || overallTopRank > 10) {
    return null;
  }

  if (overallTopRank === 1) {
    return "/images/ui/gold-ball.png";
  }

  if (overallTopRank === 2) {
    return "/images/ui/silver-ball.png";
  }

  if (overallTopRank === 3) {
    return "/images/ui/bronze-ball.png";
  }

  return "/images/ui/white-ball.png";
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function buildCompactRoleLabel(roleLabel: string) {
  const roleParts = roleLabel
    .split(/[\s-]+/)
    .map((rolePart) => rolePart.trim())
    .filter(Boolean);

  if (roleParts.length === 0) {
    return "";
  }

  if (roleParts.length === 1) {
    return roleParts[0].slice(0, 1).toUpperCase();
  }

  return roleParts
    .slice(0, 2)
    .map((rolePart) => rolePart.slice(0, 1).toUpperCase())
    .join("");
}

export function getRolePresentation(roleLabel: string): RolePresentation {
  const normalizedRoleLabel = normalizeText(roleLabel);

  switch (normalizedRoleLabel) {
  case "presidente":
    return {
      compactLabel: "P",
      fullLabel: "Presidente",
      colorClassName: "border-fuchsia-800 bg-fuchsia-600 text-white",
    };
  case "vice presidente":
  case "vice-presidente":
    return {
      compactLabel: "VP",
      fullLabel: "Vice-presidente",
      colorClassName: "border-fuchsia-800 bg-fuchsia-600 text-white",
    };
  case "diretor":
    return {
      compactLabel: "D",
      fullLabel: "Diretor",
      colorClassName: "border-zinc-950 bg-zinc-800 text-white",
    };
  case "capitao":
  case "capitão":
    return {
      compactLabel: "C",
      fullLabel: "Capitão",
      colorClassName: "border-amber-700 bg-amber-400 text-amber-950",
    };
  default:
    return {
      compactLabel: buildCompactRoleLabel(roleLabel),
      fullLabel: roleLabel,
      colorClassName: "border-slate-700 bg-slate-500 text-white",
    };
  }
}
