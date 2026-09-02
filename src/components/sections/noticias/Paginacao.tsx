import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { hrefDaPagina, paginasVisiveis } from '@/lib/paginacao'
import { cn } from '@/lib/utils'

type Props = {
  atual: number
  total: number
}

const SETA = 'flex size-8 items-center justify-center rounded-full text-blue'

export default function Paginacao({ atual, total }: Props) {
  if (total <= 1) return null

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2 pt-4">
      {atual > 1 ? (
        <Link
          href={hrefDaPagina(atual - 1)}
          rel="prev"
          aria-label="Página anterior"
          className={cn(SETA, 'hover:bg-blue/10')}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(SETA, 'opacity-30')} aria-hidden="true">
          <ChevronLeft className="size-5" />
        </span>
      )}

      {paginasVisiveis(atual, total).map((pagina, indice) =>
        pagina === 'gap' ? (
          <span key={`gap-${indice}`} className="px-1 text-blue" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={pagina}
            href={hrefDaPagina(pagina)}
            aria-label={`Página ${pagina}`}
            aria-current={pagina === atual ? 'page' : undefined}
            className={cn(
              'min-w-8 rounded px-2 py-1 text-center font-semibold text-blue',
              pagina === atual
                ? 'underline decoration-2 underline-offset-4'
                : 'hover:bg-blue/10'
            )}
          >
            {pagina}
          </Link>
        )
      )}

      {atual < total ? (
        <Link
          href={hrefDaPagina(atual + 1)}
          rel="next"
          aria-label="Próxima página"
          className={cn(SETA, 'hover:bg-blue/10')}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(SETA, 'opacity-30')} aria-hidden="true">
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  )
}
