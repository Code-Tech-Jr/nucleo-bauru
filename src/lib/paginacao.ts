export const NOTICIAS_POR_PAGINA = 12 // grade de 4 x 3

// A primeira página é a própria listagem, sem sufixo na URL.
export function hrefDaPagina(numero: number): string {
  return numero <= 1 ? '/noticias-e-eventos' : `/noticias-e-eventos/pagina/${numero}`
}

export function totalDePaginas(quantidade: number): number {
  return Math.max(1, Math.ceil(quantidade / NOTICIAS_POR_PAGINA))
}

export function fatiarPagina<T>(itens: T[], pagina: number): T[] {
  const inicio = (pagina - 1) * NOTICIAS_POR_PAGINA
  return itens.slice(inicio, inicio + NOTICIAS_POR_PAGINA)
}

// Números a exibir, com 'gap' onde houver salto: 8 páginas na primeira
// devolve [1, 2, 3, 'gap', 8] = "1 2 3 … 8".
export function paginasVisiveis(atual: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const numeros = new Set([1, total, atual - 1, atual, atual + 1])
  // nas pontas a janela cresce para o lado que tem espaço, senão a barra
  // muda de largura conforme se navega
  if (atual <= 3) [2, 3].forEach((n) => numeros.add(n))
  if (atual >= total - 2) [total - 1, total - 2].forEach((n) => numeros.add(n))

  const ordenados = [...numeros].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  return ordenados.flatMap((numero, indice) =>
    indice > 0 && numero - ordenados[indice - 1] > 1
      ? (['gap', numero] as (number | 'gap')[])
      : [numero]
  )
}
