import Heading from '@/components/ui/Heading'
import NoticiasEventos from '@/components/sections/noticias/NoticiasEventos'

export default function Home() {
  return (
    <>
      {/* provisório: quando a Home ganhar hero, ele vira o h1 */}
      <Heading variant="hero" as="h1" className="sr-only">
        Núcleo Bauru
      </Heading>
      <NoticiasEventos />
    </>
  )
}
