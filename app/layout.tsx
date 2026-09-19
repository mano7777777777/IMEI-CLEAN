import type { Metadata } from 'next';
import './globals.css';
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
