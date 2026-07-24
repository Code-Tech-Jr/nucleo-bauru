// components/sections/Timeline.tsx
import Image from 'next/image'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

interface TimelineItem {
  year: string
  caption: string
  logo: string
  logoAlt: string
}

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: '2006',
    caption: '',
    logo: '/sobre/NEJunesp.svg',
    logoAlt: 'Logo NEJunesp',
  },
  {
    year: '2015',
    caption: 'O "Núcleo UNESP" surge e em 2015 ganha um novo visual!',
    logo: '/sobre/nucleo.svg',
    logoAlt: 'Logo Núcleo UNESP',
  },
  {
    year: '2018',
    caption: 'Regionalização dos Núcleos em 2018',
    logo: '/sobre/nucleobau.svg',
    logoAlt: 'Logo Núcleo Bauru 2018',
  },
  {
    year: '2020',
    caption: 'O BauNuc do jeito que conhecemos desde 2020',
    logo: '/sobre/nucleo202.svg',
    logoAlt: 'Logo Núcleo Bauru',
  },
]

export default function Timeline() {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:grid md:grid-cols-4 md:items-start md:gap-6">
      {TIMELINE_ITEMS.map((item, index) => (
        <div key={item.year} className="flex flex-col items-center">
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
              {item.year}
            </Heading>

            <div
              className={
                index === TIMELINE_ITEMS.length - 1
                  ? 'hidden md:invisible md:block md:h-0.5 md:flex-1 md:bg-blue/30'
                  : 'hidden md:block md:h-0.5 md:flex-1 md:bg-blue/30'
              }
            />
          </div>

          {index > 0 && <div className="h-10 w-0.5 bg-blue/30 md:hidden" />}

          {/* Área reservada pra legenda, com altura fixa no desktop pra alinhar as logos */}
          <div className="mt-4 flex md:h-[72px] md:items-start md:justify-center">
            {item.caption && (
              <Text
                variant="dark"
                className="max-w-[240px] text-center text-base md:max-w-[180px] md:text-sm"
              >
                {item.caption}
              </Text>
            )}
          </div>

          <div className="relative mt-6 h-30 w-30 md:h-36 md:w-36">
            <Image src={item.logo} alt={item.logoAlt} fill className="object-contain" />
          </div>
        </div>
      ))}
    </div>
  )
}
