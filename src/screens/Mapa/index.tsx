import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";

import {
    MapaEntregas,
    type PontoMapaEntrega,
} from "@/components/mapa/MapaEntregas";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useHomeData } from "@/hooks/useHomeData";

import { createStyles } from "./styles";

function coordenadasValidas(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): latitude is number {
  return (
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function MapaScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  const {
    diaTrabalho,
    carregando: carregandoJornada,
    recarregarJornada,
  } = useHomeData();

  const [pontos, setPontos] = useState<PontoMapaEntrega[]>([]);
  const [carregandoMapa, setCarregandoMapa] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [semLocalizacao, setSemLocalizacao] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void recarregarJornada();
    }, [recarregarJornada]),
  );

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarPontos() {
        setCarregandoMapa(true);
        setErro(null);

        try {
          if (!diaTrabalho || diaTrabalho.status !== "aberto") {
            if (ativo) {
              setPontos([]);
              setSemLocalizacao(0);
            }
            return;
          }

          const entregas = await entregaRepository.findByDiaTrabalhoId(
            diaTrabalho.id,
          );

          const resultados = await Promise.all(
            entregas.map(async (entrega) => {
              const empresa = await empresaRepository.findById(
                entrega.empresaId,
              );

              const latitude = entrega.latitude ?? empresa?.latitude;

              const longitude = entrega.longitude ?? empresa?.longitude;

              if (!coordenadasValidas(latitude, longitude)) {
                return null;
              }

              return {
                id: entrega.id,
                empresa: empresa?.nome ?? `Empresa #${entrega.empresaId}`,
                latitude,
                longitude: longitude as number,
                status: entrega.status,
              } satisfies PontoMapaEntrega;
            }),
          );

          if (!ativo) return;

          const validos = resultados.filter(
            (ponto): ponto is PontoMapaEntrega => ponto !== null,
          );

          setPontos(validos);
          setSemLocalizacao(entregas.length - validos.length);
        } catch (error) {
          console.error("[MAPA] Erro ao carregar entregas:", error);

          if (ativo) {
            setErro("Não foi possível carregar o mapa.");
            setPontos([]);
          }
        } finally {
          if (ativo) {
            setCarregandoMapa(false);
          }
        }
      }

      void carregarPontos();

      return () => {
        ativo = false;
      };
    }, [diaTrabalho?.id, diaTrabalho?.status]),
  );

  const carregando = carregandoJornada || carregandoMapa;

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Mapa"
        subtitulo="Entregas da jornada atual"
        onVoltar={() => router.back()}
      />

      <View style={styles.conteudo}>
        {carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={styles.mensagem}>Carregando mapa...</Text>
          </View>
        ) : erro ? (
          <View style={styles.centro}>
            <Ionicons
              name="alert-circle-outline"
              size={44}
              color={colors.danger}
            />

            <Text style={styles.mensagem}>{erro}</Text>
          </View>
        ) : !diaTrabalho || diaTrabalho.status !== "aberto" ? (
          <View style={styles.centro}>
            <Ionicons
              name="calendar-outline"
              size={44}
              color={colors.textSecondary}
            />

            <Text style={styles.mensagem}>
              Inicie uma jornada para visualizar as entregas.
            </Text>
          </View>
        ) : pontos.length === 0 ? (
          <View style={styles.centro}>
            <Ionicons
              name="map-outline"
              size={44}
              color={colors.textSecondary}
            />

            <Text style={styles.mensagem}>
              Nenhuma entrega com localização cadastrada.
            </Text>
          </View>
        ) : (
          <>
            <MapaEntregas pontos={pontos} />

            <View style={styles.resumo}>
              <Text style={styles.resumoTitulo}>
                {pontos.length}{" "}
                {pontos.length === 1 ? "entrega no mapa" : "entregas no mapa"}
              </Text>

              {semLocalizacao > 0 && (
                <Text style={styles.resumoDetalhe}>
                  {semLocalizacao} sem localização
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}
