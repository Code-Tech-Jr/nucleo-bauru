import type { Metadata } from 'next'
import ListaDeNoticias from '@/components/sections/noticias/ListaDeNoticias'

export const metadata: Metadata = {
  title: 'Eventos e Notícias',
  description: 'Todas as notícias e eventos do Núcleo Bauru.',
  alternates: { canonical: '/noticias-e-eventos' },
}

// Página 1; as demais ficam em /noticias-e-eventos/pagina/[numero].
export default function NoticiasEventosPage() {
  return <ListaDeNoticias pagina={1} />
}
