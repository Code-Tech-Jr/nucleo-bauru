import Image from 'next/image'
import Heading from '@/components/ui/Heading'
import { cn } from '@/lib/utils'

// props com default pra trocar de parceiro sem mexer na seção
export default function CardParceiro({
  nome = 'Parque Tecnológico de Botucatu',
  logo = '/parceiros/parque-tecnologico-botucatu.png',
  className,
}: {
  nome?: string
  logo?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* título aqui é azul, não o laranja padrão da variant */}
      <Heading variant="section" className="text-blue">
        Parceiro oficial
        <br />
        do Núcleo
      </Heading>

      <div className="flex flex-1 items-center justify-center">
        {/* dimensões reais do arquivo: seguram o espaço e evitam layout shift */}
        <Image
          src={logo}
          alt={nome}
          width={896}
          height={563}
          className="h-auto w-56 max-w-full sm:w-64 lg:w-full"
        />
      </div>
    </div>
  )
}
