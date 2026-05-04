import type { PlayerAvatarConfig } from "@/components/avatar/avatarOptions";

export type MessageCategory = "system" | "private" | "club" | "global";

export type MessageItem = {
  authorName: string;
  body: string;
  id: string;
  isOwn?: boolean;
  sentAt: string;
  sentAtDate?: string;
};

export type MessageThread = {
  accentColor: string;
  avatarConfig?: PlayerAvatarConfig;
  avatarLabel: string;
  category: MessageCategory;
  id: string;
  isOnline?: boolean;
  lastMessageAt: string;
  messages: MessageItem[];
  subtitle: string;
  title: string;
  unreadCount?: number;
};

export const messageCategoryLabels: Record<MessageCategory, string> = {
  system: "Sistema",
  private: "Privadas",
  club: "Clube",
  global: "Geral",
};

export const messageCategoryOrder: MessageCategory[] = [
  "system",
  "private",
  "club",
  "global",
];

const demoMessageDates = [
  "2026-04-23",
  "2026-04-25",
  "2026-04-28",
  "2026-04-30",
  "2026-05-01",
];

const messageThreadsWithoutDates: MessageThread[] = [
  {
    accentColor: "#2563eb",
    avatarLabel: "BG",
    category: "system",
    id: "system-achievements",
    lastMessageAt: "09:12",
    subtitle: "Informações sobre compras, conquistas e progresso",
    title: "Sistema Brazucagol",
    unreadCount: 2,
    messages: [
      {
        authorName: "Loja",
        body: "Compra registrada: VIP 7 dias. O item ja esta disponivel no seu inventario.",
        id: "system-store-1",
        sentAt: "Ontem",
      },
      {
        authorName: "Sistema",
        body: "Você recebeu 250 moedas pelo bonus diario de atividade.",
        id: "system-activity-1",
        sentAt: "Ontem",
      },
      {
        authorName: "Sistema",
        body: "A rodada 12 foi encerrada e sua equipe terminou na terceira posicao.",
        id: "system-season-1",
        sentAt: "Ontem",
      },
      {
        authorName: "Loja",
        body: "Seu historico de compra foi atualizado com o pedido BRZ-1029.",
        id: "system-store-2",
        sentAt: "07:20",
      },
      {
        authorName: "Sistema",
        body: "Seu login diario manteve a sequencia ativa por 4 dias.",
        id: "system-login-1",
        sentAt: "07:35",
      },
      {
        authorName: "Sistema",
        body: "Você recebeu 1 VIP do presidente do clube.",
        id: "system-club-1",
        sentAt: "07:48",
      },
      {
        authorName: "Sistema",
        body: "Penalti convertido registrado nas estatisticas da partida.",
        id: "system-action-1",
        sentAt: "08:05",
      },
      {
        authorName: "Sistema",
        body: "Progresso atualizado: 8 de 10 gols para a conquista Matador.",
        id: "system-achievements-0",
        sentAt: "08:22",
      },
      {
        authorName: "Sistema",
        body: "Uma proposta de transferencia expirou sem resposta.",
        id: "system-market-1",
        sentAt: "08:40",
      },
      {
        authorName: "Sistema",
        body: "Seu cooldown de falta foi reiniciado ao entrar online.",
        id: "system-cooldown-1",
        sentAt: "08:51",
      },
      {
        authorName: "Sistema",
        body: "Você desbloqueou a conquista Artilheiro da Rodada ao marcar 5 gols hoje.",
        id: "system-achievements-1",
        sentAt: "08:58",
      },
      {
        authorName: "Sistema",
        body: "Gol automatico confirmado enquanto voce estava online.",
        id: "system-match-1",
        sentAt: "09:03",
      },
      {
        authorName: "Sistema",
        body: "Você entrou no top 20 de artilheiros da temporada.",
        id: "system-ranking-1",
        sentAt: "09:07",
      },
      {
        authorName: "Sistema",
        body: "Seu nivel subiu para Craque Regional. Continue marcando gols para liberar o proximo emblema.",
        id: "system-achievements-2",
        sentAt: "09:12",
      },
      {
        authorName: "Sistema",
        body: "Resumo atualizado: 12 gols, 3 penalti e 2 faltas na partida atual.",
        id: "system-summary-1",
        sentAt: "09:16",
      },
    ],
  },
  {
    accentColor: "#16a34a",
    avatarConfig: {
      backgroundId: "campo",
      bodyId: "avatar_01_meia",
      eyebrowColor: "#24150d",
      eyebrowId: "eyebrow_02",
      eyeColor: "#2563eb",
      eyeId: "eye_03",
      hairId: "hair_02",
      mouthId: "mouth_03",
      noseId: "nose_01",
    },
    avatarLabel: "RA",
    category: "private",
    id: "private-rafa",
    lastMessageAt: "Agora",
    subtitle: "Online agora",
    title: "Rafa Atacante",
    unreadCount: 3,
    messages: [
      {
        authorName: "Rafa Atacante",
        body: "O placar ainda esta apertado, viu?",
        id: "private-rafa-0",
        sentAt: "09:44",
      },
      {
        authorName: "Rafa Atacante",
        body: "Eles acabaram de marcar um automatico.",
        id: "private-rafa-0a",
        sentAt: "09:44",
      },
      {
        authorName: "Rafa Atacante",
        body: "Se a gente responder agora, volta para o jogo.",
        id: "private-rafa-0b",
        sentAt: "09:45",
      },
      {
        authorName: "Você",
        body: "Vi agora. Falta pouco para virar.",
        id: "private-rafa-01",
        isOwn: true,
        sentAt: "09:45",
      },
      {
        authorName: "Você",
        body: "Vou usar falta assim que liberar.",
        id: "private-rafa-01a",
        isOwn: true,
        sentAt: "09:46",
      },
      {
        authorName: "Rafa Atacante",
        body: "Se voce ficar online ate o fim, ajuda muito.",
        id: "private-rafa-02",
        sentAt: "09:47",
      },
      {
        authorName: "Você",
        body: "Vou deixar a aba aberta e acompanhar os cooldowns.",
        id: "private-rafa-03",
        isOwn: true,
        sentAt: "09:49",
      },
      {
        authorName: "Rafa Atacante",
        body: "Boa. Eu ja gastei minha falta, mas o penalti libera daqui a pouco.",
        id: "private-rafa-04",
        sentAt: "09:52",
      },
      {
        authorName: "Você",
        body: "Me avisa quando liberar. Se precisar, eu seguro meu trail.",
        id: "private-rafa-05",
        isOwn: true,
        sentAt: "09:55",
      },
      {
        authorName: "Rafa Atacante",
        body: "Combinado. O outro clube esta subindo rapido.",
        id: "private-rafa-06",
        sentAt: "09:59",
      },
      {
        authorName: "Você",
        body: "Entao vamos coordenar no final da hora.",
        id: "private-rafa-07",
        isOwn: true,
        sentAt: "10:01",
      },
      {
        authorName: "Rafa Atacante",
        body: "Vai entrar na final hoje? A gente precisa fechar a rodada forte.",
        id: "private-rafa-1",
        sentAt: "10:04",
      },
      {
        authorName: "Você",
        body: "Entro sim. Vou guardar penalti e falta para o segundo tempo.",
        id: "private-rafa-2",
        isOwn: true,
        sentAt: "10:06",
      },
      {
        authorName: "Rafa Atacante",
        body: "Boa. Se ficar online, os gols automaticos ajudam a segurar a vantagem.",
        id: "private-rafa-3",
        sentAt: "10:08",
      },
      {
        authorName: "Você",
        body: "Vou avisar no vestiario quando meus chutes liberarem.",
        id: "private-rafa-4",
        isOwn: true,
        sentAt: "10:09",
      },
      {
        authorName: "Rafa Atacante",
        body: "Fechado. Se a gente fizer mais 4 gols, passa no saldo.",
        id: "private-rafa-5",
        sentAt: "10:10",
      },
      {
        authorName: "Você",
        body: "Da para buscar. Estou com VIP ativo.",
        id: "private-rafa-6",
        isOwn: true,
        sentAt: "10:11",
      },
      {
        authorName: "Rafa Atacante",
        body: "Perfeito, entao seu cooldown volta antes do fechamento.",
        id: "private-rafa-7",
        sentAt: "10:12",
      },
    ],
  },
  {
    accentColor: "#db2777",
    avatarConfig: {
      backgroundId: "vestiario",
      bodyId: "avatar_02_meia_negro",
      eyebrowColor: "#2a1710",
      eyebrowId: "eyebrow_04",
      eyeColor: "#16a34a",
      eyeId: "eye_05",
      hairId: "hair_03",
      mouthId: "mouth_04",
      noseId: "nose_02",
    },
    avatarLabel: "MC",
    category: "private",
    id: "private-mica",
    lastMessageAt: "18:40",
    subtitle: "Visto ontem",
    title: "Mica Camisa 10",
    messages: [
      {
        authorName: "Mica Camisa 10",
        body: "Quando abrir a janela de troca, me chama. Quero ver se cabe no elenco.",
        id: "private-mica-1",
        sentAt: "18:10",
      },
      {
        authorName: "Você",
        body: "Chamo sim. Qual posicao voces estao precisando?",
        id: "private-mica-2",
        isOwn: true,
        sentAt: "18:12",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Mais gente online para gerar gol automatico.",
        id: "private-mica-3",
        sentAt: "18:14",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Principalmente no horario de fechamento.",
        id: "private-mica-3a",
        sentAt: "18:15",
      },
      {
        authorName: "Mica Camisa 10",
        body: "A gente perdeu duas rodadas por ficar offline cedo.",
        id: "private-mica-3b",
        sentAt: "18:15",
      },
      {
        authorName: "Você",
        body: "Meu horario forte e de noite.",
        id: "private-mica-4",
        isOwn: true,
        sentAt: "18:16",
      },
      {
        authorName: "Você",
        body: "Consigo ficar online ate o fim da rodada.",
        id: "private-mica-4a",
        isOwn: true,
        sentAt: "18:17",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Isso ajuda. Nosso clube perde ritmo depois das 21h.",
        id: "private-mica-5",
        sentAt: "18:18",
      },
      {
        authorName: "Você",
        body: "E como esta a distribuicao de VIP por ai?",
        id: "private-mica-6",
        isOwn: true,
        sentAt: "18:20",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Presidente libera para quem participa das finais.",
        id: "private-mica-7",
        sentAt: "18:22",
      },
      {
        authorName: "Você",
        body: "Boa. Eu costumo jogar todas as rodadas grandes.",
        id: "private-mica-8",
        isOwn: true,
        sentAt: "18:24",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Vi seu ranking. Você esta subindo bem.",
        id: "private-mica-9",
        sentAt: "18:27",
      },
      {
        authorName: "Você",
        body: "Valeu. Ainda falta melhorar nos chutes de falta.",
        id: "private-mica-10",
        isOwn: true,
        sentAt: "18:29",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Treina cooldown. Usar tudo assim que libera faz diferenca.",
        id: "private-mica-11",
        sentAt: "18:31",
      },
      {
        authorName: "Você",
        body: "Vou testar hoje na ultima hora.",
        id: "private-mica-12",
        isOwn: true,
        sentAt: "18:34",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Se decidir trocar, me chama antes de aceitar outra proposta.",
        id: "private-mica-13",
        sentAt: "18:36",
      },
      {
        authorName: "Você",
        body: "Combinado. Vou esperar a janela abrir.",
        id: "private-mica-14",
        isOwn: true,
        sentAt: "18:38",
      },
      {
        authorName: "Mica Camisa 10",
        body: "Fechou. Boa rodada por ai.",
        id: "private-mica-15",
        sentAt: "18:40",
      },
    ],
  },
  {
    accentColor: "#059669",
    avatarLabel: "FC",
    category: "club",
    id: "club-main",
    lastMessageAt: "Agora",
    subtitle: "Chat do clube",
    title: "Vestiário do Palmeiras",
    unreadCount: 5,
    messages: [
      {
        authorName: "Vicio Jahu - Presidente",
        body: "Bom dia, tropa. Rodada grande hoje.",
        id: "club-main-0",
        sentAt: "09:05",
      },
      {
        authorName: "Nando - Diretor",
        body: "Quem tiver VIP guardado, usa depois das 20h.",
        id: "club-main-01",
        sentAt: "09:10",
      },
      {
        authorName: "Nando - Diretor",
        body: "Nao gasta tudo cedo, porque o adversario costuma reagir no fim.",
        id: "club-main-01a",
        sentAt: "09:11",
      },
      {
        authorName: "Nando - Diretor",
        body: "Quem precisar de VIP avisa a diretoria.",
        id: "club-main-01b",
        sentAt: "09:12",
      },
      {
        authorName: "Lipe - Atacante",
        body: "Meu penalti libera em 6 minutos.",
        id: "club-main-02",
        sentAt: "09:14",
      },
      {
        authorName: "Carol - Meia",
        body: "Estou online ate o intervalo do jogo.",
        id: "club-main-03",
        sentAt: "09:18",
      },
      {
        authorName: "Samuca - Capitão",
        body: "Foco em nao desperdiçar falta. O saldo pode decidir.",
        id: "club-main-04",
        sentAt: "09:24",
      },
      {
        authorName: "Vicio Jahu - Presidente",
        body: "Meta da partida: todo mundo online no fechamento da noite.",
        id: "club-main-1",
        sentAt: "09:30",
      },
      {
        authorName: "Samuca - Capitão",
        body: "Diretoria vai distribuir VIP para quem estiver puxando a artilharia.",
        id: "club-main-2",
        sentAt: "09:38",
      },
      {
        authorName: "Você",
        body: "Estou ativo. Vou usar meus chutes manuais assim que liberarem.",
        id: "club-main-3",
        isOwn: true,
        sentAt: "09:42",
      },
      {
        authorName: "Você",
        body: "Meu penalti volta antes das 10h.",
        id: "club-main-3a",
        isOwn: true,
        sentAt: "09:43",
      },
      {
        authorName: "Lipe - Atacante",
        body: "Converti meu penalti agora.",
        id: "club-main-4",
        sentAt: "09:45",
      },
      {
        authorName: "Nando - Diretor",
        body: "Boa. Ja apareceu no placar.",
        id: "club-main-5",
        sentAt: "09:47",
      },
      {
        authorName: "Carol - Meia",
        body: "Minha falta libera 09:55.",
        id: "club-main-6",
        sentAt: "09:49",
      },
      {
        authorName: "Você",
        body: "Vou guardar trail para responder se eles virarem.",
        id: "club-main-7",
        isOwn: true,
        sentAt: "09:51",
      },
      {
        authorName: "Samuca - Capitão",
        body: "Perfeito. Avisem antes de gastar trail.",
        id: "club-main-8",
        sentAt: "09:53",
      },
      {
        authorName: "Carol - Meia",
        body: "Falta convertida. Mais um para a conta.",
        id: "club-main-9",
        sentAt: "09:56",
      },
      {
        authorName: "Vicio Jahu - Presidente",
        body: "Vou distribuir mais VIP para quem fechar online.",
        id: "club-main-10",
        sentAt: "10:00",
      },
    ],
  },
  {
    accentColor: "#0ea5e9",
    avatarLabel: "G",
    category: "global",
    id: "global-lobby",
    lastMessageAt: "Agora",
    subtitle: "Chat geral dos jogadores",
    title: "Arquibancada",
    unreadCount: 1,
    messages: [
      {
        authorName: "Dudu 77",
        body: "Essa rodada esta disputada demais.",
        id: "global-lobby-0",
        sentAt: "10:00",
      },
      {
        authorName: "Dudu 77",
        body: "Tem clube virando jogo com dois gols de diferenca.",
        id: "global-lobby-0a",
        sentAt: "10:01",
      },
      {
        authorName: "Dudu 77",
        body: "Hoje o ranking vai mudar bastante.",
        id: "global-lobby-0b",
        sentAt: "10:01",
      },
      {
        authorName: "Nina Gol",
        body: "Meu clube virou no ultimo minuto ontem.",
        id: "global-lobby-01",
        sentAt: "10:02",
      },
      {
        authorName: "Tavares FC",
        body: "Alguem viu a tabela da divisao 2?",
        id: "global-lobby-02",
        sentAt: "10:04",
      },
      {
        authorName: "Biel Goleador",
        body: "A divisao 2 esta com tres times empatados.",
        id: "global-lobby-03",
        sentAt: "10:05",
      },
      {
        authorName: "Lari 9",
        body: "Hoje vai ter briga por saldo de gols.",
        id: "global-lobby-04",
        sentAt: "10:07",
      },
      {
        authorName: "Você",
        body: "Estou tentando entrar no top 20 da temporada.",
        id: "global-lobby-05",
        isOwn: true,
        sentAt: "10:09",
      },
      {
        authorName: "Você",
        body: "Se entrar, ja salvo print antes da rodada fechar.",
        id: "global-lobby-05a",
        isOwn: true,
        sentAt: "10:10",
      },
      {
        authorName: "Biel Goleador",
        body: "Alguem sabe quando fecha a rodada?",
        id: "global-lobby-1",
        sentAt: "10:11",
      },
      {
        authorName: "Lari 9",
        body: "Hoje as 23:59. Olha o timer no placar.",
        id: "global-lobby-2",
        sentAt: "10:12",
      },
      {
        authorName: "Você",
        body: "Valeu. Vou tentar subir no ranking da temporada.",
        id: "global-lobby-3",
        isOwn: true,
        sentAt: "10:13",
      },
      {
        authorName: "Dudu 77",
        body: "Ranking atualiza em tempo real ou demora?",
        id: "global-lobby-4",
        sentAt: "10:14",
      },
      {
        authorName: "Nina Gol",
        body: "Aqui atualizou quase na hora depois do gol.",
        id: "global-lobby-5",
        sentAt: "10:15",
      },
      {
        authorName: "Tavares FC",
        body: "Falta e penalti contam igual para nivel?",
        id: "global-lobby-6",
        sentAt: "10:16",
      },
      {
        authorName: "Lari 9",
        body: "Conta tudo como gol total.",
        id: "global-lobby-7",
        sentAt: "10:17",
      },
      {
        authorName: "Biel Goleador",
        body: "Entao vou guardar meus chutes para a ultima hora.",
        id: "global-lobby-8",
        sentAt: "10:18",
      },
      {
        authorName: "Você",
        body: "Boa estrategia, mas nao esquece cooldown.",
        id: "global-lobby-9",
        isOwn: true,
        sentAt: "10:19",
      },
    ],
  },
];

export const messageThreads: MessageThread[] = messageThreadsWithoutDates.map((messageThread) => ({
  ...messageThread,
  messages: messageThread.messages.map((message, messageIndex) => ({
    ...message,
    sentAtDate:
      message.sentAtDate ??
      demoMessageDates[Math.min(
        Math.floor(messageIndex / 3),
        demoMessageDates.length - 1,
      )],
  })),
}));
