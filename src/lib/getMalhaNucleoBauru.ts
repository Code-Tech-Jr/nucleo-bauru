import malhaNucleoBauru from '../../data/malha-nucleo-bauru.json'
import municipiosNucleoBauru from '../../data/municipios-nucleo-bauru.json'
import type { Ej } from './getEjsNucleoBauru'

// A malha vem de data/malha-nucleo-bauru.json em vez da API do IBGE: buscá-la em tempo
// de build derrubava o CI com ConnectTimeout (os runners do GitHub não alcançam o
// servicodados.ibge.gov.br de forma confiável). O recorte muda só quando o IBGE revisa a
// divisão territorial. Para regerar, ver data/README.md.
type GeoJsonFeatureCollection = {
  type: 'FeatureCollection'
  features: GeoJSON.Feature[]
}

export async function getMalhaNucleoBauru(
  ejsPromise: Promise<Ej[]>
): Promise<GeoJsonFeatureCollection> {
  const ejs = await ejsPromise
  const malha = malhaNucleoBauru as unknown as GeoJsonFeatureCollection

  const municipiosPorCodigo = new Map(
    municipiosNucleoBauru.map((m) => [m.codigo_ibge, m])
  )
  const codigosComEjAtiva = new Set(
    ejs.filter((ej) => ej.ativa).map((ej) => ej.codigoIbge)
  )

  const features = malha.features
    .filter((feature) => municipiosPorCodigo.has(String(feature.properties?.codarea)))
    .map((feature) => {
      const municipio = municipiosPorCodigo.get(String(feature.properties?.codarea))!
      return {
        ...feature,
        properties: {
          ...feature.properties,
          nome: municipio.nome,
          tem_ej: codigosComEjAtiva.has(municipio.codigo_ibge),
        },
      }
    })

  return { type: 'FeatureCollection', features }
}
