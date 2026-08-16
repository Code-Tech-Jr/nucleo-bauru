'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import type { Ej } from '@/lib/getEjsNucleoBauru'
import StatCard from './StatCard'

const ICONE_FOGUETE = (
  <Image
    src="/elementos/foguete.png"
    alt=""
    width={80}
    height={68}
    className="object-contain"
  />
)

// Fallback com os números do design original, usado quando os dados das EJs
// não estão disponíveis (ex.: planilha indisponível) e os valores vêm zerados.
const FALLBACK_STATS = {
  ejs: 40,
  cidades: 12,
  ies: 7,
} as const

export default function NossaRedeStats({ ejs }: { ejs: Ej[] }) {
  const stats = useMemo(() => {
    const cidades = new Set(
      ejs.map((ej) => ej.cidade).filter((cidade) => cidade.trim() !== '')
    )
    const ies = new Set(
      ejs.map((ej) => ej.faculdade).filter((faculdade) => faculdade.trim() !== '')
    )

    const totalEjs = ejs.length || FALLBACK_STATS.ejs
    const totalCidades = cidades.size || FALLBACK_STATS.cidades
    const totalIes = ies.size || FALLBACK_STATS.ies

    return [
      { valor: totalEjs, sufixo: '', rotulo: 'Empresas Juniores' },
      { valor: totalCidades, sufixo: '', rotulo: 'Cidades' },
      { valor: totalIes, sufixo: '', rotulo: 'IES' },
      { valor: 700, sufixo: '+', rotulo: 'Universitários' },
    ]
  }, [ejs])

  return (
    <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ valor, sufixo, rotulo }) => (
        <StatCard
          key={rotulo}
          valor={valor}
          sufixo={sufixo}
          rotulo={rotulo}
          icone={ICONE_FOGUETE}
        />
      ))}
    </ul>
  )
}
