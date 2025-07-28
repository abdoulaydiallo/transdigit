import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import QueryClientProviderWrapper from "@/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";

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
  title: "Goulotech | Bootcamp de compétences tech en Guinée",
  description: "Goulotech est un bootcamp de compétences tech qui vous forme aux compétences les plus demandées sur le marché du travail.",
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
        <QueryClientProviderWrapper>
          <Toaster />
          {children}
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
