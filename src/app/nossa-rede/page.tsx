import type { Metadata } from 'next'
import { getEjsNucleoBauru } from '@/lib/getEjsNucleoBauru'
import { getMalhaNucleoBauru } from '@/lib/getMalhaNucleoBauru'
import NossaRedeSecao from '@/components/sections/nossa-rede/NossaRede'

export const metadata: Metadata = {
  title: 'Nossa Rede',
  description:
    'As empresas juniores da rede do Núcleo Bauru no Oeste Paulista, com mapa interativo.',
  alternates: { canonical: '/nossa-rede' },
}

export default async function NossaRede() {
  const ejsPromise = getEjsNucleoBauru()
  const [ejs, dados] = await Promise.all([ejsPromise, getMalhaNucleoBauru(ejsPromise)])
  const ejsAtivas = ejs.filter((ej) => ej.ativa)

  return <NossaRedeSecao ejs={ejsAtivas} dados={dados} />
}
