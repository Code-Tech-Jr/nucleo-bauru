import ImagemNoticia from './ImagemNoticia'

type Props = {
  conteudo: string
  conteudoAlt: string
  destaque: string
  destaqueAlt: string
}

// 70/30 é a proporção de uma horizontal e uma vertical na mesma altura: com as
// duas presentes elas se alinham sozinhas. Sozinha, a horizontal ocupa a largura
// toda, como a capa.
export default function GaleriaNoticia({
  conteudo,
  conteudoAlt,
  destaque,
  destaqueAlt,
}: Props) {
  if (!conteudo && !destaque) return null

  const ladoALado = Boolean(conteudo && destaque)

  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:justify-center">
      {conteudo && (
        <ImagemNoticia
          src={conteudo}
          alt={conteudoAlt}
          orientacao="horizontal"
          // sozinha ela vale os 900px da capa, não os 620 de meia linha
          sizes={
            ladoALado
              ? '(min-width: 982px) 620px, (min-width: 768px) 65vw, 92vw'
              : '(min-width: 1024px) 900px, 92vw'
          }
          className={ladoALado ? 'md:basis-[70%]' : undefined}
        />
      )}

      {destaque && (
        <ImagemNoticia
          src={destaque}
          alt={destaqueAlt}
          orientacao="vertical"
          sizes={
            ladoALado
              ? '(min-width: 982px) 266px, (min-width: 768px) 28vw, 92vw'
              : '(min-width: 982px) 300px, (min-width: 768px) 32vw, 92vw'
          }
          // contida: em 900px de largura a vertical teria 1200px de altura
          className={ladoALado ? 'md:basis-[30%]' : 'md:w-1/3'}
        />
      )}
    </div>
  )
}
