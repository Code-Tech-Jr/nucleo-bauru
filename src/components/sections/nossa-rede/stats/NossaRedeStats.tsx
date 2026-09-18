import { useMemo } from 'react'
import Image from 'next/image'
import { normalizar, type Ej } from '@/lib/getEjsNucleoBauru'
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

// Os SVGs são silhuetas pretas; aplicados como mask, o `bg-current` os pinta com
// o azul que o StatCard já define no wrapper (text-blue).
function IconeMascara({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-16 bg-current"
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  )
}

const ICONE_LOCAL = <IconeMascara src="/elementos/local.svg" />
const ICONE_PREDIOS = <IconeMascara src="/elementos/predios.svg" />
const ICONE_PESSOAS = <IconeMascara src="/elementos/pessoas.svg" />

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
      ejs.map((ej) => normalizar(ej.cidade)).filter((cidade) => cidade !== '')
    )
    const ies = new Set(
      ejs.map((ej) => normalizar(ej.faculdade)).filter((faculdade) => faculdade !== '')
    )

    const totalEjs = ejs.length || FALLBACK_STATS.ejs
    const totalCidades = cidades.size || FALLBACK_STATS.cidades
    const totalIes = ies.size || FALLBACK_STATS.ies

    return [
      { valor: totalEjs, sufixo: '', rotulo: 'Empresas Juniores', icone: ICONE_FOGUETE },
      { valor: totalCidades, sufixo: '', rotulo: 'Cidades', icone: ICONE_LOCAL },
      {
        valor: totalIes,
        sufixo: '',
        rotulo: 'Instituições de Ensino',
        icone: ICONE_PREDIOS,
      },
      { valor: 700, sufixo: '+', rotulo: 'Universitários', icone: ICONE_PESSOAS },
    ]
  }, [ejs])

  return (
    <ul className="mb-15 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ valor, sufixo, rotulo, icone }) => (
        <StatCard
          key={rotulo}
          valor={valor}
          sufixo={sufixo}
          rotulo={rotulo}
          icone={icone}
        />
      ))}
    </ul>
  )
}
