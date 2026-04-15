"use client";

import { useEffect, useRef } from "react";

import { ClubBadge } from "@/components/layout/ClubBadge";
import type { ClubBadgeData } from "@/components/layout/layoutTypes";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const clubBadgeImageUrls = {
  cruzeiro: "https://escudosfc.com.br/images/cruzeiro.png",
  atletico: "https://escudosfc.com.br/images/atletico.png",
  bahia: "https://escudosfc.com.br/images/bahia.png",
  botafogo: "https://escudosfc.com.br/images/botafogo.gif",
  chapecoense: "https://escudosfc.com.br/images/chapeco.png",
  fluminense: "https://escudosfc.com.br/images/fluminense.png",
  bragantino: "https://escudosfc.com.br/images/bragantino.png",
  palmeiras: "https://escudosfc.com.br/images/palmeiras.png",
  mirassol: "https://escudosfc.com.br/images/mirassol.jpg",
  internacional: "https://escudosfc.com.br/images/interrs.png",
  santos: "https://escudosfc.com.br/images/santos.png",
  saoPaulo: "https://escudosfc.com.br/images/saopaulo.png",
} as const;

const clubBadges: ClubBadgeData[] = [
  { id: 1, name: "Cruzeiro", shortName: "CRU", imageUrl: clubBadgeImageUrls.cruzeiro },
  { id: 2, name: "Atlético Mineiro", shortName: "CAM", imageUrl: clubBadgeImageUrls.atletico },
  { id: 3, name: "Bahia", shortName: "BAH", imageUrl: clubBadgeImageUrls.bahia },
  { id: 4, name: "Botafogo", shortName: "BOT", imageUrl: clubBadgeImageUrls.botafogo },
  { id: 5, name: "Chapecoense", shortName: "CHA", imageUrl: clubBadgeImageUrls.chapecoense },
  { id: 6, name: "Fluminense", shortName: "FLU", imageUrl: clubBadgeImageUrls.fluminense },
  { id: 7, name: "Red Bull Bragantino", shortName: "RBB", imageUrl: clubBadgeImageUrls.bragantino },
  { id: 8, name: "Palmeiras", shortName: "PAL", imageUrl: clubBadgeImageUrls.palmeiras },
  { id: 9, name: "Mirassol", shortName: "MIR", imageUrl: clubBadgeImageUrls.mirassol },
  { id: 10, name: "Internacional", shortName: "INT", imageUrl: clubBadgeImageUrls.internacional },
  { id: 11, name: "Santos", shortName: "SAN", imageUrl: clubBadgeImageUrls.santos },
  { id: 12, name: "São Paulo", shortName: "SAO", imageUrl: clubBadgeImageUrls.saoPaulo },
  { id: 13, name: "Cruzeiro", shortName: "CRU", imageUrl: clubBadgeImageUrls.cruzeiro },
  { id: 24, name: "Atlético Mineiro", shortName: "CAM", imageUrl: clubBadgeImageUrls.atletico },
  { id: 35, name: "Bahia", shortName: "BAH", imageUrl: clubBadgeImageUrls.bahia },
  { id: 46, name: "Botafogo", shortName: "BOT", imageUrl: clubBadgeImageUrls.botafogo },
  { id: 57, name: "Chapecoense", shortName: "CHA", imageUrl: clubBadgeImageUrls.chapecoense },
  { id: 68, name: "Fluminense", shortName: "FLU", imageUrl: clubBadgeImageUrls.fluminense },
  { id: 79, name: "Red Bull Bragantino", shortName: "RBB", imageUrl: clubBadgeImageUrls.bragantino },
  { id: 80, name: "Palmeiras", shortName: "PAL", imageUrl: clubBadgeImageUrls.palmeiras },
  { id: 229, name: "Mirassol", shortName: "MIR", imageUrl: clubBadgeImageUrls.mirassol },
  { id: 120, name: "Internacional", shortName: "INT", imageUrl: clubBadgeImageUrls.internacional },
  { id: 1143, name: "Santos", shortName: "SAN", imageUrl: clubBadgeImageUrls.santos },
  { id: 123, name: "São Paulo", shortName: "SAO", imageUrl: clubBadgeImageUrls.saoPaulo },
];

export function ClubBadgeList() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const segmentWidthRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer || clubBadges.length === 0) {
      return;
    }

    const segmentWidth = scrollContainer.scrollWidth / 3;

    segmentWidthRef.current = segmentWidth;
    scrollContainer.scrollLeft = segmentWidth;
  }, []);

  function scrollBadges(direction: "previous" | "next") {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const scrollAmount = Math.max(180, Math.floor(scrollContainer.clientWidth * 0.72));
    const edgeThreshold = 8;
    const segmentWidth = segmentWidthRef.current;

    if (segmentWidth > 0) {
      if (direction === "next" && scrollContainer.scrollLeft >= segmentWidth * 2 - edgeThreshold) {
        scrollContainer.scrollLeft -= segmentWidth;
      }

      if (direction === "previous" && scrollContainer.scrollLeft <= segmentWidth + edgeThreshold) {
        scrollContainer.scrollLeft += segmentWidth;
      }
    }

    scrollContainer.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  const repeatedBadges = [...clubBadges, ...clubBadges, ...clubBadges];

  return (
    <section className="px-4 py-3">
      <div className="relative flex items-center gap-3">
        <Button
          aria-label="Clubes anteriores"
          className="shrink-0"
          onClick={() => scrollBadges("previous")}
          radius="full"
          size="icon"
          variant="carousel"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
        </Button>

        <div
          className="overflow-x-auto"
          ref={scrollContainerRef}
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <div className="flex min-w-max flex-nowrap items-center gap-6">
            {repeatedBadges.map((badge, index) => (
              <div
                className="group flex w-[72px] shrink-0 flex-col items-center gap-2 px-1 py-1 text-center"
                key={`${badge.id}-${index}`}
              >
                <ClubBadge
                  shortName={badge.shortName}
                  imageUrl={badge.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          aria-label="Próximos clubes"
          className="shrink-0"
          onClick={() => scrollBadges("next")}
          radius="full"
          size="icon"
          variant="carousel"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
    </section>
  );
}
