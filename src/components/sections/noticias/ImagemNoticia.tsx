'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  onFalhar?: () => void
}

// As URLs das imagens vêm da planilha
// célula com link errado a caixa inteira some, em vez de deixar um buraco vazio na matéria
export default function ImagemNoticia({
  src,
  alt,
  sizes,
  className,
  priority,
  onFalhar,
}: Props) {
  const [falhou, setFalhou] = useState(false)

  if (falhou) return null

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => {
          setFalhou(true)
          onFalhar?.()
        }}
      />
    </div>
  )
}
