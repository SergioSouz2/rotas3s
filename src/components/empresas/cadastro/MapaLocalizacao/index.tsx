import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";

import { memo, useEffect, useRef } from "react";
import { View } from "react-native";

import type { Coordenadas } from "@/services/localizacaoService";
import type { CameraRef } from "@maplibre/maplibre-react-native";

import { styles } from "./styles";

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

console.log("[MAPTILER] Chave carregada:", MAPTILER_KEY ? "SIM" : "NÃO");

interface MapaLocalizacaoProps {
  coordenadas: Coordenadas;
}

function MapaLocalizacaoComponent({ coordenadas }: MapaLocalizacaoProps) {
  const cameraRef = useRef<CameraRef>(null);

  // MapLibre utiliza [longitude, latitude].
  const centro: [number, number] = [
    coordenadas.longitude,
    coordenadas.latitude,
  ];

  // Atualiza o centro quando as coordenadas mudarem.
  useEffect(() => {
    cameraRef.current?.easeTo({
      center: [coordenadas.longitude, coordenadas.latitude],
      zoom: 16,
      duration: 500,
    });
  }, [coordenadas.latitude, coordenadas.longitude]);

  return (
    <View style={styles.container}>
      <Map style={styles.mapa} mapStyle={MAP_STYLE}>
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centro,
            zoom: 16,
          }}
        />

        <Marker id="ponto-entrega" lngLat={centro}>
          <View style={styles.marcador}>
            <View style={styles.marcadorCentro} />
          </View>
        </Marker>
      </Map>
    </View>
  );
}

export const MapaLocalizacao = memo(MapaLocalizacaoComponent);
