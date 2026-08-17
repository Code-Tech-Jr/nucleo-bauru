export type Noticia = {
  id: string
  titulo: string
  descricao: string
  imagemCapa: string
  imagemConteudo: string
  imagemDestaque: string
  data: string
  conteudo: string
}

// Bloco de conteúdo: o texto da planilha é dividido em subtitulos pelas linhas
// iniciadas em "##" (ver o guia de uso da planilha). O texto antes do primeiro "##"
// vira um bloco sem título.
export type BlocoConteudo = {
  titulo: string
  paragrafos: string[]
}

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/

// Em produção o CSV fica 5 min no Data Cache.
// Em dev, 0 = sem cache
// e uma edição na planilha só aparece 5 min depois.
const REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 300

function parseCsv(texto: string): string[][] {
  const linhas: string[][] = []
  let campo = ''
  let linha: string[] = []
  let dentroDeAspas = false

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i]

    if (dentroDeAspas) {
      if (char === '"' && texto[i + 1] === '"') {
        campo += '"'
        i++
      } else if (char === '"') {
        dentroDeAspas = false
      } else {
        campo += char
      }
      continue
    }

    if (char === '"') {
      dentroDeAspas = true
    } else if (char === ',') {
      linha.push(campo)
      campo = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && texto[i + 1] === '\n') i++
      linha.push(campo)
      linhas.push(linha)
      linha = []
      campo = ''
    } else {
      campo += char
    }
  }
  if (campo !== '' || linha.length > 0) {
    linha.push(campo)
    linhas.push(linha)
  }

  return linhas.filter((l) => l.some((c) => c.trim() !== ''))
}

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function acharIndice(
  cabecalho: string[],
  predicado: (coluna: string) => boolean
): number {
  return cabecalho.findIndex((coluna) => predicado(normalizar(coluna)))
}

/*
 Notícias e eventos publicados, da mais recente para a mais antiga.
 Uma linha só entra na lista se tiver `publicada = SIM` e todos os campos
 obrigatórios preenchidos (id, titulo, data, imagem_capa, conteudo). Linha
 incompleta é ignorada
 */
export async function getNoticias(): Promise<Noticia[]> {
  const url = process.env.NOTICIAS_SHEET_CSV_URL
  if (!url) return []

  let texto: string
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return []
    texto = await res.text()
  } catch {
    // Planilha fora do ar ou timeout: a seção da Home não aparece
    return []
  }

  const [cabecalho, ...linhas] = parseCsv(texto)
  if (!cabecalho) return []

  const indices = {
    id: acharIndice(cabecalho, (c) => c === 'id'),
    titulo: acharIndice(cabecalho, (c) => c.startsWith('titulo')),
    descricao: acharIndice(cabecalho, (c) => c.startsWith('descricao')),
    imagemCapa: acharIndice(cabecalho, (c) => c.includes('capa')),
    imagemConteudo: acharIndice(
      cabecalho,
      (c) => c.includes('imagem') && c.includes('conteudo')
    ),
    imagemDestaque: acharIndice(cabecalho, (c) => c.includes('destaque')),
    data: acharIndice(cabecalho, (c) => c === 'data'),
    conteudo: acharIndice(cabecalho, (c) => c === 'conteudo'),
    publicada: acharIndice(cabecalho, (c) => c.startsWith('publicada')),
  }

  return linhas
    .filter((linha) => normalizar(linha[indices.publicada] ?? '') === 'sim')
    .map((linha) => ({
      id: (linha[indices.id] ?? '').trim(),
      titulo: (linha[indices.titulo] ?? '').trim(),
      descricao: (linha[indices.descricao] ?? '').trim(),
      imagemCapa: (linha[indices.imagemCapa] ?? '').trim(),
      imagemConteudo: (linha[indices.imagemConteudo] ?? '').trim(),
      imagemDestaque: (linha[indices.imagemDestaque] ?? '').trim(),
      data: (linha[indices.data] ?? '').trim(),
      conteudo: (linha[indices.conteudo] ?? '').trim(),
    }))
    .filter(
      (noticia) =>
        noticia.id !== '' &&
        noticia.titulo !== '' &&
        noticia.imagemCapa !== '' &&
        noticia.conteudo !== '' &&
        FORMATO_DATA.test(noticia.data)
    )
    .sort((a, b) => b.data.localeCompare(a.data))
}

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

export function formatarDataCompleta(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(
    paraData(data)
  )
}

/** Divide o campo `conteudo` nos subcapítulos marcados com "##". */
export function parseConteudo(conteudo: string): BlocoConteudo[] {
  const blocos: BlocoConteudo[] = []
  let atual: BlocoConteudo = { titulo: '', paragrafos: [] }

  for (const linha of conteudo.split('\n')) {
    const texto = linha.trim()

    if (texto.startsWith('##')) {
      if (atual.titulo !== '' || atual.paragrafos.length > 0) blocos.push(atual)
      atual = { titulo: texto.replace(/^#+/, '').trim(), paragrafos: [] }
    } else if (texto !== '') {
      atual.paragrafos.push(texto)
    }
  }

  if (atual.titulo !== '' || atual.paragrafos.length > 0) blocos.push(atual)
  return blocos
}
