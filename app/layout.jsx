import { Archivo, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';

// Heavy neo-grotesque for the poster-scale display type.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

// Clean grotesque for body + UI.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://ashleynicolesingleton.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ashley Nicole Singleton — Host, Media Personality & Editorial Model',
    template: '%s · Ashley Nicole Singleton',
  },
  description:
    'Ashley Nicole Singleton is a Las Vegas–based media personality, on-camera host, and editorial model. Broadcast, brand campaigns, live events, and editorial features.',
  keywords: [
    'Ashley Nicole Singleton',
    'media personality',
    'TV host',
    'Las Vegas host',
    'editorial model',
    'brand ambassador',
    'live events host',
  ],
  authors: [{ name: 'Ashley Nicole Singleton' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Ashley Nicole Singleton — Host, Media Personality & Editorial Model',
    description:
      'Las Vegas–based media personality, on-camera host, and editorial model. Broadcast, brand campaigns, live events, and editorial features.',
    siteName: 'Ashley Nicole Singleton',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashley Nicole Singleton — Host, Media Personality & Editorial Model',
    description:
      'Las Vegas–based media personality, on-camera host, and editorial model.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#fafafa',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <a href="#main" className="visually-hidden">Skip to content</a>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
