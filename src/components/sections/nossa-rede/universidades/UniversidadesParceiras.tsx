'use client'

import { useCallback, useRef } from 'react'
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
  'flex shrink-0 basis-[82%] snap-start items-center justify-center px-3 py-4 min-[426px]:basis-[45%] sm:basis-1/3 sm:px-4 sm:py-6 lg:px-6 lg:basis-1/4'

const SETA =
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue transition-colors hover:bg-blue/10'

export default function UniversidadesParceiras() {
  const faixaRef = useRef<HTMLUListElement>(null)
  const reduzirMovimento = useReducedMotion()

  const rolar = useCallback(
    (direcao: -1 | 1) => {
      const faixa = faixaRef.current
      if (!faixa) return
      // Largura visível inteira: as páginas não se sobrepõem, então os logos
      // restantes aparecem separados dos que já foram vistos.
      faixa.scrollBy({
        left: direcao * faixa.clientWidth,
        behavior: reduzirMovimento ? 'auto' : 'smooth',
      })
    },
    [reduzirMovimento]
  )

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
          {UNIVERSIDADES.map(({ nome, logo }, i) => (
            <li key={`${logo}-${i}`} className={SLIDE}>
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
          {/* Espaçador que completa a última página: sem ele o navegador trava a
              rolagem no fim do conteúdo e repete os logos em vez de mostrar
              espaço em branco. 7 logos → sobram 2 vãos no sm (3/pág) e 1 no lg
              (4/pág). Abaixo de sm a faixa já mostra logos cortados de propósito. */}
          <li aria-hidden="true" className="shrink-0 basis-0 sm:basis-2/3 lg:basis-1/4" />
        </ul>

        <button
          type="button"
          onClick={() => rolar(1)}
          aria-label="Ver próximas universidades"
          className={SETA}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
