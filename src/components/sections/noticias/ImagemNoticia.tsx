import Image from 'next/image'
import { cn } from '@/lib/utils'

// width/height são só dica para reservar espaço antes do carregamento; a altura
// final vem da proporção real do arquivo (`h-auto`), então nada é recortado.
const DICA_DE_PROPORCAO = {
  horizontal: { width: 1600, height: 900 },
  vertical: { width: 900, height: 1200 },
} as const

type Props = {
  src: string
  alt: string
  sizes: string
  orientacao: keyof typeof DICA_DE_PROPORCAO
  className?: string
  preload?: boolean
}

export default function ImagemNoticia({
  src,
  alt,
  sizes,
  orientacao,
  className,
  preload,
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      {...DICA_DE_PROPORCAO[orientacao]}
      sizes={sizes}
      preload={preload}
      className={cn('h-auto w-full rounded-lg', className)}
    />
  )
}
