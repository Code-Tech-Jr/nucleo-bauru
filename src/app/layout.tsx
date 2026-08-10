import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Footer from '@/components/layout/Footer'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
})

export const metadata: Metadata = {
  title: 'Núcleo Bauru',
  description: 'Núcleo Bauru — Movimento Empresa Júnior no Oeste Paulista.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${openSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* flex-1 empurra o footer pro fim da viewport em páginas curtas */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
