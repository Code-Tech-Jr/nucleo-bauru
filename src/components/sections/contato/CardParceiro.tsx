'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import Heading from '@/components/ui/Heading'
import { cn } from '@/lib/utils'

const PARCEIROS = [
  {
    nome: 'Parque Tecnológico de Botucatu',
    logo: '/parceiros/parque-tecnologico-botucatu.png',
  },
  { nome: 'Fundação Inova Prudente', logo: '/parceiros/fundacao_inova_prudente.PNG' },
]

// Loop infinito: triplicamos a lista e mantemos a rolagem na cópia do meio.
// Ao passar de uma borda, saltamos um conjunto inteiro — como as cópias são
// idênticas, o salto é invisível. (mesmo esquema de UniversidadesParceiras)
const FAIXA = [...PARCEIROS, ...PARCEIROS, ...PARCEIROS]

const SETA =
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue transition-colors hover:bg-blue/10'

const AUTOPLAY_MS = 5000

export default function CardParceiro({ className }: { className?: string }) {
  const faixaRef = useRef<HTMLUListElement>(null)
  const reduzirMovimento = useReducedMotion()
  const pausadoRef = useRef(false)

  // Mantém a rolagem dentro da cópia do meio para haver folga dos dois lados.
  const normalizar = useCallback(() => {
    const faixa = faixaRef.current
    if (!faixa) return
    const conjunto = faixa.scrollWidth / 3
    if (faixa.scrollLeft < conjunto) faixa.scrollLeft += conjunto
    else if (faixa.scrollLeft >= conjunto * 2) faixa.scrollLeft -= conjunto
  }, [])

  useEffect(() => {
    const faixa = faixaRef.current
    if (!faixa) return
    faixa.scrollLeft = faixa.scrollWidth / 3
    faixa.addEventListener('scrollend', normalizar)
    return () => faixa.removeEventListener('scrollend', normalizar)
  }, [normalizar])

  const rolar = useCallback(
    (direcao: -1 | 1) => {
      const faixa = faixaRef.current
      if (!faixa) return
      faixa.scrollBy({
        left: direcao * faixa.clientWidth,
        behavior: reduzirMovimento ? 'auto' : 'smooth',
      })
    },
    [reduzirMovimento]
  )

  useEffect(() => {
    if (reduzirMovimento) return
    const id = setInterval(() => {
      if (!pausadoRef.current && !document.hidden) rolar(1)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [reduzirMovimento, rolar])

  return (
    <div id="parceiros" className={cn('flex scroll-mt-24 flex-col gap-6', className)}>
      <Heading variant="section" className="text-blue">
        Parceiro oficial
        <br />
        do Núcleo
      </Heading>

      <div
        className="flex flex-1 items-center justify-center gap-1 sm:gap-2"
        onMouseEnter={() => (pausadoRef.current = true)}
        onMouseLeave={() => (pausadoRef.current = false)}
        onFocusCapture={() => (pausadoRef.current = true)}
        onBlurCapture={() => (pausadoRef.current = false)}
      >
        <button
          type="button"
          onClick={() => rolar(-1)}
          aria-label="Ver parceiro anterior"
          className={SETA}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <ul
          ref={faixaRef}
          tabIndex={0}
          aria-label="Parceiros oficiais do Núcleo Bauru"
          className="flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {FAIXA.map(({ nome, logo }, i) => (
            <li
              key={`${logo}-${i}`}
              className="flex shrink-0 basis-full snap-start justify-center min-[785px]:basis-1/2 min-[785px]:px-4 lg:basis-full lg:px-0"
            >
              <div className="relative aspect-[896/563] w-full">
                <Image
                  src={logo}
                  alt={nome}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 785px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => rolar(1)}
          aria-label="Ver próximo parceiro"
          className={SETA}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
