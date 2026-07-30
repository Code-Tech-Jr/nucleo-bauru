import municipiosNucleoBauru from '../../data/municipios-nucleo-bauru.json'
import type { Ej } from './getEjsNucleoBauru'

type GeoJsonFeatureCollection = {
  type: 'FeatureCollection'
  features: GeoJSON.Feature[]
}

export async function getMalhaNucleoBauru(
  ejsPromise: Promise<Ej[]>
): Promise<GeoJsonFeatureCollection> {
  const [malhaRes, ejs] = await Promise.all([
    fetch(
      'https://servicodados.ibge.gov.br/api/v3/malhas/estados/35?intrarregiao=municipio&formato=application/vnd.geo+json&qualidade=minima',
      { next: { revalidate: 86400 } }
    ),
    ejsPromise,
  ])
  const malha: GeoJsonFeatureCollection = await malhaRes.json()

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
