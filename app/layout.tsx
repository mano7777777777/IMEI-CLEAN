import type { Metadata } from 'next';
import './globals.css';
import './imei-verifier.css';
export const metadata: Metadata = {
  title: 'IMEI Connect — Suivi des téléphones et des connexions FO',
  description: "Suivez les IMEI connectés ou non et identifiez les FO qui n'ont pas encore connecté leur téléphone.",
  openGraph: {
    title: 'IMEI Connect', description: 'Chaque téléphone suivi. Chaque connexion identifiée.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IMEI Connect' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMEI Connect', description: 'Chaque téléphone suivi. Chaque connexion identifiée.',
    images: ['/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
