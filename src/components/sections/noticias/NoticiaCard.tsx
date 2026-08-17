import Image from 'next/image'
import Link from 'next/link'
import { formatarDia, formatarMes, type Noticia } from '@/lib/getNoticias'
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
        <span className="text-3xl font-extrabold">{formatarDia(noticia.data)}</span>
        <span className="text-xs font-semibold uppercase">
          {formatarMes(noticia.data)}
        </span>
      </time>

      <div className="relative aspect-16/10 w-24 shrink-0 overflow-hidden rounded-md sm:w-32">
        <Image
          src={noticia.imagemCapa}
          alt=""
          fill
          sizes="(min-width: 640px) 128px, 96px"
          className="object-cover"
        />
      </div>

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
