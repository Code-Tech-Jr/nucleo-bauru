'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import Heading from '@/components/ui/Heading'

// As logos saíram do Canva com fundo branco; as versões em
// public/parceiros/universidades já vêm recortadas e sem a margem branca.
const UNIVERSIDADES = [
  {
    nome: 'Unesp — Universidade Estadual Paulista',
    logo: '/parceiros/universidades/unesp-horizontal.png',
  },
  {
    nome: 'USP — Universidade de São Paulo',
    logo: '/parceiros/universidades/usp.png',
  },
  {
    nome: 'IFSP — Instituto Federal de São Paulo',
    logo: '/parceiros/universidades/ifsp-horizontal.png',
  },
  {
    nome: 'Fatec — Faculdade de Tecnologia',
    logo: '/parceiros/universidades/fatec.png',
  },
  {
    nome: 'Famema — Faculdade de Medicina de Marília',
    logo: '/parceiros/universidades/famema.png',
  },
  {
    nome: 'Unoeste — Universidade do Oeste Paulista',
    logo: '/parceiros/universidades/unoeste.png',
  },
  {
    nome: 'Unisagrado — Universidade do Sagrado Coração',
    logo: '/parceiros/universidades/unisagrado-horizontal.png',
  },
]

// 45% no mobile de propósito: o terceiro logo fica cortado na borda e denuncia
// que a faixa rola de lado, já que a barra de rolagem fica escondida.
// Até 425px cai para 82%: um logo por vez, com uma fatia do próximo aparecendo.
const SLIDE =
  'flex shrink-0 basis-[82%] snap-start items-center justify-center px-3 py-4 min-[426px]:basis-[45%] sm:basis-1/3 sm:px-4 sm:py-6 lg:basis-1/4 lg:px-6 xl:basis-1/5'

const SETA =
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue transition-colors hover:bg-blue/10 disabled:pointer-events-none disabled:opacity-30'

// Margem de 1px: o navegador arredonda scrollLeft e a última página quase nunca
// fecha a conta exata com scrollWidth.
const FOLGA = 1

export default function UniversidadesParceiras() {
  const faixaRef = useRef<HTMLUListElement>(null)
  const reduzirMovimento = useReducedMotion()
  const [temAnterior, setTemAnterior] = useState(false)
  const [temProxima, setTemProxima] = useState(false)

  const medir = useCallback(() => {
    const faixa = faixaRef.current
    if (!faixa) return
    const fim = faixa.scrollWidth - faixa.clientWidth
    setTemAnterior(faixa.scrollLeft > FOLGA)
    setTemProxima(faixa.scrollLeft < fim - FOLGA)
  }, [])

  useEffect(() => {
    const faixa = faixaRef.current
    if (!faixa) return

    medir()
    faixa.addEventListener('scroll', medir, { passive: true })
    // Rolagem só existe se os slides não couberem: a cada mudança de largura o
    // estado das setas precisa ser refeito.
    const observador = new ResizeObserver(medir)
    observador.observe(faixa)

    return () => {
      faixa.removeEventListener('scroll', medir)
      observador.disconnect()
    }
  }, [medir])

  function rolar(direcao: -1 | 1) {
    const faixa = faixaRef.current
    if (!faixa) return
    // 90% da largura visível: sobra um logo em comum entre uma página e outra.
    faixa.scrollBy({
      left: direcao * faixa.clientWidth * 0.9,
      behavior: reduzirMovimento ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      aria-labelledby="titulo-universidades"
      className="mb-15 flex w-full flex-col gap-8 rounded-3xl py-8 lg:gap-10 lg:py-12"
    >
      <Heading variant="section" id="titulo-universidades">
        Universidades Parceiras
      </Heading>

      <div className="flex items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={() => rolar(-1)}
          disabled={!temAnterior}
          aria-label="Ver universidades anteriores"
          className={SETA}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <ul
          ref={faixaRef}
          tabIndex={0}
          aria-label="Universidades parceiras do Núcleo Bauru"
          className="flex flex-1 snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {UNIVERSIDADES.map(({ nome, logo }) => (
            <li key={logo} className={SLIDE}>
              <div className="relative h-24 w-full sm:h-28 lg:h-32">
                <Image
                  src={logo}
                  alt={nome}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 23vw, (min-width: 640px) 30vw, (min-width: 426px) 42vw, 82vw"
                  className="object-contain"
                />
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => rolar(1)}
          disabled={!temProxima}
          aria-label="Ver próximas universidades"
          className={SETA}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
