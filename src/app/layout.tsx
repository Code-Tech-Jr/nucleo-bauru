import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import Header from '@/components/layout/Header'
import { SITE_URL } from '@/lib/site'
import './globals.css'
import Footer from '@/components/layout/Footer'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
})

export const metadata: Metadata = {
  // sem metadataBase o canonical e o og:url saem como http://localhost:3000
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Núcleo Bauru',
    template: '%s | Núcleo Bauru',
  },
  description: 'Núcleo Bauru — Movimento Empresa Júnior no Oeste Paulista.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${openSans.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-white focus:p-3 focus:text-blue"
        >
          Pular para o conteúdo
        </a>
        <Header />
        {/* flex-1 empurra o footer pro fim da viewport em páginas curtas */}
        <main id="conteudo" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
