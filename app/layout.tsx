import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
const sans = DM_Sans({ variable: '--font-sans-app', subsets: ['latin'] });
const mono = IBM_Plex_Mono({ variable: '--font-mono-app', weight: ['500'], subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'StockPilot — Suivi des ventes de téléphones',
  description: 'Pilotez les stocks, ravitaillements, ventes, prêts et rapports de vos équipes.',
  openGraph: {
    title: 'StockPilot', description: 'Le pilotage terrain, sans angle mort.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'StockPilot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockPilot', description: 'Le pilotage terrain, sans angle mort.',
    images: ['/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>; }
