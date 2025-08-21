import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { TRPCProvider } from "@/providers/trpc-provider";
import QueryClientProviderWrapper from "@/providers/query-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Transdigit | Bootcamp de compétences tech en Guinée",
  description: "Transdigit est un bootcamp de compétences tech qui vous forme aux compétences les plus demandées sur le marché du travail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <TRPCProvider>
          <QueryClientProviderWrapper>
          <Toaster />
          {children}
        </QueryClientProviderWrapper>
        </TRPCProvider>
      </body>
    </html>
  );
}
