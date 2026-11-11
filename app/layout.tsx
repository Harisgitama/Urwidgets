import type {Metadata} from 'next';
import {Plus_Jakarta_Sans, JetBrains_Mono} from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'URWidgets — KDE Plasma 5 & Rust Desktop Widget Ecosystem',
  description:
    'Modular, resource-efficient Linux desktop widget ecosystem for Linux Mint and KDE Plasma 5 powered by a shared Rust D-Bus/SQLite daemon, QML Plasmoids, and Tauri 2 Control Center.',
  openGraph: {
    title: 'URWidgets — KDE Plasma 5 & Rust Desktop Widget Ecosystem',
    description:
      'Modular, resource-efficient Linux desktop widget ecosystem for Linux Mint and KDE Plasma 5 powered by a shared Rust D-Bus/SQLite daemon, QML Plasmoids, and Tauri 2 Control Center.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URWidgets — KDE Plasma 5 & Rust Desktop Widget Ecosystem',
    description:
      'Modular, resource-efficient Linux desktop widget ecosystem for Linux Mint and KDE Plasma 5 powered by a shared Rust D-Bus/SQLite daemon, QML Plasmoids, and Tauri 2 Control Center.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200"
      >
        {children}
      </body>
    </html>
  );
}
