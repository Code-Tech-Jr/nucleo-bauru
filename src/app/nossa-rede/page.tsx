import { getEjsNucleoBauru } from '@/lib/getEjsNucleoBauru'
import { getMalhaNucleoBauru } from '@/lib/getMalhaNucleoBauru'
import NossaRedeSecao from '@/components/sections/nossa-rede/NossaRede'

export default async function NossaRede() {
  const ejsPromise = getEjsNucleoBauru()
  const [ejs, dados] = await Promise.all([ejsPromise, getMalhaNucleoBauru(ejsPromise)])
  const ejsAtivas = ejs.filter((ej) => ej.ativa)

  return <NossaRedeSecao ejs={ejsAtivas} dados={dados} />
}
