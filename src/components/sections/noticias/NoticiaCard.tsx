import Link from 'next/link'
import {
  formatarDataCompleta,
  formatarDia,
  formatarMes,
  type Noticia,
} from '@/lib/getNoticias'
import ImagemNoticia from './ImagemNoticia'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

export default function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      href={`/noticias-e-eventos/${noticia.id}`}
      className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-blue/5"
    >
      <time
        dateTime={noticia.data}
        className="flex w-12 shrink-0 flex-col items-center leading-none text-blue"
      >
        <span className="sr-only">{formatarDataCompleta(noticia.data)}</span>
        <span aria-hidden="true" className="text-3xl font-extrabold">
          {formatarDia(noticia.data)}
        </span>
        <span aria-hidden="true" className="text-xs font-semibold uppercase">
          {formatarMes(noticia.data)}
        </span>
      </time>

      {/* alt vazio: o título ao lado já é o texto do link */}
      <ImagemNoticia
        src={noticia.imagemCapa}
        alt=""
        orientacao="horizontal"
        sizes="(min-width: 640px) 128px, 96px"
        className="w-24 shrink-0 rounded-md sm:w-32"
      />

      <div className="flex min-w-0 flex-col gap-0.5">
        <Heading variant="news" as="h3" className="line-clamp-1">
          {noticia.titulo}
        </Heading>
        {noticia.descricao && (
          <Text variant="dark" className="line-clamp-2 text-sm font-normal">
            {noticia.descricao}
          </Text>
        )}
      </div>
    </Link>
  )
}
