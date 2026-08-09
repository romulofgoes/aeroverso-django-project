import { Space_Grotesk, Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aeroverso',
  description: 'Portal de notícias, curiosidades e carreira no mundo da aviação, com foco na América Latina.',
  icons: {
    icon: '/favicon_32px.ico',
  },
  openGraph: {
    title: 'Aeroverso',
    description: 'Portal de notícias, curiosidades e carreira no mundo da aviação.',
    url: 'https://aeroverso.com.br',
    siteName: 'Aeroverso',
    images: [
      {
        url: 'https://aeroverso.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aeroverso',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
}
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-navy-950 text-slate-100`}>

        <header className="sticky top-0 z-50 border-b border-navy-700 bg-navy-950/80 backdrop-blur">
          <Navbar />
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="border-t border-navy-700 py-8">
          <Footer />
        </footer>

      </body>
    </html>
  )
}