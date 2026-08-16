'use client'

import type { ComponentType } from 'react'
import {
  FaChevronDown,
  FaGlobe,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa6'
import type { Ej } from '@/lib/getEjsNucleoBauru'
import { cn } from '@/lib/utils'

const REDES: {
  campo: keyof Ej
  label: string
  Icone: ComponentType<{ className?: string }>
}[] = [
  { campo: 'urlSite', label: 'Site', Icone: FaGlobe },
  { campo: 'urlWhatsapp', label: 'WhatsApp', Icone: FaWhatsapp },
  { campo: 'urlInstagram', label: 'Instagram', Icone: FaInstagram },
  { campo: 'urlFacebook', label: 'Facebook', Icone: FaFacebook },
  { campo: 'urlLinkedin', label: 'LinkedIn', Icone: FaLinkedin },
  { campo: 'urlYoutube', label: 'YouTube', Icone: FaYoutube },
]

export default function EjCard({
  ej,
  aberto,
  onToggle,
}: {
  ej: Ej
  aberto: boolean
  onToggle: () => void
}) {
  const links = REDES.filter(({ campo }) => ej[campo])
  const subtitulo = [ej.faculdade, ej.cidade].filter(Boolean).join(' - ')

  // 1 coluna (mobile): só aparece quando aberto. A partir de 2 colunas (sm:): sempre visível
  const colapsavel = cn(aberto ? 'flex' : 'hidden', 'sm:flex')

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-blue/10 text-center shadow-sm transition-all duration-200 hover:bg-blue/5">
      <div className={cn(colapsavel, 'h-32 items-center justify-center p-6')}>
        {ej.urlLogo ? (
          <img
            src={ej.urlLogo}
            alt={ej.nome}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-2xl font-extrabold text-blue">{ej.nome}</span>
        )}
      </div>

      <h3 className="contents">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={aberto}
          className="flex items-center justify-between gap-2 border-blue/10 p-4 text-left sm:cursor-default sm:border-t"
        >
          <span className="flex flex-1 flex-col items-center gap-1 text-center">
            <span className="text-sm font-extrabold text-blue uppercase">{ej.nome}</span>
            {subtitulo && (
              <span className="text-xs font-extrabold text-blue/80 uppercase">
                {subtitulo}
              </span>
            )}
          </span>
          <FaChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-blue transition-transform sm:hidden',
              aberto && 'rotate-180'
            )}
          />
        </button>
      </h3>

      {links.length > 0 && (
        <div className={cn(colapsavel, 'flex-wrap justify-center gap-3 px-4 pb-4')}>
          {links.map(({ campo, label, Icone }) => (
            <a
              key={campo}
              href={ej[campo] as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} da ${ej.nome}`}
              className="text-orange transition-colors hover:text-blue"
            >
              <Icone className="h-6 w-6" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
