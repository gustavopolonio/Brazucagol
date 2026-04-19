export type NewsStory = {
  id: string;
  category: string;
  title: string;
  summary: string;
  highlight: string;
  publishedAt: string;
};

export const newsStories: NewsStory[] = [
  {
    id: "gazeta-brazucagol-edicao-digital",
    category: "Redação",
    title: "Edição digital estreia",
    summary:
      "A nova página de Noticias centraliza anúncios de produto, mudancas visuais e recados da temporada em um formato de jornal esportivo, com leitura rapida e destaque para o que acabou de acontecer.",
    highlight:
      "As publicacoes mais recentes passam a abrir a capa e empurram automaticamente as anteriores para o arquivo.",
    publishedAt: "2026-04-18T09:30:00-03:00",
  },
  {
    id: "rodadas-com-cadencia-diaria",
    category: "Temporada",
    title: "Rodadas ganham ritmo",
    summary:
      "A cobertura das competicoes agora conversa melhor com o ritmo de 24 horas do BrazucaGol, deixando mais claro quando a rodada vira, quais confrontos entram em campo e o que vale na classificacao.",
    highlight:
      "A leitura do calendario ficou mais proxima de um caderno esportivo, com foco em contexto de rodada e competicoes em paralelo.",
    publishedAt: "2026-04-17T21:10:00-03:00",
  },
  {
    id: "presenca-em-campo",
    category: "Ao vivo",
    title: "Presença em campo",
    summary:
      "A redação destaca que a presença em campo ficou visualmente mais facil de entender, reforcando quem esta apto a marcar gols automaticos e acompanhar o ritmo do servidor.",
    highlight:
      "A mudanca aproxima o jornal da dinamica real do jogo, em que estar online faz diferenca no desenrolar das partidas.",
    publishedAt: "2026-04-16T18:00:00-03:00",
  },
  {
    id: "copa-com-cobertura-por-fase",
    category: "Copa",
    title: "Copa em fases",
    summary:
      "A apresentacao editorial reforca a identidade das competicoes eliminatorias, com chamadas que valorizam oitavas, quartas, semifinal e final como se fossem edicoes especiais.",
    highlight:
      "Cada fase passa a ter peso proprio na narrativa, ajudando o jogador a entender o momento esportivo do torneio.",
    publishedAt: "2026-04-15T11:45:00-03:00",
  },
  {
    id: "vip-no-painel",
    category: "Clube",
    title: "VIP no painel",
    summary:
      "A leitura de beneficios e distribuicoes ficou mais objetiva para presidentes e vice-presidentes, reduzindo a sensacao de menu escondido e aproximando a navegacao de um caderno de servico.",
    highlight:
      "O objetivo e tornar a administracao de elenco mais direta sem quebrar o estilo retro do projeto.",
    publishedAt: "2026-04-12T14:20:00-03:00",
  },
  {
    id: "ranking-em-estilo-placar",
    category: "Ranking",
    title: "Ranking em destaque",
    summary:
      "Os destaques numericos continuam centrais na experiencia do BrazucaGol, com um desenho que mistura painel classico de estadio e leitura de jornal de domingo.",
    highlight:
      "A pagina ajuda a transformar estatisticas em manchete, nao apenas em tabela.",
    publishedAt: "2026-04-09T08:05:00-03:00",
  },
  {
    id: "calendario-e-amistosos",
    category: "Agenda",
    title: "Calendario em caderno",
    summary:
      "A organizacao de datas foi pensada para que o jogador enxergue a temporada como uma sequencia de edicoes, cada uma com sua pauta, seus confrontos e suas disputas paralelas.",
    highlight:
      "O arquivo recente funciona como memoria curta da temporada e ajuda a revisitar as ultimas viradas do jogo.",
    publishedAt: "2026-04-04T16:40:00-03:00",
  },
];
