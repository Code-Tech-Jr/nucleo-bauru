'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Ej } from '@/lib/getEjsNucleoBauru'
import {
  alternarSelecao,
  buscarSugestoes,
  contarSelecionados,
  criarSelecaoVazia,
  extrairOpcoesEjs,
  filtrarEjs,
  type Categoria,
} from '@/lib/filtrarEjs'
import FiltroEjs from './search/FiltroEjs'
import ListaEjs from './search/ListaEjs'
import NossaRedeStats from './stats/NossaRedeStats'
import Content from '@/components/ui/Content'
import Container from '@/components/ui/Container'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Resultado from '@/components/sections/home/Resultado'

const Map = dynamic(() => import('./map/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded bg-blue/5" />,
})

function aspectoDaMalha(dados: GeoJSON.FeatureCollection): number {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity
  const visitar = (n: unknown) => {
    if (Array.isArray(n) && typeof n[0] === 'number') {
      const [lng, lat] = n as [number, number]
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    } else if (Array.isArray(n)) n.forEach(visitar)
  }
  for (const f of dados.features) {
    if (f.geometry && 'coordinates' in f.geometry) visitar(f.geometry.coordinates)
  }
  const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
  const dy = mercY(maxLat) - mercY(minLat)
  const dx = ((maxLng - minLng) * Math.PI) / 180
  return dy > 0 ? dx / dy : 1
}

export default function NossaRedeCliente({
  ejs,
  dados,
}: {
  ejs: Ej[]
  dados: GeoJSON.FeatureCollection
}) {
  const [busca, setBusca] = useState('')
  const [selecao, setSelecao] = useState(criarSelecaoVazia())

  const opcoes = useMemo(() => extrairOpcoesEjs(ejs), [ejs])
  const sugestoes = useMemo(
    () => buscarSugestoes(opcoes, selecao, busca),
    [opcoes, selecao, busca]
  )
  const totalSelecionados = contarSelecionados(selecao)
  const resultado = useMemo(() => filtrarEjs(ejs, selecao), [ejs, selecao])

  const cidadesDestacadas = useMemo(
    () => new Set(totalSelecionados > 0 ? resultado.map((ej) => ej.cidade) : []),
    [resultado, totalSelecionados]
  )

  const aspecto = useMemo(() => aspectoDaMalha(dados), [dados])

  function alternar(categoria: Categoria, valor: string) {
    setSelecao((atual) => alternarSelecao(atual, categoria, valor))
  }

  function limparFiltros() {
    setSelecao(criarSelecaoVazia())
    setBusca('')
  }

  return (
    <main>
      <Container
        as="section"
        className="mb-15 h-55"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          <Heading variant="hero" className="text-5xl">
            Nossa Rede
          </Heading>
        </Content>
      </Container>
      <Container>
        <Content className="flex-col items-stretch gap-8">
          <NossaRedeStats ejs={ejs} />
          <Heading variant={'section'} as="h1">
            NOSSA REDE
          </Heading>
          <div className="flex flex-col gap-4">
            <Text variant={'dark'} className="text-justify">
              O Núcleo Bauru é formado por uma rede de Empresas Juniores da Unesp que
              acreditam no empreendedorismo como ferramenta de transformação. Cada EJ atua
              em sua área de conhecimento, desenvolvendo projetos reais para clientes e
              proporcionando aos universitários uma vivência prática em gestão, liderança,
              inovação e impacto. Mais do que organizações independentes, nossas empresas
              compartilham um mesmo propósito: formar líderes capazes de gerar resultados
              para a sociedade.
            </Text>
            <Text variant={'dark'} className="text-justify">
              Ao fazer parte dessa rede, as Empresas Juniores encontram um ambiente de
              colaboração, troca de experiências e desenvolvimento contínuo. O Núcleo
              conecta pessoas, fortalece boas práticas, impulsiona o crescimento das EJs e
              cria oportunidades para que cada uma evolua de acordo com sua realidade.
              Juntas, construímos um movimento mais forte, mostrando que, quando
              caminhamos em rede, o desenvolvimento de uma Empresa Júnior impulsiona o
              sucesso de todas.
            </Text>
          </div>
          {/* mobile: empilha na ordem do DOM (busca -> mapa -> cards). >=1300px: grid 2 colunas
            via grid-template-areas, com o mapa ocupando as duas linhas da direita */}
          <div className="mb-15 grid w-full grid-cols-1 gap-6 min-[1300px]:grid-cols-[55fr_45fr] min-[1300px]:items-start min-[1300px]:[grid-template-areas:'busca_mapa''cards_mapa']">
            <div className="min-[1300px]:[grid-area:busca]">
              <FiltroEjs
                busca={busca}
                onBuscaChange={setBusca}
                selecao={selecao}
                sugestoes={sugestoes}
                onToggle={alternar}
                onLimpar={limparFiltros}
              />
            </div>

            <div className="min-[1300px]:sticky min-[1300px]:top-4 min-[1300px]:[grid-area:mapa]">
              <div style={{ aspectRatio: aspecto }}>
                <Map
                  dados={dados}
                  cidadesDestacadas={cidadesDestacadas}
                  onMunicipioClick={(nome) => alternar('cidade', nome)}
                />
              </div>
            </div>

            <div className="min-[1300px]:[grid-area:cards]">
              {totalSelecionados > 0 ? (
                <ListaEjs ejs={resultado} />
              ) : (
                <p className="text-center text-blue/60">
                  Busque por nome, cidade, faculdade ou curso para ver as EJs.
                </p>
              )}
            </div>
          </div>
        </Content>
      </Container>

      <Container as="section" className="mb-15">
        <Content>
          <Resultado />
        </Content>
      </Container>
    </main>
  )
}
