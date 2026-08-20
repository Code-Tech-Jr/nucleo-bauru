import Image from 'next/image'
import Heading from '@/components/ui/Heading'
import { cn } from '@/lib/utils'

const NOME = 'Parque Tecnológico de Botucatu'
const LOGO = '/parceiros/parque-tecnologico-botucatu.png'

export default function CardParceiro({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Heading variant="section" className="text-blue">
        Parceiro oficial
        <br />
        do Núcleo
      </Heading>

      <div className="flex flex-1 items-center justify-center">
        <Image
          src={LOGO}
          alt={NOME}
          width={896}
          height={563}
          sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 30vw"
          className="h-auto w-56 max-w-full sm:w-64 lg:w-full"
        />
      </div>
    </div>
  )
}
