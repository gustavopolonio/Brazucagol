import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrazucaGOL",
  description: "Jogue futebol on-line num jogo web arcade brasileiro. Brazucagol é o novo BRGol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
