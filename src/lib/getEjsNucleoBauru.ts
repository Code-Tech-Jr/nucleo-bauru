import { normalizar, parseCsv } from '@/lib/csv'

// NossaRedeStats importa normalizar daqui; reexporta pra não mexer no consumidor.
export { normalizar }

// Esta planilha casa coluna por predicado (mais frouxo que o das notícias, que
// usa nome exato). Mantido como está: mudar a política de casamento aqui mexeria
// numa página em produção sem necessidade.
function acharIndice(
  cabecalho: string[],
  predicado: (coluna: string) => boolean
): number {
  return cabecalho.findIndex((coluna) => predicado(normalizar(coluna)))
}

export type Ej = {
  id: string
  nome: string
  faculdade: string
  curso: string
  cidade: string
  codigoIbge: string
  urlSite: string
  urlLogo: string
  urlWhatsapp: string
  urlInstagram: string
  urlFacebook: string
  urlLinkedin: string
  urlYoutube: string
  ativa: boolean
}

export async function getEjsNucleoBauru(): Promise<Ej[]> {
  const url = process.env.EJS_SHEET_CSV_URL
  if (!url) return []

  let texto: string
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return []
    texto = await res.text()
  } catch {
    // Planilha fora do ar ou timeout: lista vazia — o fallback já existe no NossaRedeStats.
    return []
  }

  const [cabecalho, ...linhas] = parseCsv(texto)
  if (!cabecalho) return []

  const indices = {
    id: acharIndice(cabecalho, (c) => c === 'id'),
    nome: acharIndice(cabecalho, (c) => c === 'nome'),
    faculdade: acharIndice(cabecalho, (c) => c === 'faculdade'),
    curso: acharIndice(cabecalho, (c) => c === 'curso'),
    cidade: acharIndice(cabecalho, (c) => c === 'cidade'),
    codigoIbge: acharIndice(cabecalho, (c) => c.includes('ibge')),
    urlSite: acharIndice(cabecalho, (c) => c.includes('site')),
    urlLogo: acharIndice(cabecalho, (c) => c.includes('logo')),
    urlWhatsapp: acharIndice(
      cabecalho,
      (c) => c.includes('wpp') || c.includes('whatsapp')
    ),
    urlInstagram: acharIndice(cabecalho, (c) => c.includes('instagram')),
    urlFacebook: acharIndice(cabecalho, (c) => c.includes('facebook')),
    urlLinkedin: acharIndice(cabecalho, (c) => c.includes('linked')),
    urlYoutube: acharIndice(cabecalho, (c) => c.includes('youtube')),
    ativa: acharIndice(cabecalho, (c) => c === 'ativa'),
  }

  return linhas.map((linha) => ({
    id: linha[indices.id] ?? '',
    nome: linha[indices.nome] ?? '',
    faculdade: linha[indices.faculdade] ?? '',
    curso: linha[indices.curso] ?? '',
    cidade: linha[indices.cidade] ?? '',
    codigoIbge: (linha[indices.codigoIbge] ?? '').trim(),
    urlSite: linha[indices.urlSite] ?? '',
    urlLogo: linha[indices.urlLogo] ?? '',
    urlWhatsapp: linha[indices.urlWhatsapp] ?? '',
    urlInstagram: linha[indices.urlInstagram] ?? '',
    urlFacebook: linha[indices.urlFacebook] ?? '',
    urlLinkedin: linha[indices.urlLinkedin] ?? '',
    urlYoutube: linha[indices.urlYoutube] ?? '',
    ativa: normalizar(linha[indices.ativa] ?? '') === 'sim',
  }))
}
