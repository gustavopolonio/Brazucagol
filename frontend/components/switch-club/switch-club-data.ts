export type TransferClub = {
  id: string;
  imageUrl?: string;
  name: string;
  shortName: string;
};

const clubBadgeImageUrls = {
  atletico: "https://escudosfc.com.br/images/atletico.png",
  bahia: "https://escudosfc.com.br/images/bahia.png",
  botafogo: "https://escudosfc.com.br/images/botafogo.gif",
  bragantino: "https://escudosfc.com.br/images/bragantino.png",
  chapecoense: "https://escudosfc.com.br/images/chapeco.png",
  cruzeiro: "https://escudosfc.com.br/images/cruzeiro.png",
  fluminense: "https://escudosfc.com.br/images/fluminense.png",
  internacional: "https://escudosfc.com.br/images/interrs.png",
  palmeiras: "https://escudosfc.com.br/images/palmeiras.png",
  santos: "https://escudosfc.com.br/images/santos.png",
  saoPaulo: "https://escudosfc.com.br/images/saopaulo.png",
} as const;

export const currentPlayerClub: TransferClub = {
  id: "cruzeiro",
  imageUrl: clubBadgeImageUrls.cruzeiro,
  name: "Cruzeiro",
  shortName: "CRU",
};

export const playerTransferPassesCount = 2;

export const availableTransferClubs: TransferClub[] = [
  currentPlayerClub,
  { id: "palmeiras", imageUrl: clubBadgeImageUrls.palmeiras, name: "Palmeiras", shortName: "PAL" },
  { id: "flamengo", name: "Flamengo", shortName: "FLA" },
  { id: "corinthians", name: "Corinthians", shortName: "COR" },
  { id: "sao-paulo", imageUrl: clubBadgeImageUrls.saoPaulo, name: "Sao Paulo", shortName: "SAO" },
  { id: "santos", imageUrl: clubBadgeImageUrls.santos, name: "Santos", shortName: "SAN" },
  { id: "internacional", imageUrl: clubBadgeImageUrls.internacional, name: "Internacional", shortName: "INT" },
  { id: "bahia", imageUrl: clubBadgeImageUrls.bahia, name: "Bahia", shortName: "BAH" },
  { id: "botafogo", imageUrl: clubBadgeImageUrls.botafogo, name: "Botafogo", shortName: "BOT" },
  { id: "fluminense", imageUrl: clubBadgeImageUrls.fluminense, name: "Fluminense", shortName: "FLU" },
  { id: "atletico-mg", imageUrl: clubBadgeImageUrls.atletico, name: "Atletico MG", shortName: "CAM" },
  { id: "bragantino", imageUrl: clubBadgeImageUrls.bragantino, name: "Bragantino", shortName: "RBB" },
  { id: "chapecoense", imageUrl: clubBadgeImageUrls.chapecoense, name: "Chapecoense", shortName: "CHA" },
];
