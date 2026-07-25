'use client'

import { useState } from 'react'
import type { Ej } from '@/lib/getEjsNucleoBauru'
import EjCard from '@/components/sections/nossa-rede/card/EjCard'

export default function ListaEjs({ ejs }: { ejs: Ej[] }) {
  // No desktop o estado é ignorado — o card força tudo visível via lg:, então isso só governa o mobile.
  const [abertoId, setAbertoId] = useState<string | null>(null)

  if (ejs.length === 0) {
    return (
      <p className="text-center text-blue/60">Nenhuma EJ encontrada com esses filtros.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[1300px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
      {ejs.map((ej) => (
        <EjCard
          key={ej.id}
          ej={ej}
          aberto={abertoId === ej.id}
          onToggle={() => setAbertoId((atual) => (atual === ej.id ? null : ej.id))}
        />
      ))}
    </div>
  )
}
