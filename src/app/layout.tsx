import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import Header from '@/components/layout/Header'
import './globals.css'

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
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  )
}
