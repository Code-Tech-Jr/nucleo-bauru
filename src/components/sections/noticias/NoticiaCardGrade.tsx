import Link from 'next/link'
import {
  formatarDataCompleta,
  formatarAno,
  formatarDia,
  formatarMes,
  type Noticia,
} from '@/lib/getNoticias'
import Heading from '@/components/ui/Heading'
import ImagemNoticia from './ImagemNoticia'

export default function NoticiaCardGrade({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      href={`/noticias-e-eventos/${noticia.id}`}
      className="flex h-full flex-col gap-3 rounded-2xl border border-blue/20 p-3 transition-colors hover:bg-blue/5"
    >
      {/* proporção fixa para os cards da mesma linha alinharem;
          object-contain mantém a foto inteira */}
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-blue/10">
        <ImagemNoticia
          src={noticia.imagemCapa}
          alt=""
          orientacao="horizontal"
          sizes="(min-width: 1280px) 282px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="h-full rounded-none object-contain"
        />
      </div>

      {/* o line-clamp precisa de display:-webkit-box, então o flex fica no pai */}
      <div className="flex flex-1 items-center justify-center px-1">
        <Heading variant="news" as="h3" className="line-clamp-3 text-center text-xl">
          {noticia.titulo}
        </Heading>
      </div>

      <time
        dateTime={noticia.data}
        className="self-end text-sm font-semibold text-blue uppercase"
      >
        <span className="sr-only">{formatarDataCompleta(noticia.data)}</span>
        <span aria-hidden="true">
          {formatarDia(noticia.data)} {formatarMes(noticia.data)}{' '}
          {formatarAno(noticia.data)}
        </span>
      </time>
    </Link>
  )
}
