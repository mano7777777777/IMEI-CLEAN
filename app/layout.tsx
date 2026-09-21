import type { Metadata } from 'next';
import './globals.css';
import './imei-verifier.css';
export const metadata: Metadata = {
  title: 'IMEI Clean Pro — Nettoyage et contrôle IMEI',
  description: "Nettoyez, validez, comparez et exportez vos listes d'IMEI avec une interface professionnelle.",
  openGraph: {
    title: 'IMEI Clean Pro', description: 'Nettoyage et contrôle professionnel de listes IMEI.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IMEI Clean Pro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMEI Clean Pro', description: 'Nettoyage et contrôle professionnel de listes IMEI.',
    images: ['/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
