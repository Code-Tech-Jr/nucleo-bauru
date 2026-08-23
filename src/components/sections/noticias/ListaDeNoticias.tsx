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
            // auto-fit + max de 300px + justify-center: com 1–2 itens os cards
            // ficam centralizados em vez de colados à esquerda com vazio à direita
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,300px))] justify-center gap-6">
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
