# data/

## `municipios-nucleo-bauru.json`

Lista dos 237 municípios da área de atuação do Núcleo Bauru, com `codigo_ibge` e `nome`.
Mantido à mão.

## `malha-nucleo-bauru.json`

Recorte da malha municipal do IBGE (São Paulo, qualidade mínima) contendo apenas os
municípios de `municipios-nucleo-bauru.json`. É consumido por `src/lib/getMalhaNucleoBauru.ts`.

Ficou estático de propósito: buscar a malha da API do IBGE em tempo de build derrubava o
CI com `ConnectTimeout` — os runners do GitHub Actions não alcançam o
`servicodados.ibge.gov.br` de forma confiável. A malha só muda quando o IBGE revisa a
divisão territorial, então não há ganho em buscá-la a cada build.

Para regerar (depois de atualizar a lista de municípios, ou quando sair uma nova malha):

```bash
curl -s 'https://servicodados.ibge.gov.br/api/v3/malhas/estados/35?intrarregiao=municipio&formato=application/vnd.geo+json&qualidade=minima' -o /tmp/malha-sp.json

node -e "
const malha = require('/tmp/malha-sp.json')
const municipios = require('./data/municipios-nucleo-bauru.json')
const codigos = new Set(municipios.map((m) => String(m.codigo_ibge)))
const features = malha.features.filter((f) => codigos.has(String(f.properties?.codarea)))
if (features.length !== codigos.size) throw new Error('municípios sem geometria: ' + (codigos.size - features.length))
require('fs').writeFileSync('./data/malha-nucleo-bauru.json', JSON.stringify({ type: 'FeatureCollection', features }) + '\n')
console.log('features:', features.length)
"
```
