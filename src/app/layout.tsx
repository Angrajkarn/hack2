import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AntiGravity | Universal Crisis Intelligence Engine',
  description:
    'AntiGravity converts chaotic, unstructured crisis inputs into structured, life-saving intelligence in real time. Powered by Gemini AI.',
  keywords: ['crisis management', 'AI', 'emergency response', 'Gemini', 'AntiGravity'],
  authors: [{ name: 'AntiGravity Systems' }],
  openGraph: {
    title: 'AntiGravity | Universal Crisis Intelligence Engine',
    description: 'Convert chaos to clarity. Life-saving AI. Real time.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
