import { normalizar, type Ej } from './getEjsNucleoBauru'

export type Categoria = 'nome' | 'cidade' | 'faculdade' | 'curso'

export type Selecao = Record<Categoria, Set<string>>

export type Sugestao = { categoria: Categoria; valor: string }

const CATEGORIAS: Categoria[] = ['nome', 'cidade', 'faculdade', 'curso']

export function criarSelecaoVazia(): Selecao {
  return { nome: new Set(), cidade: new Set(), faculdade: new Set(), curso: new Set() }
}

export function contarSelecionados(selecao: Selecao): number {
  return CATEGORIAS.reduce((total, categoria) => total + selecao[categoria].size, 0)
}

export function alternarSelecao(
  selecao: Selecao,
  categoria: Categoria,
  valor: string
): Selecao {
  const novoSet = new Set(selecao[categoria])
  if (novoSet.has(valor)) novoSet.delete(valor)
  else novoSet.add(valor)
  return { ...selecao, [categoria]: novoSet }
}

export function splitCursos(curso: string): string[] {
  return curso
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}

export function extrairOpcoesEjs(ejs: Ej[]): Record<Categoria, string[]> {
  const nome = new Set<string>()
  const cidade = new Set<string>()
  const faculdade = new Set<string>()
  const curso = new Set<string>()

  for (const ej of ejs) {
    if (ej.nome) nome.add(ej.nome)
    if (ej.cidade) cidade.add(ej.cidade)
    if (ej.faculdade) faculdade.add(ej.faculdade)
    splitCursos(ej.curso).forEach((c) => curso.add(c))
  }

  return {
    nome: [...nome].sort(),
    cidade: [...cidade].sort(),
    faculdade: [...faculdade].sort(),
    curso: [...curso].sort(),
  }
}

export function buscarSugestoes(
  opcoes: Record<Categoria, string[]>,
  selecao: Selecao,
  busca: string
): Sugestao[] {
  const buscaNormalizada = normalizar(busca)
  if (!buscaNormalizada) return []

  return CATEGORIAS.flatMap((categoria) => {
    // digitar o nome da categoria (prefixo com >=3 letras: "cid", "cur", "fac", "nom")
    // lista todas as opções dela, não só as que casam com o texto.
    const casaCategoria =
      buscaNormalizada.length >= 3 && normalizar(categoria).startsWith(buscaNormalizada)

    return opcoes[categoria]
      .filter((valor) => !selecao[categoria].has(valor))
      .filter((valor) => casaCategoria || normalizar(valor).includes(buscaNormalizada))
      .map((valor) => ({ categoria, valor }))
  })
}

export function filtrarEjs(ejs: Ej[], selecao: Selecao): Ej[] {
  return ejs.filter((ej) => {
    if (selecao.nome.size > 0 && !selecao.nome.has(ej.nome)) return false
    if (selecao.cidade.size > 0 && !selecao.cidade.has(ej.cidade)) return false
    if (selecao.faculdade.size > 0 && !selecao.faculdade.has(ej.faculdade)) return false

    if (selecao.curso.size > 0) {
      const cursosDaEj = splitCursos(ej.curso)
      if (!cursosDaEj.some((curso) => selecao.curso.has(curso))) return false
    }

    return true
  })
}
