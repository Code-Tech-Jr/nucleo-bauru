import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNoticias } from '@/lib/getNoticias'
import { totalDePaginas } from '@/lib/paginacao'
import ListaDeNoticias from '@/components/sections/noticias/ListaDeNoticias'

type Params = { params: Promise<{ numero: string }> }

// A página 1 mora em /noticias-e-eventos, então aqui começa no 2.
export async function generateStaticParams() {
  const total = totalDePaginas((await getNoticias()).length)
  return Array.from({ length: Math.max(total - 1, 0) }, (_, i) => ({
    numero: String(i + 2),
  }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { numero } = await params
  return {
    title: `Eventos e Notícias — página ${numero}`,
    alternates: { canonical: `/noticias-e-eventos/pagina/${numero}` },
  }
}

export default async function PaginaDeNoticias({ params }: Params) {
  const { numero } = await params
  const pagina = Number(numero)

  // "abc", "2.5", "-1", "01" e a página 1, que mora na raiz da listagem
  if (!/^[2-9]\d*$/.test(numero) || !Number.isSafeInteger(pagina)) notFound()

  return <ListaDeNoticias pagina={pagina} />
}
