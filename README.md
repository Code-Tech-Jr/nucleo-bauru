# Núcleo Bauru

Site institucional do **Núcleo Bauru**, núcleo regional do Movimento Empresa Júnior (MEJ) no Oeste Paulista.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (config via `@theme` em `globals.css`, sem `tailwind.config.js`)
- [class-variance-authority](https://cva.style) para variantes de componentes
- [Leaflet](https://leafletjs.com) / react-leaflet para o mapa interativo das EJs
- [react-icons](https://react-icons.github.io/react-icons) para ícones (redes sociais, contato, localização) — importados como componentes, ex.: `import { FaInstagram } from 'react-icons/fa6'`
- ESLint + Prettier (com `prettier-plugin-tailwindcss`) + Husky/lint-staged

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie o `.env.example` pra `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável                 | O que é                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `EJS_SHEET_CSV_URL`      | URL de export CSV da aba **EJs** publicada na web (na planilha: Arquivo → Compartilhar → Publicar na web → CSV)             |
| `NOTICIAS_SHEET_CSV_URL` | Mesma coisa, mas da aba **Noticias e Eventos** — alimenta a seção "Eventos e Notícias" da Home e as páginas de cada notícia |

Ela é lida **só no servidor** (`src/lib/getEjsNucleoBauru.ts`, usado pelo Server Component `src/app/nossa-rede/page.tsx`). Por isso **não** tem o prefixo `NEXT_PUBLIC_`: sem ele, o Next garante que a URL nunca vá parar no bundle do cliente. Se um dia precisar dela num Client Component, passe o dado já pronto por prop em vez de expor a URL.

Sem essa variável (ou com a planilha fora do ar) o `getEjsNucleoBauru` devolve lista vazia: o mapa fica sem nenhuma cidade laranja, a busca não acha EJ nenhuma e os números da seção "Nossa Rede" caem no fallback fixo do `NossaRedeStats` (40 EJs / 12 cidades / 7 IES). Se você clonou o repo e vê esses números, é isso — não é bug. Peça a URL pra quem cuida da planilha.

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
data/                  # dados estáticos versionados no repo (ver seção "Mapa interativo" abaixo)
  municipios-nucleo-bauru.json  # allowlist dos municípios que formam a região do Núcleo
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

## Mapa interativo (seção "Nossa Rede")

O mapa (`src/components/sections/nossa-rede/map/Map.tsx`) desenha, em Leaflet, só os municípios que formam a região do Núcleo Bauru, coloridos conforme tenham ou não uma EJ ativa. Ele é montado só no client (`ssr: false`, via `dynamic` no `NossaRede.tsx`) porque o Leaflet depende de `window`.

### A pasta `data/`

`data/municipios-nucleo-bauru.json` é a **allowlist da região** — um array de `{ nome, codigo_ibge }` com os municípios que pertencem ao Núcleo (hoje 237). Ele existe porque a malha oficial do IBGE traz **São Paulo inteiro** (645 municípios); esse arquivo é o filtro que recorta só a nossa região e ainda define o **nome de exibição** de cada cidade (o `nome` daqui, não o da malha do IBGE).

Cada entrada tem só dois campos:

| Campo         | O que é                                                                |
| ------------- | ---------------------------------------------------------------------- |
| `nome`        | nome exibido no mapa (tooltip no hover) e usado pra cruzar com a busca |
| `codigo_ibge` | código IBGE de 7 dígitos do município — a chave que casa com a malha   |

### Como o mapa é montado (fluxo de dados)

1. **Server** (`src/lib/getMalhaNucleoBauru.ts`): busca a malha de SP na API do IBGE (`/malhas/estados/35`, cache de 1 dia) e, em paralelo, os EJs da planilha (`getEjsNucleoBauru`).
2. Filtra as features da malha, mantendo só as cujo `codarea` está no `municipios-nucleo-bauru.json`.
3. Em cada feature que sobra, injeta duas `properties`:
   - `nome` — vem do JSON;
   - `tem_ej` — `true` se existe uma **EJ ativa** naquela cidade (cruza `codigo_ibge` com o `codigoIbge` da planilha). **Não vem do JSON** — é sempre derivado da planilha.
4. **Client** (`Map.tsx`) pinta cada município:
   - **bege** (`#f5e6cf`) → sem EJ (`tem_ej: false`): não é clicável nem tem hover;
   - **laranja** (`--color-orange`) → tem EJ, não selecionada;
   - **azul** (`--color-blue`) → tem EJ e selecionada (via clique no mapa ou pela busca).

Clicar num município com EJ vira um filtro de cidade (o mesmo chip da barra de busca), mantendo mapa e busca sincronizados.

> A proporção do mapa (`aspectoDaMalha` em `NossaRede.tsx`) é calculada em Web Mercator **sem Leaflet**, direto das coordenadas do GeoJSON, pra rodar no SSR e reservar a altura correta antes do mapa montar (evita layout shift).

### O que fazer quando uma cidade entra ou sai da região

Mexer **só** no `data/municipios-nucleo-bauru.json`:

- **Entrou** uma cidade na região → adicione `{ "nome": "...", "codigo_ibge": "..." }`. Pegue o código IBGE de 7 dígitos na [API de municípios do IBGE](https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios) (ou no site do IBGE). Confira que o `nome` está com acentuação correta — é ele que aparece no mapa e casa com a busca.
- **Saiu** uma cidade → remova a entrada dela do JSON.

Não precisa tocar em `Map.tsx` nem em `getMalhaNucleoBauru.ts`: o filtro é dirigido pelo JSON. E **não** edite o `tem_ej` — ele é recalculado sozinho a partir da planilha de EJs; pra uma cidade acender de laranja pra clicável basta ter uma EJ ativa cadastrada nela.

## Notícias e eventos

A seção "Eventos e Notícias" da Home (`src/components/sections/noticias/`) mostra as **3 notícias mais recentes** da aba `Noticias e Eventos` da planilha; `/noticias-e-eventos` lista todas, e cada card leva pra `/noticias-e-eventos/<id>` — a rota dinâmica em `src/app/noticias-e-eventos/[id]/page.tsx`, que é o **molde único** de todas as notícias: o conteúdo muda, o layout não.

O fluxo é o mesmo dos EJs: `src/lib/getNoticias.ts` baixa o CSV (`NOTICIAS_SHEET_CSV_URL`, cache de 5 min) e devolve a lista já filtrada e ordenada por data decrescente.

Uma linha da planilha **só aparece no site** se tiver `publicada = SIM` e todos estes campos preenchidos:

| Campo                 | Obrigatório | Observação                                                                              |
| --------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `id`                  | sim         | **só minúsculas, números e hífen** — vira a URL da notícia. Acento ou espaço a descarta |
| `titulo`              | sim         | —                                                                                       |
| `data`                | sim         | `AAAA-MM-DD`, e a data precisa existir de verdade (`2026-02-30` é descartada)           |
| `imagem_capa`         | sim         | horizontal, link do Cloudinary da nossa conta                                           |
| `conteudo`            | sim         | texto completo; `##` no começo da linha vira subtítulo de seção                         |
| `descricao`           | não         | resumo do card e do topo da página                                                      |
| `imagem_capa_alt`     | não         | descrição da foto para quem usa leitor de tela                                          |
| `imagem_conteudo`     | não         | horizontal, entra na galeria ao final da matéria (à esquerda)                           |
| `imagem_conteudo_alt` | não         | idem                                                                                    |
| `imagem_destaque`     | não         | vertical, entra na galeria ao final da matéria (à direita)                              |
| `imagem_destaque_alt` | não         | idem                                                                                    |

As colunas `_alt` ficam **ao lado da coluna da foto correspondente**. Descreva o que aparece
na imagem, não repita o título — é o que a pessoa cega vai ouvir no lugar da foto. Vazio =
a imagem é tratada como decorativa.

No `conteudo`, **linhas seguidas formam um parágrafo só**; para começar um parágrafo novo,
deixe uma linha em branco. Quebrar linha só para caber na célula não cria parágrafo.

Os nomes das colunas são comparados ignorando acento, maiúscula, `_` e espaço — mas o resto
precisa bater exatamente. Coluna obrigatória faltando gera aviso no log do build.

Linha incompleta é ignorada **em silêncio** (sem erro, sem card quebrado). Se a notícia não aparecer no site, é quase sempre um desses campos vazio ou a data fora do formato.

Sem `NOTICIAS_SHEET_CSV_URL` (ou com a planilha fora do ar) a lista vem vazia e a seção da Home simplesmente não renderiza — a página não quebra.

> As imagens precisam estar na **nossa conta** do Cloudinary (`res.cloudinary.com/bu6xbdjg/image/upload/...`) — é o único caminho liberado pro `next/image` no `next.config.ts`, e o mesmo valor está em `CLOUDINARY_BASE` (`src/lib/site.ts`). Link de outro domínio (ou de outra conta) **não dá erro de build**: a linha é descartada em silêncio, como qualquer campo inválido.

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
