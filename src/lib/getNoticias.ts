import { cache } from 'react'
import { acharColuna, chaveDeColuna, parseCsv } from '@/lib/csv'
import { CLOUDINARY_BASE } from '@/lib/site'

export type Noticia = {
  id: string
  titulo: string
  descricao: string
  imagemCapa: string
  imagemCapaAlt: string
  imagemConteudo: string
  imagemConteudoAlt: string
  imagemDestaque: string
  imagemDestaqueAlt: string
  data: string
  conteudo: string
}

// O texto antes do primeiro "##" vira um bloco sem título.
export type BlocoConteudo = {
  titulo: string
  paragrafos: string[]
}

// O id vira segmento de URL. Com acento, espaço, "/" ou "%", o params chega
// percent-encoded na página e decodificado no generateMetadata — a notícia vira
// 404 silenciosa.
const FORMATO_ID = /^[a-z0-9-]+$/

// Em produção o CSV fica 5 min no Data Cache; em dev, sem cache.
const REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 300

const COLUNAS_OBRIGATORIAS = [
  'id',
  'titulo',
  'imagemCapa',
  'data',
  'conteudo',
  'publicada',
] as const

// Só o que o next.config.ts libera pro next/image: host de fora não falha o
// build, estoura no render do servidor.
function imagemOk(url: string): boolean {
  return url === '' || url.startsWith(CLOUDINARY_BASE)
}

// Valida formato E existência: "2026-13-45" e "2026-02-30" caem fora. Data
// inexistente faz o Intl lançar RangeError e derruba o build.
function dataValida(data: string): boolean {
  const quando = new Date(`${data}T00:00:00Z`)
  // getTime primeiro: toISOString() lança RangeError em data inválida
  return !Number.isNaN(quando.getTime()) && quando.toISOString().slice(0, 10) === data
}

// Publicadas, da mais recente para a mais antiga; linha incompleta é ignorada.
// `cache()` é necessário porque passar `signal` ao fetch desliga a memoização
// dele — sem isso o CSV é baixado e reparseado a cada chamada.
export const getNoticias = cache(async function getNoticias(): Promise<Noticia[]> {
  const url = process.env.NOTICIAS_SHEET_CSV_URL
  if (!url) return []

  let texto: string
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      console.error(`[noticias] planilha respondeu ${res.status}`)
      return []
    }
    texto = await res.text()
  } catch (erro) {
    // Sem o log, ninguém descobre que o site subiu sem notícia nenhuma.
    console.error('[noticias] falha ao buscar a planilha:', erro)
    return []
  }

  const [cabecalho, ...linhas] = parseCsv(texto)
  if (!cabecalho) return []

  const indices = {
    id: acharColuna(cabecalho, 'id'),
    titulo: acharColuna(cabecalho, 'titulo'),
    descricao: acharColuna(cabecalho, 'descricao'),
    imagemCapa: acharColuna(cabecalho, 'imagem_capa'),
    imagemCapaAlt: acharColuna(cabecalho, 'imagem_capa_alt'),
    imagemConteudo: acharColuna(cabecalho, 'imagem_conteudo'),
    imagemConteudoAlt: acharColuna(cabecalho, 'imagem_conteudo_alt'),
    imagemDestaque: acharColuna(cabecalho, 'imagem_destaque'),
    imagemDestaqueAlt: acharColuna(cabecalho, 'imagem_destaque_alt'),
    data: acharColuna(cabecalho, 'data'),
    conteudo: acharColuna(cabecalho, 'conteudo'),
    publicada: acharColuna(cabecalho, 'publicada'),
  }

  // Typo no cabeçalho descartaria todas as linhas em silêncio.
  for (const nome of COLUNAS_OBRIGATORIAS) {
    if (indices[nome] === -1)
      console.warn(`[noticias] coluna obrigatória "${nome}" não encontrada no cabeçalho`)
  }

  const celula = (linha: string[], indice: number) => (linha[indice] ?? '').trim()

  const noticias = linhas
    .filter((linha) => chaveDeColuna(celula(linha, indices.publicada)) === 'sim')
    .map((linha) => ({
      id: celula(linha, indices.id),
      titulo: celula(linha, indices.titulo),
      descricao: celula(linha, indices.descricao),
      imagemCapa: celula(linha, indices.imagemCapa),
      imagemCapaAlt: celula(linha, indices.imagemCapaAlt),
      imagemConteudo: celula(linha, indices.imagemConteudo),
      imagemConteudoAlt: celula(linha, indices.imagemConteudoAlt),
      imagemDestaque: celula(linha, indices.imagemDestaque),
      imagemDestaqueAlt: celula(linha, indices.imagemDestaqueAlt),
      data: celula(linha, indices.data),
      conteudo: celula(linha, indices.conteudo),
    }))
    .filter(
      (noticia) =>
        FORMATO_ID.test(noticia.id) &&
        noticia.titulo !== '' &&
        noticia.imagemCapa !== '' &&
        noticia.conteudo !== '' &&
        dataValida(noticia.data) &&
        imagemOk(noticia.imagemCapa) &&
        imagemOk(noticia.imagemConteudo) &&
        imagemOk(noticia.imagemDestaque)
    )
    .sort((a, b) => b.data.localeCompare(a.data))

  // O Next deduplica params repetidos em silêncio e a segunda notícia fica
  // inalcançável. A mais recente vence — um Map guardaria a última.
  const vistos = new Set<string>()
  return noticias.filter((noticia) => {
    if (vistos.has(noticia.id)) {
      console.warn(`[noticias] id duplicado na planilha: "${noticia.id}"`)
      return false
    }
    vistos.add(noticia.id)
    return true
  })
})

export async function getNoticia(id: string): Promise<Noticia | null> {
  const noticias = await getNoticias()
  return noticias.find((noticia) => noticia.id === id) ?? null
}

// T00:00:00Z + timeZone UTC: sem isso a data cai no dia anterior
function paraData(data: string): Date {
  return new Date(`${data}T00:00:00Z`)
}

export function formatarDia(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: 'UTC' }).format(
    paraData(data)
  )
}

export function formatarMes(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })
    .format(paraData(data))
    .replace('.', '')
}

export function formatarAno(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', timeZone: 'UTC' }).format(
    paraData(data)
  )
}

export function formatarDataCompleta(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(
    paraData(data)
  )
}

// Linhas seguidas são o mesmo parágrafo; só linha em branco começa outro. Quem
// escreve na planilha quebra linha para caber na célula, não para separar texto.
export function parseConteudo(conteudo: string): BlocoConteudo[] {
  const blocos: BlocoConteudo[] = []
  let atual: BlocoConteudo = { titulo: '', paragrafos: [] }
  let linhasDoParagrafo: string[] = []

  const fecharParagrafo = () => {
    if (linhasDoParagrafo.length > 0) {
      atual.paragrafos.push(linhasDoParagrafo.join(' '))
      linhasDoParagrafo = []
    }
  }

  const fecharBloco = () => {
    fecharParagrafo()
    if (atual.titulo !== '' || atual.paragrafos.length > 0) blocos.push(atual)
  }

  for (const linha of conteudo.split('\n')) {
    const texto = linha.trim()

    if (texto.startsWith('##')) {
      fecharBloco()
      atual = { titulo: texto.replace(/^#+/, '').trim(), paragrafos: [] }
    } else if (texto === '') {
      fecharParagrafo()
    } else {
      linhasDoParagrafo.push(texto)
    }
  }

  fecharBloco()
  return blocos
}
