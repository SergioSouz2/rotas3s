import {
  Camera,
  Map,
  Marker,
  type CameraRef,
  type MapRef,
} from "@maplibre/maplibre-react-native";

import { memo, useEffect, useRef } from "react";
import { View } from "react-native";

import type { Coordenadas } from "@/services/localizacaoService";

import { styles } from "./styles";

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

interface MapaLocalizacaoProps {
  coordenadas: Coordenadas;
  modoEdicao?: boolean;
  onAlterarPosicao?: (coordenadas: Coordenadas) => void;
}

function MapaLocalizacaoComponent({
  coordenadas,
  modoEdicao = false,
  onAlterarPosicao,
}: MapaLocalizacaoProps) {
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapRef>(null);

  const centro: [number, number] = [
    coordenadas.longitude,
    coordenadas.latitude,
  ];

  useEffect(() => {
    cameraRef.current?.easeTo({
      center: [coordenadas.longitude, coordenadas.latitude],
      zoom: 16,
      duration: 500,
    });
  }, [coordenadas.latitude, coordenadas.longitude]);

  async function atualizarCentroMapa() {
    if (!modoEdicao || !mapRef.current) {
      return;
    }

    try {
      const [longitude, latitude] = await mapRef.current.getCenter();

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      onAlterarPosicao?.({
        latitude,
        longitude,
      });
    } catch (erro) {
      console.warn("[MAPA] Erro ao obter centro:", erro);
    }
  }

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        style={styles.mapa}
        mapStyle={MAP_STYLE}
        onRegionDidChange={atualizarCentroMapa}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centro,
            zoom: 16,
          }}
        />

        {!modoEdicao && (
          <Marker id="ponto-entrega" lngLat={centro}>
            <View style={styles.marcador}>
              <View style={styles.marcadorCentro} />
            </View>
          </Marker>
        )}
      </Map>

      {modoEdicao && (
        <View pointerEvents="none" style={styles.marcadorCentralizado}>
          <View style={styles.marcador}>
            <View style={styles.marcadorCentro} />
          </View>
        </View>
      )}
    </View>
  );
}

export const MapaLocalizacao = memo(MapaLocalizacaoComponent);
