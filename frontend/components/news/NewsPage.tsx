import { PanelCard } from "@/components/layout/PanelCard";
import { newsStories } from "@/components/news/news-data";
import { Newspaper } from "lucide-react";

function formatPublishedDate(publishedAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(publishedAt));
}

export function NewsPage() {
  const orderedStories = [...newsStories].sort(
    (firstStory, secondStory) =>
      new Date(secondStory.publishedAt).getTime() - new Date(firstStory.publishedAt).getTime()
  );

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Notícias
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <section
          className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,251,242,0.98)_0%,rgba(244,237,223,0.98)_100%)] p-4 text-[var(--homepage-panel-text)] shadow-[0_20px_38px_rgba(73,54,20,0.12)] md:p-6"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          <div className="border-b border-[var(--homepage-panel-text-strong)]/25 pb-5">
            <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
              <div className="border-y border-[var(--homepage-panel-text-strong)]/20 py-3 text-center text-[11px] font-black uppercase tracking-[0.22em] text-[var(--homepage-highlight-label)] lg:text-left">
                Atualizações do jogo
              </div>
              <div className="text-center">
                <p className="text-[clamp(2.75rem,7vw,5.4rem)] leading-none font-bold uppercase tracking-[0.05em] text-[var(--homepage-panel-text-strong)]">
                  Gazeta
                </p>
                <p className="text-[clamp(1.55rem,4vw,2.9rem)] leading-none font-bold uppercase tracking-[0.3em] text-[var(--homepage-record-value)]">
                  BrazucaGol
                </p>
              </div>
              <div className="border-y border-[var(--homepage-panel-text-strong)]/20 py-3 text-center text-[11px] font-black uppercase tracking-[0.22em] text-[var(--homepage-highlight-label)] lg:text-right">
                Bastidores, rodadas, clubes e ranking
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--homepage-panel-text-strong)]/20 pt-2">
            {orderedStories.map((story, storyIndex) => (
              <article
                className="border-b border-[var(--homepage-panel-text-strong)]/16 py-6 last:border-b-0 last:pb-2"
                key={story.id}
              >
                <div
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  style={{ fontFamily: "var(--font-brazuca)" }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--homepage-highlight-label)]">
                      {story.category}
                    </span>
                  </div>

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--homepage-panel-text-muted)]">
                    {formatPublishedDate(story.publishedAt)}
                  </p>
                </div>

                <h2
                  className="mt-4 text-2xl leading-tight font-bold text-[var(--homepage-panel-text-strong)]"
                >
                  {story.title}
                </h2>

                <p className="mt-3 max-w-none leading-8 text-[var(--homepage-panel-text)]">
                  {story.summary} {story.highlight}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
