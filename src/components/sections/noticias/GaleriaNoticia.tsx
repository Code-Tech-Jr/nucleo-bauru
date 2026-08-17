'use client'

import { useState } from 'react'
import ImagemNoticia from './ImagemNoticia'

type Props = {
  conteudo: string
  destaque: string
}

// Galeria que fecha a matéria: as duas imagens lado a lado, com a mesma altura.
// As larguras (70/30) são a proporção de cada uma numa altura de 352px — assim a
// horizontal e a vertical ficam alinhadas sem cortar quase nada. No mobile empilham,
// cada uma com o seu próprio formato. `grow`: se só uma das duas vier preenchida na
// planilha (ou se a outra quebrar), a que sobrou ocupa a linha inteira.
export default function GaleriaNoticia({ conteudo, destaque }: Props) {
  const [quebradas, setQuebradas] = useState<string[]>([])

  const imagens = []
  if (conteudo) {
    imagens.push({
      src: conteudo,
      className: 'aspect-video grow md:aspect-auto md:basis-[70%]',
      sizes: '(min-width: 768px) 620px, 92vw',
    })
  }
  if (destaque) {
    imagens.push({
      src: destaque,
      className: 'aspect-3/4 grow md:aspect-auto md:basis-[30%]',
      sizes: '(min-width: 768px) 266px, 92vw',
    })
  }

  const visiveis = imagens.filter(({ src }) => !quebradas.includes(src))
  if (visiveis.length === 0) return null

  return (
    <div className="flex flex-col gap-4 md:h-88 md:flex-row">
      {visiveis.map(({ src, className, sizes }) => (
        <ImagemNoticia
          key={src}
          src={src}
          alt=""
          sizes={sizes}
          className={className}
          onFalhar={() => setQuebradas((atual) => [...atual, src])}
        />
      ))}
    </div>
  )
}
