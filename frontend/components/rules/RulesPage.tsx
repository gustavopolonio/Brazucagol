"use client";

import { Shield } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";

const forbiddenItems = [
  "Mascarar conexão ou identidade com proxy, VPN ou recursos semelhantes para burlar controle, limite ou punição",
  "Usar flood, spam ou repetição abusiva em chat, perfil, mensagens ou qualquer área de interação",
  "Utilizar bots, macros, scripts, auto-penalty ou qualquer automação para ganhar vantagem no jogo",
  "Explorar bugs, falhas ou comportamentos indevidos do sistema para obter benefício próprio ou para prejudicar outros jogadores",
  "Divulgar concorrentes, serviços externos proibidos ou qualquer conteúdo que desvie a comunidade do ambiente oficial do jogo",
  "Praticar ofensas, ameaças, assédio, discriminação, conteúdo sexual explícito ou qualquer conduta tóxica contra usuários e equipe",
];

const integrityRules = [
  "Em conexões com IP compartilhado, como alguns provedores via antena ou redes com IP fixo coletivo, a administração poderá limitar os acessos para preservar a integridade do jogo.",
  "Se o usuário encontrar uma falha, deverá comunicar a equipe. Aproveitar-se de erro conhecido para benefício próprio será tratado como infração.",
  "Nomes, perfis, mensagens e interações dentro do Brazucagol devem manter padrão mínimo de respeito. O ambiente do jogo inclui chat, perfil, apelidos e qualquer espaço público ou privado operado pela plataforma.",
];

const enforcementRules = [
  "As punições podem incluir advertência, mute, suspensão temporária, bloqueio de acesso ou banimento permanente, conforme a gravidade, reincidência e impacto causado.",
  "A interpretação final dos casos cabe à Administração e à Moderação, que poderão analisar contexto, histórico da conta, provas e comportamento geral do usuário.",
  "Tentar contornar uma punição, criar meios alternativos para continuar infringindo regras ou dificultar a apuração poderá agravar a sanção aplicada.",
];

export function RulesPage() {
  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Regras
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <Shield className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                  Jogo limpo
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Estas regras existem para manter o Brazucagol competitivo, seguro e equilibrado.
                Ao utilizar a plataforma, o usuário concorda em jogar limpo, respeitar a
                comunidade e aceitar a análise da Administração e da Moderação nos casos
                necessários.
              </p>
            </div>
          </div>

          <div className="space-y-5 px-4 py-4 md:px-5 md:py-5">
            <article className="rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(255,244,214,0.95)_100%)] p-5 shadow-[0_16px_32px_rgba(73,54,20,0.08)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--homepage-highlight-label)]">
                É proibido
              </p>
              <ul className="mt-4 space-y-3">
                {forbiddenItems.map((forbiddenItem) => (
                  <li
                    className="rounded-[18px] border border-[var(--homepage-panel-divider)] bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--homepage-panel-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] md:text-base"
                    key={forbiddenItem}
                  >
                    {forbiddenItem}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(238,248,208,0.92)_100%)] p-5 shadow-[0_16px_32px_rgba(73,54,20,0.08)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--homepage-highlight-label)]">
                Integridade da conta e do jogo
              </p>
              <div className="mt-4 space-y-3">
                {integrityRules.map((integrityRule) => (
                  <p
                    className="rounded-[18px] border border-[var(--homepage-panel-divider)] bg-white/85 px-4 py-4 text-sm font-semibold text-[var(--homepage-panel-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] md:text-base"
                    key={integrityRule}
                  >
                    {integrityRule}
                  </p>
                ))}
              </div>
            </article>
          </div>

          <div className="px-4 pb-4 md:px-5 md:pb-5">
            <article className="rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(224,239,255,0.92)_100%)] p-5 shadow-[0_16px_32px_rgba(73,54,20,0.08)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--homepage-highlight-label)]">
                Punições e análise
              </p>
              <div className="mt-4 space-y-3">
                {enforcementRules.map((enforcementRule) => (
                  <p
                    className="rounded-[18px] border border-[var(--homepage-panel-divider)] bg-white/85 px-4 py-4 text-sm font-semibold text-[var(--homepage-panel-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] md:text-base"
                    key={enforcementRule}
                  >
                    {enforcementRule}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
