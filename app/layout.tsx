import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Construindo a Sabedoria",
  description:
    "Plataforma gamificada de aprendizagem colaborativa. Descubra suas competencias, encontre parceiros de estudo e evolua em guildas.",
};

export const viewport: Viewport = {
  themeColor: "#0f9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
