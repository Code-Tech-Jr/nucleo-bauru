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

export function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function acharIndice(
  cabecalho: string[],
  predicado: (coluna: string) => boolean
): number {
  return cabecalho.findIndex((coluna) => predicado(normalizar(coluna)))
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
