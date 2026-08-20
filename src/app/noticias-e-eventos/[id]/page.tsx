import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  formatarDataCompleta,
  getNoticia,
  getNoticias,
  parseConteudo,
} from '@/lib/getNoticias'
import GaleriaNoticia from '@/components/sections/noticias/GaleriaNoticia'
import ImagemNoticia from '@/components/sections/noticias/ImagemNoticia'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

type Params = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const noticias = await getNoticias()
  return noticias.map((noticia) => ({ id: noticia.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const noticia = await getNoticia(id)
  if (!noticia) return {}

  const url = `/noticias-e-eventos/${noticia.id}`

  return {
    title: noticia.titulo,
    description: noticia.descricao || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: noticia.titulo,
      description: noticia.descricao || undefined,
      publishedTime: noticia.data,
      images: [noticia.imagemCapa],
      url,
    },
  }
}

export default async function NoticiaPage({ params }: Params) {
  const { id } = await params
  const noticia = await getNoticia(id)
  if (!noticia) notFound()

  const blocos = parseConteudo(noticia.conteudo)

  return (
    <article>
      <Container
        as="header"
        className="min-h-55 shrink-0 py-8"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          {/* break-words: o text-5xl descarta o clamp do variant, e sem isso um
              título com palavra longa estoura a caixa em 320px */}
          <Heading variant="hero" as="h1" className="text-5xl break-words">
            {noticia.titulo}
          </Heading>
        </Content>
      </Container>

      <Container className="flex-col gap-8 py-12">
        {/* sem o max-w a linha de texto fica larga demais em monitor grande */}
        <Content className="max-w-[900px] flex-col items-stretch gap-8">
          <ImagemNoticia
            src={noticia.imagemCapa}
            alt={noticia.imagemCapaAlt}
            preload
            orientacao="horizontal"
            sizes="(min-width: 1024px) 900px, 92vw"
          />

          <time dateTime={noticia.data} className="font-semibold text-orange uppercase">
            <span className="sr-only">Publicado em </span>
            {formatarDataCompleta(noticia.data)}
          </time>

          {noticia.descricao && (
            <Text variant="dark" className="text-justify italic">
              {noticia.descricao}
            </Text>
          )}

          {blocos.map((bloco, indice) => (
            <div key={indice} className="flex flex-col gap-4">
              {bloco.titulo && (
                <Heading variant="section" as="h2">
                  {bloco.titulo}
                </Heading>
              )}
              {bloco.paragrafos.map((paragrafo, i) => (
                <Text key={i} variant="dark" className="text-justify">
                  {paragrafo}
                </Text>
              ))}
            </div>
          ))}

          <GaleriaNoticia
            conteudo={noticia.imagemConteudo}
            conteudoAlt={noticia.imagemConteudoAlt}
            destaque={noticia.imagemDestaque}
            destaqueAlt={noticia.imagemDestaqueAlt}
          />
        </Content>
      </Container>
    </article>
  )
}
