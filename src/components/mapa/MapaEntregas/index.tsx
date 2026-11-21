import {
    Camera,
    Map,
    Marker,
    type CameraRef,
} from "@maplibre/maplibre-react-native";

import { memo, useMemo, useRef } from "react";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

export type PontoMapaEntrega = {
  id: number;
  empresa: string;
  latitude: number;
  longitude: number;
  status: string;
};

interface MapaEntregasProps {
  pontos: PontoMapaEntrega[];
}

function MapaEntregasComponent({ pontos }: MapaEntregasProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const cameraRef = useRef<CameraRef>(null);

  const centro = useMemo<[number, number]>(() => {
    if (pontos.length === 0) {
      return [-47.8822, -15.7942];
    }

    const longitude =
      pontos.reduce((soma, ponto) => soma + ponto.longitude, 0) / pontos.length;

    const latitude =
      pontos.reduce((soma, ponto) => soma + ponto.latitude, 0) / pontos.length;

    return [longitude, latitude];
  }, [pontos]);

  return (
    <View style={styles.container}>
      <Map style={styles.mapa} mapStyle={MAP_STYLE}>
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centro,
            zoom: 12,
          }}
        />

        {pontos.map((ponto) => (
          <Marker
            key={ponto.id}
            id={`entrega-${ponto.id}`}
            lngLat={[ponto.longitude, ponto.latitude]}
          >
            <View style={styles.marcador}>
              <View style={styles.marcadorNumero}>
                <Text style={styles.numero}>{ponto.id}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </Map>
    </View>
  );
}

export const MapaEntregas = memo(MapaEntregasComponent);
