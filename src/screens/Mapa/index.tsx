import { router, useFocusEffect } from "expo-router";

import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function MapaScreen() {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    diaTrabalho,
    carregando: carregandoJornada,
    recarregarJornada,
  } = useHomeData();

  const [pontos, setPontos] = useState<PontoMapaEntrega[]>([]);

  const [carregandoEntregas, setCarregandoEntregas] = useState(true);

  const [erro, setErro] = useState<string | null>(null);

  const [versaoAtualizacao, setVersaoAtualizacao] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void recarregarJornada();

      setVersaoAtualizacao((valor) => valor + 1);
    }, [recarregarJornada]),
  );

  useEffect(() => {
    let ativo = true;

    async function carregarEntregas() {
      try {
        setCarregandoEntregas(true);
        setErro(null);

        if (!diaTrabalho || diaTrabalho.status !== "aberto") {
          if (ativo) {
            setPontos([]);
          }

          return;
        }

        const registros = await entregaRepository.findByDiaTrabalhoId(
          diaTrabalho.id,
        );

        const resultados = await Promise.all(
          registros.map(async (entrega) => {
            const empresa = await empresaRepository.findById(entrega.empresaId);

            const latitude = Number(entrega.latitude ?? empresa?.latitude);

            const longitude = Number(entrega.longitude ?? empresa?.longitude);

            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude) ||
              latitude < -90 ||
              latitude > 90 ||
              longitude < -180 ||
              longitude > 180
            ) {
              return null;
            }

            const ponto: PontoMapaEntrega = {
              id: entrega.id,

              empresa: empresa?.nome ?? `Empresa #${entrega.empresaId}`,

              cnpj: empresa?.cnpj ?? null,

              latitude,
              longitude,
              status: entrega.status,
            };

            return ponto;
          }),
        );

        if (!ativo) return;

        setPontos(
          resultados.filter(
            (ponto): ponto is PontoMapaEntrega => ponto !== null,
          ),
        );
      } catch (error) {
        if (ativo) {
          setErro("Não foi possível carregar as entregas.");

          setPontos([]);
        }
      } finally {
        if (ativo) {
          setCarregandoEntregas(false);
        }
      }
    }

    void carregarEntregas();

    return () => {
      ativo = false;
    };
  }, [diaTrabalho?.id, diaTrabalho?.status, versaoAtualizacao]);

  const carregando = carregandoJornada || carregandoEntregas;

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Mapa"
        subtitulo="Localização e entregas da jornada"
        onVoltar={() => router.back()}
      />

      <View style={styles.conteudo}>
        {carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={theme.colors.primary} />

            <Text style={styles.mensagem}>Carregando mapa...</Text>
          </View>
        ) : (
          <>
            <MapaEntregas pontos={pontos} />

            {erro && (
              <View
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  right: 16,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: theme.colors.surface,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                  }}
                >
                  {erro}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
