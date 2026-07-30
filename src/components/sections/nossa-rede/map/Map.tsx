'use client'

import { useCallback, useEffect, useRef } from 'react'
import { MapContainer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function FitBounds({ dados }: { dados: GeoJSON.FeatureCollection }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.geoJSON(dados).getBounds()
    const ajustar = () => map.fitBounds(bounds)

    ajustar()
    window.addEventListener('resize', ajustar)
    return () => window.removeEventListener('resize', ajustar)
  }, [map, dados])

  return null
}

export default function Map({
  dados,
  cidadesDestacadas = new Set(),
  onMunicipioClick,
}: {
  dados: GeoJSON.FeatureCollection
  cidadesDestacadas?: Set<string>
  onMunicipioClick?: (nomeMunicipio: string) => void
}) {
  const destacadasRef = useRef(cidadesDestacadas)
  useEffect(() => {
    destacadasRef.current = cidadesDestacadas
  }, [cidadesDestacadas])

  const corBase = (nome: string) =>
    destacadasRef.current.has(nome) ? 'var(--color-blue)' : 'var(--color-orange)'

  const estiloMunicipio = useCallback(
    (feature?: GeoJSON.Feature) => {
      const temEj = Boolean(feature?.properties?.tem_ej)
      const destacada = cidadesDestacadas.has(feature?.properties?.nome)

      return {
        fillColor: temEj
          ? destacada
            ? 'var(--color-blue)'
            : 'var(--color-orange)'
          : '#f5e6cf',
        color: '#8a7a5c',
        weight: 0.8,
        fillOpacity: 1,
        interactive: temEj,
        // só a transição fica na className (estática). O hover é feito via setStyle nos
        // eventos, porque o Leaflet não atualiza className depois de criar o path
        className: temEj ? 'cursor-pointer transition-colors duration-200' : undefined,
      }
    },
    [cidadesDestacadas]
  )

  const aoCarregarFeature = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      if (!feature.properties?.tem_ej) return
      const nome = feature.properties?.nome
      const path = layer as L.Path

      layer.bindTooltip(nome, { sticky: true, direction: 'top' })
      layer.on('click', () => onMunicipioClick?.(nome))
      layer.on('mouseover', () => {
        const cor = destacadasRef.current.has(nome)
          ? 'var(--color-blue-light)'
          : 'var(--color-blue)'
        path.setStyle({ fillColor: cor })
      })
      layer.on('mouseout', () => path.setStyle({ fillColor: corBase(nome) }))
    },
    [onMunicipioClick]
  )

  return (
    <MapContainer
      style={{ width: '100%', height: '100%', background: '#fff' }}
      zoomSnap={0}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <GeoJSON data={dados} style={estiloMunicipio} onEachFeature={aoCarregarFeature} />
      <FitBounds dados={dados} />
    </MapContainer>
  )
}
