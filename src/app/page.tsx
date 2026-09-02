import type { Metadata } from 'next'
import Hero from '@/components/sections/home/Hero'
import QuemSomosHome from '@/components/sections/home/QuemSomosHome'
import NossoProposito from '@/components/sections/home/NossoProposito'
import Contato from '@/components/sections/contato/Contato'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <Hero />
      <QuemSomosHome />
      <NossoProposito />
      <Contato />
    </>
  )
}
