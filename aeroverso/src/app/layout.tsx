import { Space_Grotesk, Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

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