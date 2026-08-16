import Image from 'next/image'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

interface ItemLinhaTempo {
  ano: string
  legenda: string
  logo: string
  logoAlt: string
}

const ITENS_LINHA_TEMPO: ItemLinhaTempo[] = [
  {
    ano: '2006',
    legenda: 'Nasce o NEJunesp, em Araraquara',
    logo: '/sobre/NEJunesp.webp',
    logoAlt: 'Logo NEJunesp',
  },
  {
    ano: '2015',
    legenda: 'O "Núcleo UNESP" surge e em 2015 ganha um novo visual!',
    logo: '/sobre/nucleo.webp',
    logoAlt: 'Logo Núcleo UNESP',
  },
  {
    ano: '2018',
    legenda: 'Regionalização dos Núcleos em 2018',
    logo: '/sobre/nucleobau.webp',
    logoAlt: 'Logo Núcleo Bauru 2018',
  },
  {
    ano: '2020',
    legenda: 'O BauNuc do jeito que conhecemos desde 2020',
    logo: '/sobre/nucleo202.webp',
    logoAlt: 'Logo Núcleo Bauru',
  },
]

export default function Timeline() {
  return (
    <ol className="flex w-full flex-col items-center gap-4 md:grid md:grid-cols-4 md:items-start md:gap-6">
      {ITENS_LINHA_TEMPO.map((item, index) => (
        <li key={item.ano} className="flex flex-col items-center">
          <div className="flex w-full items-center">
            <div
              className={
                index === 0
                  ? 'hidden md:invisible md:block md:h-0.5 md:flex-1 md:bg-blue/30'
                  : 'hidden md:block md:h-0.5 md:flex-1 md:bg-blue/30'
              }
            />

            <Heading
              variant="content"
              className="w-full shrink-0 text-center text-3xl font-bold text-blue md:w-auto md:px-4 md:text-3xl"
            >
              {item.ano}
            </Heading>

            <div
              className={
                index === ITENS_LINHA_TEMPO.length - 1
                  ? 'hidden md:invisible md:block md:h-0.5 md:flex-1 md:bg-blue/30'
                  : 'hidden md:block md:h-0.5 md:flex-1 md:bg-blue/30'
              }
            />
          </div>

          {index > 0 && <div className="h-10 w-0.5 bg-blue/30 md:hidden" />}

          <div className="mt-4 flex md:min-h-[72px] md:items-start md:justify-center">
            <Text
              variant="dark"
              className="max-w-[240px] text-center text-base md:max-w-[180px] md:text-sm"
            >
              {item.legenda}
            </Text>
          </div>

          <div className="relative mt-6 h-30 w-30 md:h-36 md:w-36">
            <Image src={item.logo} alt={item.logoAlt} fill className="object-contain" />
          </div>
        </li>
      ))}
    </ol>
  )
}
