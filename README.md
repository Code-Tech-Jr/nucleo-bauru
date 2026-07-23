# Núcleo Bauru

Site institucional do **Núcleo Bauru**, núcleo regional do Movimento Empresa Júnior (MEJ) no Oeste Paulista.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (config via `@theme` em `globals.css`, sem `tailwind.config.js`)
- [class-variance-authority](https://cva.style) para variantes de componentes
- [Leaflet](https://leafletjs.com) / react-leaflet para o mapa interativo das EJs
- ESLint + Prettier (com `prettier-plugin-tailwindcss`) + Husky/lint-staged

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando                | O que faz                                    |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | sobe o servidor de desenvolvimento           |
| `npm run build`        | build de produção                            |
| `npm run start`        | roda o build de produção                     |
| `npm run lint`         | roda o ESLint                                |
| `npm run format`       | formata o projeto inteiro com Prettier       |
| `npm run format:check` | só verifica formatação, sem alterar arquivos |

Todo `git commit` já roda lint + format automaticamente nos arquivos alterados (Husky + lint-staged), então não precisa rodar isso manualmente antes de commitar. O GitHub Actions (`.github/workflows/ci.yml`) roda os mesmos checks (`lint`, `format:check`, `build`) em todo push/PR — ver seção [CI](#ci) mais abaixo.

## Estrutura de pastas

```text
info/                  # mockups de design originais (PDF/SVG) — fonte de verdade de cores/tipografia/layout
public/                # assets estáticos servidos direto (imagens, ícones)
src/
  app/                 # rotas (Next.js App Router) — cada pasta = uma rota, page.tsx = a tela
    layout.tsx         # layout raiz: fontes (next/font), <html>/<body>
    globals.css        # design tokens do Tailwind v4 (@theme: cores, tipografia)
  components/
    ui/                # componentes primitivos e reutilizáveis, sem regra de negócio
                        # (Button, Container, Content, Heading, Text — ver seção abaixo)
    layout/            # Header, Footer, Navbar — aparecem em todas as páginas (vazia, a fazer)
    sections/          # blocos de seção específicos de cada página, ex.: Hero, Quem Somos, Nossa Rede (vazia, a fazer)
    forms/             # formulários, ex.: Fale Conosco (vazia, a fazer)
    common/            # pequenos utilitários compartilhados que não são nem ui/ nem layout/ (vazia, a fazer)
  hooks/               # hooks React reutilizáveis, ex.: breakpoint, scroll (vazia, a fazer)
  lib/
    utils.ts           # cn() — helper pra mesclar classes Tailwind sem conflito (clsx + tailwind-merge)
    types.ts           # PolymorphicProps — tipo compartilhado pelos componentes que trocam de tag via `as`
```

Pastas vazias têm um `.gitkeep` só pra existirem no git — pode apagar o `.gitkeep` assim que colocar o primeiro arquivo real ali dentro.

## Design tokens (`src/app/globals.css`)

Cores e tipografia extraídas do design oficial (`info/`), definidas uma vez em `@theme` e disponíveis como utility class do Tailwind automaticamente (sem precisar configurar nada):

| Token                | Valor                    | Vira a utility                                                                                        |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `--color-blue`       | `#1f3160`                | `bg-blue`, `text-blue`, `border-blue`...                                                              |
| `--color-blue-light` | `#285dbc`                | `bg-blue-light`, `text-blue-light`...                                                                 |
| `--color-orange`     | `#ed551a`                | `bg-orange`, `text-orange`, `border-orange`...                                                        |
| `--text-btn`         | `clamp(16px, ..., 18px)` | `text-btn` — tamanho fluido usado nos botões                                                          |
| `--text-body`        | `18px`                   | `text-body` — tamanho do texto de corpo (`Text`)                                                      |
| `--gradient-brand`   | `linear-gradient(...)`   | mesmo gradiente de `public/degrade.svg` — sem utility própria, usa `bg-[image:var(--gradient-brand)]` |

Regra: **nunca usar hex direto no `className`** (`bg-[#1f3160]`) — sempre usar o token (`bg-blue`). Se precisar de um token novo (cor, tamanho de fonte etc.), adiciona no `@theme` do `globals.css` uma vez, não espalha valor mágico pelos componentes.

## Componentes de `components/ui/`

Todos seguem o mesmo padrão: `cva` pra variantes (quando tem mais de uma) + `cn()` (de `lib/utils.ts`) pra permitir sobrescrever/estender classes via prop `className`.

### `Container` + `Content` — layout de seção

Toda seção do site (do header ao footer) usa os dois juntos, pra garantir que a margem lateral seja **sempre a mesma** em qualquer lugar — ninguém escolhe uma largura diferente por conta própria:

- **`Container`** — wrapper full-width, só centraliza o conteúdo. É onde a seção pinta fundo/cor/altura. Troca de tag via `as` (`as="section"`, `"header"`, `"footer"`...), por padrão é `div`.
- **`Content`** — trava a largura real do conteúdo (`w-11/12`). Todo texto/elemento visível de uma seção fica dentro dele.

```tsx
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'

export default function MinhaSecao() {
  return (
    <Container as="section" className="bg-blue py-20">
      <Content className="flex-col gap-8">{/* conteúdo da seção aqui */}</Content>
    </Container>
  )
}
```

Se precisar mudar a margem lateral do site inteiro, muda o `w-11/12` dentro de `Content.tsx` uma vez só — todas as seções atualizam junto.

### `Heading` — títulos

4 variantes, cada uma já com a tag HTML semântica certa por padrão (mas trocável via `as`):

| Variant   | Estilo                       | Tag padrão |
| --------- | ---------------------------- | ---------- |
| `hero`    | branco, bold, fluido 4xl→6xl | `h1`       |
| `section` | laranja, bold, uppercase     | `h2`       |
| `content` | azul, semibold (default)     | `h3`       |
| `news`    | azul claro, light, uppercase | `h3`       |

```tsx
<Heading variant="hero">Somos o time que transforma impacto em legado</Heading>
<Heading variant="section">Nossa Rede</Heading>
```

### `Text` — texto de corpo

2 variantes, só de cor (tamanho/peso são fixos: `text-body` = 18px, semibold):

```tsx
<Text variant="light">Parágrafo em seção com fundo escuro</Text>
<Text variant="dark">Parágrafo em seção com fundo claro (padrão)</Text>
```

### `Button`

Ver comentários no topo de `Button.tsx` — variantes `header`/`footer` (nav) e `outline`/`light`/`solid` (pill), prop `showArrow` pra seta (herda a cor do texto via `currentColor`) e `active` pra marcar o item de menu da página atual.

## CI

`.github/workflows/ci.yml` roda em todo push (`main`/`develop`) e pull request: `npm ci` → `npm run lint` → `npm run format:check` → `npm run build`. Se qualquer passo falhar, o Action fica vermelho no GitHub — dá pra exigir isso passando antes de dar merge em Settings → Branches → branch protection rule.
