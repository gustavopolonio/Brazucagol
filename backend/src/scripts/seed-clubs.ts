import { db } from "@/lib/drizzle";
import { clubs, type NewClub } from "@/db/schema";

const clubSeeds: NewClub[] = [
  // ======================
  // REGIÃO SUDESTE (8)
  // ======================
  {
    name: "Aurora Paulista",
    stadium: "Estádio Aurora",
    region: "SP",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/aurora-paulista.png",
    primaryColor: "#1F4ED8",
    secondaryColor: "#F5C400",
  },
  {
    name: "Vila Mantiqueira",
    stadium: "Estádio das Araucárias",
    region: "SP",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/vila-mantiqueira.png",
    primaryColor: "#1B5E20",
    secondaryColor: "#E0E0E0",
  },
  {
    name: "Santa Lúcia FC",
    stadium: "Estádio da Enseada",
    region: "RJ",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/santa-lucia.png",
    primaryColor: "#8B0000",
    secondaryColor: "#FFFFFF",
  },
  {
    name: "Serra Carioca",
    stadium: "Estádio Pedra Alta",
    region: "RJ",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/serra-carioca.png",
    primaryColor: "#2E2E2E",
    secondaryColor: "#E53935",
  },
  {
    name: "Vale do Aço",
    stadium: "Estádio Metalúrgico",
    region: "MG",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/vale-do-aco.png",
    primaryColor: "#263238",
    secondaryColor: "#FF6F00",
  },
  {
    name: "Montes Claros FC",
    stadium: "Estádio do Sertão",
    region: "MG",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/montes-claros.png",
    primaryColor: "#4E342E",
    secondaryColor: "#FBC02D",
  },
  {
    name: "Atlântico Capixaba",
    stadium: "Estádio Mar Azul",
    region: "ES",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/atlantico-capixaba.png",
    primaryColor: "#01579B",
    secondaryColor: "#4FC3F7",
  },
  {
    name: "Costa Vitória",
    stadium: "Estádio da Ilha",
    region: "ES",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/costa-vitoria.png",
    primaryColor: "#00695C",
    secondaryColor: "#FFFFFF",
  },

  // ======================
  // REGIÃO SUL (6)
  // ======================
  {
    name: "Lagoa do Sul",
    stadium: "Estádio Lago Azul",
    region: "RS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/lagoa-do-sul.png",
    primaryColor: "#0277BD",
    secondaryColor: "#81D4FA",
  },
  {
    name: "Serra Gaúcha",
    stadium: "Estádio dos Vinhedos",
    region: "RS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/serra-gaucha.png",
    primaryColor: "#6A1B9A",
    secondaryColor: "#2E7D32",
  },
  {
    name: "Vale do Iguaçu",
    stadium: "Estádio das Cataratas",
    region: "PR",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/vale-do-iguacu.png",
    primaryColor: "#1B5E20",
    secondaryColor: "#4FC3F7",
  },
  {
    name: "Pinheiros FC",
    stadium: "Estádio do Bosque",
    region: "PR",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/pinheiros.png",
    primaryColor: "#2E7D32",
    secondaryColor: "#F5F5F5",
  },
  {
    name: "Brisa Catarinense",
    stadium: "Estádio Ventos do Sul",
    region: "SC",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/brisa-catarinense.png",
    primaryColor: "#0288D1",
    secondaryColor: "#ECEFF1",
  },
  {
    name: "Costa Norte SC",
    stadium: "Estádio Farol Norte",
    region: "SC",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/costa-norte.png",
    primaryColor: "#01579B",
    secondaryColor: "#FFEB3B",
  },

  // ======================
  // REGIÃO NORDESTE (14)
  // ======================
  {
    name: "Sol Nascente",
    stadium: "Estádio do Potengi",
    region: "RN",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/sol-nascente.png",
    primaryColor: "#F9A825",
    secondaryColor: "#BF360C",
  },
  {
    name: "Costa Potiguar",
    stadium: "Estádio Atlântico",
    region: "RN",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#004D40",
    secondaryColor: "#4DD0E1",
  },
  {
    name: "Dunas FC",
    stadium: "Estádio das Areias",
    region: "CE",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#FBC02D",
    secondaryColor: "#6D4C41",
  },
  {
    name: "Serra do Cariri",
    stadium: "Estádio Chapada",
    region: "CE",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#5D4037",
    secondaryColor: "#C0CA33",
  },
  {
    name: "Mar do Recife",
    stadium: "Estádio Capibaribe Sul",
    region: "PE",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#0277BD",
    secondaryColor: "#FFFFFF",
  },
  {
    name: "Alvorada Pernambucana",
    stadium: "Estádio Aurora do Norte",
    region: "PE",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#FF6F00",
    secondaryColor: "#1A237E",
  },
  {
    name: "Litoral Azul",
    stadium: "Estádio Porto Dourado",
    region: "BA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#0288D1",
    secondaryColor: "#FFD54F",
  },
  {
    name: "Serra do Orobó",
    stadium: "Estádio Pedra Branca",
    region: "BA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#616161",
    secondaryColor: "#2E7D32",
  },
  {
    name: "Sol do Sertão",
    stadium: "Estádio Mandacaru",
    region: "PI",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#F57F17",
    secondaryColor: "#33691E",
  },
  {
    name: "Costa Parnaíba",
    stadium: "Estádio Delta Verde",
    region: "PI",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#006064",
    secondaryColor: "#A5D6A7",
  },

  // ======================
  // REGIÃO NORTE (8)
  // ======================
  {
    name: "Rio Negro FC",
    stadium: "Estádio Floresta",
    region: "AM",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#263238",
    secondaryColor: "#2E7D32",
  },
  {
    name: "Manaus Central",
    stadium: "Estádio do Encontro",
    region: "AM",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#37474F",
    secondaryColor: "#0288D1",
  },
  {
    name: "Estrela do Norte",
    stadium: "Estádio Estrela D'Água",
    region: "PA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#FFD600",
    secondaryColor: "#1A237E",
  },
  {
    name: "Tapajós FC",
    stadium: "Estádio Rio Claro",
    region: "PA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#00796B",
    secondaryColor: "#80CBC4",
  },
  {
    name: "Acre Verde",
    stadium: "Estádio da Fronteira",
    region: "AC",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#1B5E20",
    secondaryColor: "#F5F5F5",
  },
  {
    name: "Cruzeiro do Norte",
    stadium: "Estádio Cruzeiro",
    region: "AC",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#0D47A1",
    secondaryColor: "#FFFFFF",
  },
  {
    name: "Porto Velho FC",
    stadium: "Estádio Madeira",
    region: "RO",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#5D4037",
    secondaryColor: "#1E88E5",
  },
  {
    name: "Serra Roraima",
    stadium: "Estádio Monte Roraima",
    region: "RR",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#455A64",
    secondaryColor: "#8BC34A",
  },

  // ======================
  // REGIÃO CENTRO-OESTE (8)
  // ======================
  {
    name: "Planalto FC",
    stadium: "Estádio Central",
    region: "DF",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#33691E",
    secondaryColor: "#FDD835",
  },
  {
    name: "Capital do Cerrado",
    stadium: "Estádio JK",
    region: "DF",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#2E7D32",
    secondaryColor: "#BF360C",
  },
  {
    name: "Rio Vermelho",
    stadium: "Estádio das Pedras",
    region: "GO",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#B71C1C",
    secondaryColor: "#F5F5F5",
  },
  {
    name: "Serra Dourada FC",
    stadium: "Estádio Novo Dourado",
    region: "GO",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#F9A825",
    secondaryColor: "#1B5E20",
  },
  {
    name: "Pantanal FC",
    stadium: "Estádio das Águas",
    region: "MT",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#00695C",
    secondaryColor: "#81D4FA",
  },
  {
    name: "Cuiabá Oeste",
    stadium: "Estádio Araguaia",
    region: "MT",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#BF360C",
    secondaryColor: "#FBC02D",
  },
  {
    name: "Campo Grande FC",
    stadium: "Estádio Morenão Sul",
    region: "MS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#2E7D32",
    secondaryColor: "#FFFFFF",
  },
  {
    name: "Serra Morena",
    stadium: "Estádio Guavira",
    region: "MS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#6D4C41",
    secondaryColor: "#AED581",
  },

  // ======================
  // EXTRAS / MISTURA (16)
  // ======================
  {
    name: "Atlântico Sul",
    stadium: "Estádio Costa Azul",
    region: "RJ",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#01579B",
    secondaryColor: "#4FC3F7",
  },
  {
    name: "Horizonte Mineiro",
    stadium: "Estádio do Horizonte",
    region: "MG",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#455A64",
    secondaryColor: "#FFCA28",
  },
  {
    name: "Pontal FC",
    stadium: "Estádio do Pontal",
    region: "SP",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#0277BD",
    secondaryColor: "#81D4FA",
  },
  {
    name: "Fronteira Oeste",
    stadium: "Estádio Fronteira",
    region: "RS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#4E342E",
    secondaryColor: "#D7CCC8",
  },
  {
    name: "Costa do Sol",
    stadium: "Estádio Solar",
    region: "RJ",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#F9A825",
    secondaryColor: "#0288D1",
  },
  {
    name: "Vale Verde",
    stadium: "Estádio das Colinas",
    region: "PR",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#2E7D32",
    secondaryColor: "#A5D6A7",
  },
  {
    name: "Pedra Branca",
    stadium: "Estádio Granito",
    region: "SC",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#BDBDBD",
    secondaryColor: "#212121",
  },
  {
    name: "Nova Esperança",
    stadium: "Estádio Esperança",
    region: "BA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#43A047",
    secondaryColor: "#FDD835",
  },
  {
    name: "Serra Azul",
    stadium: "Estádio Serra Alta",
    region: "MG",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#1565C0",
    secondaryColor: "#90CAF9",
  },
  {
    name: "Litoral Norte",
    stadium: "Estádio Maresia",
    region: "SP",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#0288D1",
    secondaryColor: "#FFFFFF",
  },
  {
    name: "Ventos do Sul",
    stadium: "Estádio Tramontana",
    region: "RS",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#37474F",
    secondaryColor: "#B0BEC5",
  },
  {
    name: "Sol Poente",
    stadium: "Estádio Poente",
    region: "GO",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#FF8F00",
    secondaryColor: "#4E342E",
  },
  {
    name: "Estrela do Mar",
    stadium: "Estádio Coral",
    region: "AL",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#00ACC1",
    secondaryColor: "#FFD600",
  },
  {
    name: "Rio Branco FC",
    stadium: "Estádio Branco",
    region: "MT",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#ECEFF1",
    secondaryColor: "#263238",
  },
  {
    name: "Chapada FC",
    stadium: "Estádio Chapada Verde",
    region: "MT",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#558B2F",
    secondaryColor: "#33691E",
  },
  {
    name: "Costa Verde",
    stadium: "Estádio Verde Mar",
    region: "RJ",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#00695C",
    secondaryColor: "#A5D6A7",
  },
  {
    name: "Pôr do Sol",
    stadium: "Estádio Dourado",
    region: "RN",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#F57F17",
    secondaryColor: "#BF360C",
  },
  {
    name: "Vila do Norte",
    stadium: "Estádio Vila Nova",
    region: "PA",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#1B5E20",
    secondaryColor: "#FFD600",
  },
  {
    name: "Aurora do Sul",
    stadium: "Estádio Amanhecer",
    region: "PR",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/generico.png",
    primaryColor: "#FFB300",
    secondaryColor: "#1A237E",
  },
  {
    name: "Coração do Brasil",
    stadium: "Estádio Centralíssimo",
    region: "DF",
    logoUrl: "https://brazucagol-clubs-logo-test.s3.us-east-1.amazonaws.com/coracao-do-brasil.png",
    primaryColor: "#388E3C",
    secondaryColor: "#FDD835",
  },
];

async function seedClubs() {
  console.log("Seeding clubs...");

  await db.insert(clubs).values(clubSeeds).onConflictDoNothing();

  console.log(`Inserted ${clubSeeds.length} clubs (existing rows skipped).`);
}

seedClubs()
  .then(() => {
    console.log("Club seed finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Club seed failed:", error);
    process.exit(1);
  });
