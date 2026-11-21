import { Ionicons } from "@expo/vector-icons";

import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
  type CameraRef,
} from "@maplibre/maplibre-react-native";

import * as Location from "expo-location";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import {
  roteirizacaoService,
  type CoordenadasRota,
  type ResultadoRota,
} from "@/services/roteirizacaoService";

import { createStyles } from "./styles";

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

const MAP_STYLE = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
  : "https://demotiles.maplibre.org/style.json";

const TIMEOUT_ROTA_MS = 20000;
const DISTANCIA_RECALCULO_METROS = 150;
const INTERVALO_RECALCULO_MS = 60000;

export type PontoMapaEntrega = {
  id: number;
  empresa: string;
  cnpj?: string | null;
  latitude: number;
  longitude: number;
  status: string;
};

interface MapaEntregasProps {
  pontos: PontoMapaEntrega[];
}

type ConsultaRota = {
  id: number;
  chave: string;
  controlador: AbortController;
};

function calcularDistancia(a: CoordenadasRota, b: CoordenadasRota): number {
  const rad = Math.PI / 180;

  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;

  const valor =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * rad) *
      Math.cos(b.latitude * rad) *
      Math.sin(dLon / 2) ** 2;

  return (
    6371000 *
    2 *
    Math.atan2(Math.sqrt(valor), Math.sqrt(Math.max(0, 1 - valor)))
  );
}

function formatarDuracao(segundos: number): string {
  const minutos = Math.ceil(segundos / 60);

  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;

  return restante ? `${horas} h ${restante} min` : `${horas} h`;
}

function formatarCnpj(cnpj?: string | null): string {
  if (!cnpj) return "Não informado";

  const numeros = cnpj.replace(/\D/g, "");

  if (numeros.length !== 14) {
    return cnpj;
  }

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

function MapaEntregasComponent({ pontos }: MapaEntregasProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  const cameraRef = useRef<CameraRef>(null);
  const primeiraCentralizacao = useRef(false);

  const montadoRef = useRef(true);
  const contadorConsultaRef = useRef(0);

  const consultaRef = useRef<ConsultaRota | null>(null);

  const ultimaConsultaRef = useRef<{
    origem: CoordenadasRota;
    momento: number;
    chave: string;
  } | null>(null);

  const [minhaLocalizacao, setMinhaLocalizacao] =
    useState<CoordenadasRota | null>(null);

  const [carregandoGPS, setCarregandoGPS] = useState(true);

  const [carregandoRota, setCarregandoRota] = useState(false);

  const [rota, setRota] = useState<ResultadoRota | null>(null);

  const [erroRota, setErroRota] = useState<string | null>(null);

  const [mostrarParadas, setMostrarParadas] = useState(false);

  const [tentativaManual, setTentativaManual] = useState(0);

  const [pontoSelecionadoId, setPontoSelecionadoId] = useState<number | null>(
    null,
  );

  const pontoSelecionado = useMemo(
    () => pontos.find((ponto) => ponto.id === pontoSelecionadoId) ?? null,
    [pontos, pontoSelecionadoId],
  );

  const pendentes = useMemo(
    () =>
      pontos.filter(
        (ponto) => ponto.status === "pendente" || ponto.status === "em_rota",
      ),
    [pontos],
  );

  const chaveParadas = useMemo(
    () =>
      pendentes
        .map(
          (ponto) =>
            `${ponto.id}:${ponto.latitude}:${ponto.longitude}:${ponto.status}`,
        )
        .join("|"),
    [pendentes],
  );

  const centroInicial = useMemo<[number, number]>(() => {
    if (pontos.length === 0) {
      return [-47.8822, -15.7942];
    }

    return [
      pontos.reduce((soma, ponto) => soma + ponto.longitude, 0) / pontos.length,
      pontos.reduce((soma, ponto) => soma + ponto.latitude, 0) / pontos.length,
    ];
  }, [pontos]);

  const centralizarLocalizacao = useCallback(() => {
    if (!minhaLocalizacao) {
      Alert.alert(
        "Localização indisponível",
        "Aguardando sua localização pelo GPS.",
      );

      return;
    }

    cameraRef.current?.flyTo({
      center: [minhaLocalizacao.longitude, minhaLocalizacao.latitude],
      zoom: 15,
    });
  }, [minhaLocalizacao]);

  const tentarNovamente = useCallback(() => {
    ultimaConsultaRef.current = null;
    setErroRota(null);
    setTentativaManual((valor) => valor + 1);
  }, []);

  useEffect(() => {
    montadoRef.current = true;

    return () => {
      montadoRef.current = false;
      consultaRef.current?.controlador.abort();
      consultaRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      !minhaLocalizacao ||
      primeiraCentralizacao.current ||
      !cameraRef.current
    ) {
      return;
    }

    primeiraCentralizacao.current = true;

    cameraRef.current.flyTo({
      center: [minhaLocalizacao.longitude, minhaLocalizacao.latitude],
      zoom: 12,
    });
  }, [minhaLocalizacao]);

  // Acompanha a localização atual do motorista.
  useEffect(() => {
    let ativo = true;

    let assinatura: Location.LocationSubscription | null = null;

    async function iniciarGPS() {
      try {
        setCarregandoGPS(true);

        const permissao = await Location.requestForegroundPermissionsAsync();

        if (!ativo) return;

        if (permissao.status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Autorize a localização para calcular a rota.",
          );

          return;
        }

        const ultima = await Location.getLastKnownPositionAsync();

        if (ativo && ultima) {
          setMinhaLocalizacao({
            latitude: ultima.coords.latitude,
            longitude: ultima.coords.longitude,
          });
        }

        const novaAssinatura = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
            timeInterval: 3000,
          },
          (posicao) => {
            if (!ativo) return;

            setMinhaLocalizacao({
              latitude: posicao.coords.latitude,
              longitude: posicao.coords.longitude,
            });

            setCarregandoGPS(false);
          },
        );

        if (!ativo) {
          novaAssinatura.remove();
          return;
        }

        assinatura = novaAssinatura;
      } catch (error) {
        console.error("[MAPA] Erro ao iniciar GPS:", error);

        if (ativo) {
          Alert.alert(
            "Erro no GPS",
            "Não foi possível acompanhar sua localização.",
          );
        }
      } finally {
        if (ativo) {
          setCarregandoGPS(false);
        }
      }
    }

    void iniciarGPS();

    return () => {
      ativo = false;
      assinatura?.remove();
    };
  }, []);

  // Calcula a rota otimizada.
  useEffect(() => {
    if (pendentes.length === 0) {
      consultaRef.current?.controlador.abort();
      consultaRef.current = null;
      ultimaConsultaRef.current = null;

      setRota(null);
      setErroRota(null);
      setCarregandoRota(false);

      return;
    }

    if (!minhaLocalizacao) {
      return;
    }

    const consultaAtual = consultaRef.current;

    if (consultaAtual) {
      if (consultaAtual.chave === chaveParadas) {
        return;
      }

      consultaAtual.controlador.abort();
      consultaRef.current = null;
    }

    const anterior = ultimaConsultaRef.current;
    const agora = Date.now();

    const mudouParadas = anterior?.chave !== chaveParadas;

    const distancia = anterior
      ? calcularDistancia(anterior.origem, minhaLocalizacao)
      : Infinity;

    const intervalo = anterior ? agora - anterior.momento : Infinity;

    if (
      anterior &&
      !mudouParadas &&
      (distancia < DISTANCIA_RECALCULO_METROS ||
        intervalo < INTERVALO_RECALCULO_MS)
    ) {
      return;
    }

    const origem: CoordenadasRota = {
      latitude: minhaLocalizacao.latitude,
      longitude: minhaLocalizacao.longitude,
    };

    const paradasConsulta = [...pendentes];
    const controlador = new AbortController();
    const id = ++contadorConsultaRef.current;

    consultaRef.current = {
      id,
      chave: chaveParadas,
      controlador,
    };

    ultimaConsultaRef.current = {
      origem,
      momento: agora,
      chave: chaveParadas,
    };

    if (mudouParadas) {
      setRota(null);
    }

    setCarregandoRota(true);
    setErroRota(null);

    let tempoEsgotado = false;

    const timeout = setTimeout(() => {
      tempoEsgotado = true;
      controlador.abort();
    }, TIMEOUT_ROTA_MS);

    async function executarConsulta() {
      try {
        const resultado = await roteirizacaoService.otimizar(
          origem,
          paradasConsulta,
          controlador.signal,
        );

        const aindaAtual = montadoRef.current && consultaRef.current?.id === id;

        if (!aindaAtual || controlador.signal.aborted) {
          return;
        }

        setRota(resultado);
        setErroRota(null);
      } catch (error) {
        const aindaAtual = montadoRef.current && consultaRef.current?.id === id;

        if (!aindaAtual) return;

        console.error("[MAPA] Falha na otimização:", error);

        setErroRota(
          tempoEsgotado
            ? "O serviço de rotas demorou demais para responder."
            : "Não foi possível calcular o caminho pelas ruas.",
        );

        ultimaConsultaRef.current = null;
      } finally {
        clearTimeout(timeout);

        const aindaAtual = montadoRef.current && consultaRef.current?.id === id;

        if (aindaAtual) {
          consultaRef.current = null;
          setCarregandoRota(false);
        }
      }
    }

    void executarConsulta();
  }, [minhaLocalizacao, pendentes, chaveParadas, tentativaManual]);

  const geometriaRota = useMemo(() => {
    if (!rota || rota.coordenadas.length < 2) {
      return null;
    }

    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: rota.coordenadas,
      },
    };
  }, [rota]);

  const ordemParadas = useMemo(() => {
    const resultado = new globalThis.Map<number, number>();

    rota?.paradas.forEach((parada, index) => {
      resultado.set(parada.id, index + 1);
    });

    return resultado;
  }, [rota]);

  const marcadoresGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: pontos.map((ponto) => ({
        type: "Feature" as const,
        properties: {
          id: ponto.id,
          concluida: ponto.status === "realizada",
          rotulo:
            ponto.status === "realizada"
              ? "✓"
              : String(ordemParadas.get(ponto.id) ?? "•"),
        },
        geometry: {
          type: "Point" as const,
          coordinates: [ponto.longitude, ponto.latitude] as [number, number],
        },
      })),
    }),
    [pontos, ordemParadas],
  );

  return (
    <View style={styles.container}>
      <Map style={styles.mapa} mapStyle={MAP_STYLE}>
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centroInicial,
            zoom: 12,
          }}
        />

        {/* Linha da rota otimizada */}
        {geometriaRota && (
          <GeoJSONSource id="rota-otimizada-source" data={geometriaRota}>
            <Layer
              id="rota-contorno"
              type="line"
              paint={{
                "line-color": "#FFFFFF",
                "line-width": 9,
                "line-opacity": 0.95,
              }}
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
            />

            <Layer
              id="rota-linha"
              type="line"
              paint={{
                "line-color": "#1976D2",
                "line-width": 6,
                "line-opacity": 0.95,
              }}
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
            />
          </GeoJSONSource>
        )}

        {/* Marcadores nativos do mapa: o toque é tratado pelo GeoJSONSource,
            não por um Pressable dentro do Marker. */}
        <GeoJSONSource
          id="entregas-interativas"
          data={marcadoresGeoJSON}
          onPress={(evento) => {
            type MarcadorSelecionado = {
              properties?: { id?: number | string };
            };

            type EventoMarcador = {
              features?: MarcadorSelecionado[];
              nativeEvent?: {
                features?: MarcadorSelecionado[];
                feature?: MarcadorSelecionado;
              };
            };

            const toque = evento as unknown as EventoMarcador;
            const marcador =
              toque.nativeEvent?.features?.[0] ??
              toque.nativeEvent?.feature ??
              toque.features?.[0];

            const id = Number(marcador?.properties?.id);

            if (
              marcador &&
              Number.isFinite(id) &&
              pontos.some((ponto) => ponto.id === id)
            ) {
              setPontoSelecionadoId(id);
            }
          }}
        >
          <Layer
            id="entregas-circulo-borda"
            type="circle"
            paint={{
              "circle-radius": 21,
              "circle-color": "#FFFFFF",
            }}
          />
          <Layer
            id="entregas-circulo"
            type="circle"
            paint={{
              "circle-radius": 17,
              "circle-color": [
                "case",
                ["==", ["get", "concluida"], true],
                "#16A34A",
                "#1976D2",
              ],
            }}
          />
          <Layer
            id="entregas-numeracao"
            type="symbol"
            layout={{
              "text-field": ["get", "rotulo"],
              "text-size": 13,
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            }}
            paint={{
              "text-color": "#FFFFFF",
            }}
          />
        </GeoJSONSource>

        {/* Posição do motorista */}
        {minhaLocalizacao && (
          <Marker
            id="minha-localizacao"
            lngLat={[minhaLocalizacao.longitude, minhaLocalizacao.latitude]}
          >
            <View style={styles.marcadorLocalizacao}>
              <View style={styles.localizacaoCirculoExterno}>
                <View style={styles.localizacaoCirculoInterno} />
              </View>
            </View>
          </Marker>
        )}
      </Map>

      {/* Cartão da empresa selecionada */}
      {pontoSelecionado && (
        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            elevation: 7,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                {ordemParadas.has(pontoSelecionado.id)
                  ? `Parada ${ordemParadas.get(pontoSelecionado.id)}`
                  : "Entrega"}
              </Text>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: "700",
                }}
              >
                {pontoSelecionado.empresa}
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                CNPJ: {formatarCnpj(pontoSelecionado.cnpj)}
              </Text>
            </View>

            <Pressable
              onPress={() => setPontoSelecionadoId(null)}
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes da empresa"
              hitSlop={10}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Resumo da rota */}
      {pendentes.length > 0 && (
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 90,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 14,
            elevation: 5,
            maxHeight: 270,
          }}
        >
          {carregandoRota && !rota ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ActivityIndicator color={colors.primary} />

              <Text style={{ color: colors.text }}>
                Calculando melhor rota...
              </Text>
            </View>
          ) : rota ? (
            <>
              <Pressable
                onPress={() => setMostrarParadas((valor) => !valor)}
                accessibilityRole="button"
                accessibilityLabel="Mostrar ordem das entregas"
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: "700",
                      fontSize: 15,
                    }}
                  >
                    Rota otimizada
                  </Text>

                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    {(rota.distanciaMetros / 1000).toFixed(1)}
                    {" km  •  "}
                    {formatarDuracao(rota.duracaoSegundos)}
                  </Text>
                </View>

                <Ionicons
                  name={mostrarParadas ? "chevron-down" : "list-outline"}
                  size={24}
                  color={colors.primary}
                />
              </Pressable>

              {carregandoRota && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  Atualizando percurso...
                </Text>
              )}

              {erroRota && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    marginTop: 6,
                  }}
                >
                  {erroRota}
                </Text>
              )}

              {mostrarParadas && (
                <ScrollView style={{ marginTop: 12 }} nestedScrollEnabled>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    Partida: minha localização
                  </Text>

                  {rota.paradas.map((parada, index) => (
                    <Text
                      key={parada.id}
                      style={{
                        color: colors.text,
                        paddingVertical: 5,
                      }}
                    >
                      {index + 1}. {parada.empresa}
                    </Text>
                  ))}
                </ScrollView>
              )}

              {erroRota && (
                <Pressable onPress={tentarNovamente} style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "700",
                    }}
                  >
                    Tentar novamente
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <View>
              <Text style={{ color: colors.textSecondary }}>
                {erroRota ??
                  (carregandoGPS
                    ? "Aguardando GPS..."
                    : "Aguardando cálculo da rota...")}
              </Text>

              {erroRota && (
                <Pressable onPress={tentarNovamente} style={{ marginTop: 12 }}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "700",
                    }}
                  >
                    Tentar novamente
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* Centralizar no GPS */}
      <Pressable
        onPress={centralizarLocalizacao}
        disabled={!minhaLocalizacao}
        accessibilityRole="button"
        accessibilityLabel="Centralizar minha localização"
        style={[
          styles.botaoLocalizacao,
          !minhaLocalizacao && styles.botaoLocalizacaoDesabilitado,
        ]}
      >
        {carregandoGPS ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Ionicons name="locate" size={26} color={colors.primary} />
        )}
      </Pressable>
    </View>
  );
}

export const MapaEntregas = memo(MapaEntregasComponent);
