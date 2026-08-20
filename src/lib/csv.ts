// Compartilhado entre as planilhas de EJs e de notícias: o tratamento de borda
// (quebra de linha dentro de aspas, CRLF, aspas escapadas) é sutil demais para
// viver em duas cópias.

export function parseCsv(texto: string): string[][] {
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

// Ignora acento, caixa, `_`, espaço e `?`; o resto tem que bater exato.
// `imagem_capa` e `imagem_capa_alt` são colunas diferentes: um `includes('capa')`
// casaria as duas.
export function chaveDeColuna(texto: string): string {
  return normalizar(texto).replace(/[^a-z0-9]/g, '')
}

export function acharColuna(cabecalho: string[], nome: string): number {
  return cabecalho.findIndex((coluna) => chaveDeColuna(coluna) === chaveDeColuna(nome))
}
