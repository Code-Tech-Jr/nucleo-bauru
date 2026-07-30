'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  contarSelecionados,
  type Categoria,
  type Selecao,
  type Sugestao,
} from '@/lib/filtrarEjs'
import { cn } from '@/lib/utils'

const CATEGORIAS: Categoria[] = ['nome', 'cidade', 'faculdade', 'curso']

const ROTULO_CATEGORIA: Record<Categoria, string> = {
  nome: 'Nome',
  cidade: 'Cidade',
  faculdade: 'Faculdade',
  curso: 'Curso',
}

export default function FiltroEjs({
  busca,
  onBuscaChange,
  selecao,
  sugestoes,
  onToggle,
  onLimpar,
}: {
  busca: string
  onBuscaChange: (valor: string) => void
  selecao: Selecao
  sugestoes: Sugestao[]
  onToggle: (categoria: Categoria, valor: string) => void
  onLimpar: () => void
}) {
  const totalSelecionados = contarSelecionados(selecao)

  const containerRef = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)
  const [ativo, setAtivo] = useState(0)

  const ativoIdx =
    sugestoes.length > 0
      ? ((ativo % sugestoes.length) + sugestoes.length) % sugestoes.length
      : 0

  // clicar fora fecha as recomendações
  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisivel(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  // dropdown abre com qualquer busca; se não casar nada, mostra "Nenhum resultado" em vez de sumir
  const temBusca = visivel && busca.trim() !== ''
  const mostrarSugestoes = temBusca && sugestoes.length > 0

  // rola a lista pra manter o item destacado sempre visível ao navegar com as setas
  useEffect(() => {
    if (!mostrarSugestoes) return
    document.getElementById(`sugestao-${ativoIdx}`)?.scrollIntoView({ block: 'nearest' })
  }, [ativoIdx, mostrarSugestoes])

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    if (!mostrarSugestoes) {
      if (e.key === 'ArrowDown') setVisivel(true)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAtivo((i) => (i + 1) % sugestoes.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAtivo((i) => (i - 1 + sugestoes.length) % sugestoes.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const s = sugestoes[ativoIdx]
      if (s) onToggle(s.categoria, s.valor)
    } else if (e.key === 'Escape') {
      setVisivel(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={busca}
          onChange={(e) => {
            onBuscaChange(e.target.value)
            setVisivel(true)
          }}
          onFocus={() => setVisivel(true)}
          onKeyDown={aoTeclar}
          placeholder="Busque por nome, cidade, faculdade ou curso"
          aria-label="Buscar Empresas Juniores por nome, cidade, faculdade ou curso"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={mostrarSugestoes}
          aria-controls="sugestoes-ejs"
          aria-activedescendant={mostrarSugestoes ? `sugestao-${ativoIdx}` : undefined}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded border border-blue/20 px-3 py-2 text-sm"
        />

        {temBusca && !mostrarSugestoes && (
          <div className="absolute z-10 mt-1 w-full rounded border border-blue/20 bg-white px-3 py-2 text-sm text-blue/60 shadow-md">
            Nenhum resultado encontrado.
          </div>
        )}

        {mostrarSugestoes && (
          <ul
            id="sugestoes-ejs"
            role="listbox"
            className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded border border-blue/20 bg-white shadow-md"
          >
            {sugestoes.map((sugestao, i) => (
              <li
                key={`${sugestao.categoria}-${sugestao.valor}`}
                id={`sugestao-${i}`}
                role="option"
                aria-selected={i === ativoIdx}
                onMouseEnter={() => setAtivo(i)}
              >
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                    i === ativoIdx && 'bg-blue/5'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => onToggle(sugestao.categoria, sugestao.valor)}
                  />
                  <span className="text-xs text-blue/60">
                    {ROTULO_CATEGORIA[sugestao.categoria]}:
                  </span>
                  {sugestao.valor}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalSelecionados > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIAS.flatMap((categoria) =>
            [...selecao[categoria]].map((valor) => (
              <button
                key={`${categoria}-${valor}`}
                type="button"
                onClick={() => onToggle(categoria, valor)}
                aria-label={`Remover filtro ${ROTULO_CATEGORIA[categoria]}: ${valor}`}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-blue/10 px-3 py-1 text-xs text-blue transition-all duration-200 hover:bg-blue/20"
              >
                {ROTULO_CATEGORIA[categoria]}: {valor}
                <span aria-hidden>×</span>
              </button>
            ))
          )}

          <button
            type="button"
            onClick={onLimpar}
            className="cursor-pointer text-xs font-semibold text-orange underline transition-all duration-200 hover:text-blue"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
