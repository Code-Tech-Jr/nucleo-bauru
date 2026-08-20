import { notFound } from 'next/navigation'
import { getNoticias } from '@/lib/getNoticias'
import { fatiarPagina, totalDePaginas } from '@/lib/paginacao'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import NoticiaCardGrade from './NoticiaCardGrade'
import Paginacao from './Paginacao'

export default async function ListaDeNoticias({ pagina }: { pagina: number }) {
  const noticias = await getNoticias()
  const total = totalDePaginas(noticias.length)

  // fora do intervalo: 404 em vez de grade vazia
  if (pagina > total && noticias.length > 0) notFound()

  const daPagina = fatiarPagina(noticias, pagina)

  return (
    <>
      <Container
        as="section"
        className="min-h-55 shrink-0 py-8"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          <Heading variant="hero" as="h1" className="text-5xl break-words">
            Eventos e Notícias
          </Heading>
        </Content>
      </Container>

      <Container as="section" className="py-12">
        <Content className="max-w-[1200px] flex-col items-stretch gap-8">
          {daPagina.length === 0 ? (
            <Text variant="dark">Nenhuma notícia publicada por enquanto.</Text>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {daPagina.map((noticia) => (
                <li key={noticia.id}>
                  <NoticiaCardGrade noticia={noticia} />
                </li>
              ))}
            </ul>
          )}

          <Paginacao atual={pagina} total={total} />
        </Content>
      </Container>
    </>
  )
}
