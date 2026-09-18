'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    nome: 'Unoeste — Universidade do Oeste Paulista',
    logo: '/parceiros/universidades/unoeste.png',
  },
  {
    nome: 'Famema — Faculdade de Medicina de Marília',
    logo: '/parceiros/universidades/famema.png',
  },
  {
    nome: 'Unisagrado — Universidade do Sagrado Coração',
    logo: '/parceiros/universidades/unisagrado-horizontal.png',
  },
]

const SETA =
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue transition-colors hover:bg-blue/10'

// Quantos logos cabem por página em cada faixa de largura. 4 no desktop
// (mantém as 4 institucionais + 3 de Marília), e vai caindo pra caber.
function logosPorPagina(largura: number) {
  if (largura >= 1024) return 4
  if (largura >= 640) return 3
  if (largura >= 426) return 2
  return 1
}

function dividir<T>(itens: T[], tamanho: number): T[][] {
  const paginas: T[][] = []
  for (let i = 0; i < itens.length; i += tamanho)
    paginas.push(itens.slice(i, i + tamanho))
  return paginas
}

export default function UniversidadesParceiras() {
  const [porPagina, setPorPagina] = useState(4)
  const [pagina, setPagina] = useState(0)

  useEffect(() => {
    const calcular = () => setPorPagina(logosPorPagina(window.innerWidth))
    calcular()
    window.addEventListener('resize', calcular)
    return () => window.removeEventListener('resize', calcular)
  }, [])

  const paginas = useMemo(() => dividir(UNIVERSIDADES, porPagina), [porPagina])

  // Clamp no render: se um resize reduziu o nº de páginas, o índice guardado
  // pode apontar pra fora — corrige aqui em vez de num effect (sem re-render).
  const atual = Math.min(pagina, paginas.length - 1)

  const mover = (direcao: -1 | 1) =>
    setPagina((atual + direcao + paginas.length) % paginas.length)

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
          onClick={() => mover(-1)}
          aria-label="Ver universidades anteriores"
          className={SETA}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <div
          aria-label="Universidades parceiras do Núcleo Bauru"
          className="flex-1 overflow-hidden"
        >
          <div
            className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${atual * 100}%)` }}
          >
            {paginas.map((grupo, i) => (
              <ul
                key={i}
                aria-hidden={i !== atual}
                className="flex w-full shrink-0 items-center justify-center gap-4 px-2 sm:gap-8 sm:px-4"
              >
                {grupo.map(({ nome, logo }) => (
                  <li key={logo} className="flex flex-1 justify-center">
                    <div className="relative h-24 w-full sm:h-28 lg:h-32">
                      <Image
                        src={logo}
                        alt={nome}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, (min-width: 426px) 45vw, 90vw"
                        className="object-contain"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => mover(1)}
          aria-label="Ver próximas universidades"
          className={SETA}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
