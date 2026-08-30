import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
const sans = DM_Sans({ variable: '--font-sans-app', subsets: ['latin'] });
const mono = IBM_Plex_Mono({ variable: '--font-mono-app', weight: ['500'], subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'IMEIflow Pro — Nettoyage & contrôle IMEI',
  description: 'Nettoyez, validez, comparez et exportez vos listes IMEI en toute confidentialité.',
  openGraph: {
    title: 'IMEIflow Pro',
    description: 'Des listes propres. Des écarts visibles.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IMEIflow Pro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMEIflow Pro',
    description: 'Des listes propres. Des écarts visibles.',
    images: ['/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>; }
