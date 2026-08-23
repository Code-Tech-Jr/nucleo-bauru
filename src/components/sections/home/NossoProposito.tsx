import Image from 'next/image'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

const MVV = [
  {
    titulo: 'Missão',
    icone: '/elementos/missão.svg',
    texto:
      'Evoluir a organização e ampliar o acesso à vivência empresarial, formando lideranças comprometidas e capazes de potencializar os resultados para que a Força do Interior impacte em um Brasil mais empreendedor.',
  },
  {
    titulo: 'Visão',
    icone: '/elementos/visao.svg',
    texto:
      'Ser um Núcleo referência pela excelência construída através de uma rede forte, sustentável e protagonista.',
  },
  {
    titulo: 'Valores',
    icone: '/elementos/valores.svg',
    texto:
      'Mais do que princípios, eles refletem nossa essência: é aquilo que nos une, direciona nossas escolhas e dá sentido ao nosso movimento.',
  },
]

const PILARES = [
  'Batemos Metas Noite e Dia',
  'Temos orgulho de ser do Interior',
  'Somos a brasa que incendeia o MEJ Paulista',
  'Construímos Chamas que não se apagam',
  'A rede SEMPRE será a resposta',
]

// TODO(conteudo): substituir pelos eventos e notícias reais assim que o time
// de conteúdo definir de onde eles vêm (CMS, planilha, etc.)
const NOTICIAS = [
  {
    data: 'Em breve',
    titulo: 'Novidades do Núcleo',
    resumo: 'Em breve, novidades por aqui.',
  },
  {
    data: 'Em breve',
    titulo: 'Novidades do Núcleo',
    resumo: 'Em breve, novidades por aqui.',
  },
  {
    data: 'Em breve',
    titulo: 'Novidades do Núcleo',
    resumo: 'Em breve, novidades por aqui.',
  },
]

function MissaoVisaoValores() {
  return (
    <ul className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
      {MVV.map(({ titulo, icone, texto }) => (
        <li
          key={titulo}
          className="flex flex-col gap-4 rounded-3xl border border-blue/15 p-6 text-left shadow-card transition-transform duration-300 hover:-translate-y-1 lg:p-8"
        >
          <div className="flex items-center justify-between">
            <Heading variant="content" as="h3" className="text-xl lg:text-2xl">
              {titulo}
            </Heading>
            <Image
              src={icone}
              alt=""
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12"
            />
          </div>
          <Text variant="dark" className="text-base">
            {texto}
          </Text>
        </li>
      ))}
    </ul>
  )
}

function Pilares() {
  return (
    <div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl bg-blue px-6 py-10 lg:flex-row lg:items-center lg:gap-16 lg:px-16 lg:py-16">
      <Image
        src="/elementos/chaminha.svg"
        alt=""
        width={220}
        height={220}
        unoptimized
        className="w-40 shrink-0 lg:w-56"
      />

      <ol className="flex w-full flex-col gap-4 text-left lg:columns-2 lg:gap-x-10">
        {PILARES.map((pilar, indice) => (
          <li
            key={pilar}
            className="break-inside-avoid text-lg leading-relaxed font-bold text-white lg:text-xl"
          >
            {indice + 1}. {pilar}
          </li>
        ))}
      </ol>
    </div>
  )
}

function RedeENoticias() {
  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-blue/15 p-6 shadow-card lg:p-8">
        <Heading variant="section" as="h3">
          Nossa Rede
        </Heading>
        <Heading variant="content" as="p" className="text-xl">
          Encontre a EJ mais próxima de você
        </Heading>

        <Image
          src="/elementos/mapa_home.svg"
          alt="Mapa de São Paulo com a rede de Empresas Juniores do Núcleo Bauru"
          width={420}
          height={420}
          unoptimized
          className="mx-auto w-full max-w-[280px]"
        />

        <Button href="/nossa-rede" variant="light" showArrow>
          Conheça nossa rede
        </Button>
      </div>

      <div
        id="eventos-e-noticias"
        className="flex scroll-mt-24 flex-col gap-6 rounded-3xl border border-blue/15 p-6 shadow-card lg:p-8"
      >
        <Heading variant="section" as="h3">
          Eventos e Notícias
        </Heading>

        <ul className="flex flex-col gap-5">
          {NOTICIAS.map((noticia, indice) => (
            <li key={indice} className="flex items-center gap-4 text-left">
              <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-lg bg-orange text-xs font-bold text-white uppercase">
                {noticia.data}
              </span>
              <div>
                <p className="font-extrabold text-blue">{noticia.titulo}</p>
                <p className="text-sm text-blue/70">{noticia.resumo}</p>
              </div>
            </li>
          ))}
        </ul>

        <Button
          href="/noticias-e-eventos"
          variant="light"
          showArrow
          className="self-end text-sm font-bold text-orange"
        >
          Todas as Notícias
        </Button>
      </div>
    </div>
  )
}

function Resultado() {
  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-3xl bg-blue px-6 py-10 text-left lg:flex-row lg:justify-between lg:gap-16 lg:px-16 lg:py-14">
      <div className="flex flex-col items-start gap-4">
        <Heading variant="section" as="h3">
          Resultado
        </Heading>
        <Heading variant="hero" as="p" className="text-4xl lg:text-5xl">
          Somos a Evolução!
        </Heading>

        <Text variant="light" className="max-w-lg">
          No ano de 2025, mais de 240 soluções entregues e toda a verba revertida em
          educação e desenvolvimento da rede do Núcleo Bauru.
        </Text>

        <Button href="/#contato" variant="solid" showArrow>
          Contrate uma EJ
        </Button>
      </div>

      <Image
        src="/logos/logo_chama.svg"
        alt=""
        width={220}
        height={220}
        unoptimized
        className="hidden w-40 shrink-0 lg:block"
      />
    </div>
  )
}

export default function NossoProposito() {
  return (
    <Container
      as="section"
      aria-labelledby="titulo-nosso-proposito"
      className="py-16 lg:py-20"
    >
      <Content className="flex-col items-stretch gap-14 lg:gap-16">
        <div className="flex flex-col items-center gap-3 border-t-2 border-orange pt-8 text-center lg:border-none lg:pt-0">
          <Heading variant="section" id="titulo-nosso-proposito">
            Nosso propósito
          </Heading>
          <Heading variant="content" as="p" className="max-w-2xl">
            Transformar o Brasil em um país empreendedor.
          </Heading>
        </div>

        <MissaoVisaoValores />
        <Pilares />
        <RedeENoticias />
        <Resultado />
      </Content>
    </Container>
  )
}
