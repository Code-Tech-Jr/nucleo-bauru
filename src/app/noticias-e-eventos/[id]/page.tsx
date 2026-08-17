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

// Este arquivo é o molde de todas as notícias e eventos
// o conteúdo vem da planilha, o layout é sempre este

type Params = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const noticias = await getNoticias()
  return noticias.map((noticia) => ({ id: noticia.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const noticia = await getNoticia(id)
  if (!noticia) return {}

  return {
    title: `${noticia.titulo} | Núcleo Bauru`,
    description: noticia.descricao || undefined,
  }
}

export default async function NoticiaPage({ params }: Params) {
  const { id } = await params
  const noticia = await getNoticia(id)
  if (!noticia) notFound()

  const blocos = parseConteudo(noticia.conteudo)

  return (
    <>
      <Container
        as="section"
        className="min-h-55 shrink-0 py-8"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          <Heading variant="hero" as="h1" className="text-5xl">
            {noticia.titulo}
          </Heading>
        </Content>
      </Container>

      <Container as="article" className="flex-col gap-8 py-12">
        {/* max-w: sem isso, em monitor grande a linha de texto fica larga demais e cada
            imagem aspect-video vira um bloco de ~950px de altura */}
        <Content className="max-w-[900px] flex-col items-stretch gap-8">
          <ImagemNoticia
            src={noticia.imagemCapa}
            alt={noticia.titulo}
            priority
            sizes="(min-width: 1024px) 900px, 92vw"
            className="aspect-video w-full"
          />

          <time dateTime={noticia.data} className="font-semibold text-orange uppercase">
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
            destaque={noticia.imagemDestaque}
          />
        </Content>
      </Container>
    </>
  )
}
