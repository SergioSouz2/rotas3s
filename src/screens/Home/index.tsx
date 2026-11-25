import { useCallback, useMemo, useState } from "react";

import { useFocusEffect, useRouter } from "expo-router";

import * as Location from "expo-location";

import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { DeliveryStats } from "@/components/home/DeliveryStats";
import { HomeActions } from "@/components/home/HomeActions";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NextDeliveryCard } from "@/components/home/NextDeliveryCard";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { WorkdayCard } from "@/components/home/WorkdayCard";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useEntregasStats } from "@/hooks/useEntregasStats";
import { useHomeData } from "@/hooks/useHomeData";

import {
  calcularESalvarRota,
  chaveDasParadas,
  lerRotaSalva,
  type ParadaRota,
} from "@/services/roteirizacaoService";

import { createStyles } from "./styles";

type ProximaEntrega = {
  id: number;
  empresa: string;
  endereco: string;
  latitude: number;
  longitude: number;
  status: string;
};

type EntregaComLocalizacao = ProximaEntrega & ParadaRota;

const TIMEOUT_OTIMIZACAO_MS = 20000;

function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");

  if (!ano || !mes || !dia) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

function formatarHora(data: string): string {
  const horario = new Date(data);

  if (Number.isNaN(horario.getTime())) {
    return "--:--";
  }

  return horario.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterDataAtual(): string {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");
}

function coordenadasValidas(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function HomeScreen() {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;
  const router = useRouter();

  const {
    usuario,
    diaTrabalho,
    carregando,
    processando,
    erro,
    iniciarJornada,
    finalizarJornada,
    recarregarJornada,
  } = useHomeData();

  const {
    total,
    realizadas,
    pendentes,
    erro: erroEntregas,
  } = useEntregasStats(diaTrabalho?.id);

  const [proximaEntrega, setProximaEntrega] = useState<ProximaEntrega | null>(
    null,
  );

  const [carregandoProxima, setCarregandoProxima] = useState(false);

  const [erroProxima, setErroProxima] = useState<string | null>(null);

  const [tempoEstimado, setTempoEstimado] = useState<number | null>(null);

  const status: "nao_iniciada" | "aberto" | "finalizado" =
    diaTrabalho?.status === "aberto"
      ? "aberto"
      : diaTrabalho?.status === "finalizado"
        ? "finalizado"
        : "nao_iniciada";

  // Atualiza a jornada ao retornar à Home.
  useFocusEffect(
    useCallback(() => {
      void recarregarJornada();
    }, [recarregarJornada]),
  );

  // Busca e otimiza a próxima entrega sempre
  // que a Home recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      const controlador = new AbortController();

      async function carregarProximaEntrega() {
        setProximaEntrega(null);
        setErroProxima(null);
        setTempoEstimado(null);

        if (!diaTrabalho?.id || diaTrabalho.status !== "aberto") {
          setCarregandoProxima(false);
          return;
        }

        setCarregandoProxima(true);

        try {
          // 1. Busca todas as entregas da jornada.
          const registros = await entregaRepository.findByDiaTrabalhoId(
            diaTrabalho.id,
          );

          if (!ativo) return;

          // 2. Considera somente entregas
          // que ainda precisam ser realizadas.
          const entregasRestantes = registros.filter(
            (entrega) =>
              entrega.status === "pendente" || entrega.status === "em_rota",
          );

          if (entregasRestantes.length === 0) {
            setProximaEntrega(null);
            return;
          }

          // 3. Busca os dados das empresas.
          const entregasComEmpresa = await Promise.all(
            entregasRestantes.map(async (entrega) => {
              const empresa = await empresaRepository.findById(
                entrega.empresaId,
                { incluirExcluidas: true },
              );

              const latitude = entrega.latitude ?? empresa?.latitude;

              const longitude = entrega.longitude ?? empresa?.longitude;

              const endereco =
                entrega.endereco ||
                empresa?.endereco ||
                "Endereço não informado";

              const nomeEmpresa =
                empresa?.nome ?? `Empresa #${entrega.empresaId}`;

              if (
                latitude == null || longitude == null ||
                !coordenadasValidas(latitude, longitude)
              ) {
                return null;
              }

              const resultado: EntregaComLocalizacao = {
                id: entrega.id,
                empresa: nomeEmpresa,
                endereco,
                latitude,
                longitude,
                status: entrega.status,
              };

              return resultado;
            }),
          );

          if (!ativo) return;

          const entregasValidas = entregasComEmpresa.filter(
            (entrega): entrega is EntregaComLocalizacao => entrega !== null,
          );

          if (entregasValidas.length === 0) {
            setErroProxima(
              "As entregas pendentes não possuem coordenadas válidas.",
            );
            return;
          }

          if (entregasValidas.length !== entregasRestantes.length) {
            setErroProxima(
              "Existem entregas sem localização. Corrija os endereços para otimizar toda a jornada.",
            );
            return;
          }

          let resultado = await lerRotaSalva(
            diaTrabalho.id,
            chaveDasParadas(entregasValidas),
          );
          if (!ativo) return;

          if (!resultado) {
            const permissao = await Location.requestForegroundPermissionsAsync();
            if (!ativo) return;

            if (permissao.status !== "granted") {
              setErroProxima("Autorize o GPS para identificar a próxima entrega otimizada.");
              return;
            }

            const { coords } = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            if (!ativo) return;

            const origem = { latitude: coords.latitude, longitude: coords.longitude };
            if (!coordenadasValidas(origem.latitude, origem.longitude)) {
              throw new Error("LOCALIZACAO_GPS_INVALIDA");
            }

            const timeout = setTimeout(() => controlador.abort(), TIMEOUT_OTIMIZACAO_MS);
            try {
              resultado = await calcularESalvarRota(
                diaTrabalho.id,
                origem,
                entregasValidas,
                controlador.signal,
              );
            } finally {
              clearTimeout(timeout);
            }
          }

          if (!ativo || controlador.signal.aborted) {
            return;
          }

          // 7. A primeira parada da sequência
          // otimizada será exibida na Home.
          const primeiraParada = resultado.paradas[0];

          if (!primeiraParada) {
            setErroProxima(
              "Não foi possível identificar a primeira parada da rota.",
            );
            return;
          }

          const entregaSelecionada = entregasValidas.find(
            (entrega) => entrega.id === primeiraParada.id,
          );

          if (!entregaSelecionada) {
            throw new Error("ENTREGA_OTIMIZADA_NAO_ENCONTRADA");
          }

          setProximaEntrega(entregaSelecionada);

          setTempoEstimado(resultado.duracaoSegundos);
        } catch (error) {
          if (!ativo) return;

          setProximaEntrega(null);

          setErroProxima(
            controlador.signal.aborted
              ? "O cálculo da rota demorou demais. Abra o Mapa para tentar novamente."
              : "Não foi possível calcular a próxima entrega otimizada. Verifique o GPS e a internet.",
          );
        } finally {
          if (ativo) {
            setCarregandoProxima(false);
          }
        }
      }

      void carregarProximaEntrega();

      return () => {
        ativo = false;
        controlador.abort();
      };
    }, [diaTrabalho?.id, diaTrabalho?.status]),
  );

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader />

        <View style={styles.body}>
          {erro && <Text style={styles.errorText}>{erro}</Text>}

          {erroEntregas && <Text style={styles.errorText}>{erroEntregas}</Text>}

          <WelcomeCard
            nome={usuario?.nome ?? "Motorista"}
            turnoAberto={status === "aberto"}
          />

          <WorkdayCard
            data={formatarData(diaTrabalho?.data ?? obterDataAtual())}
            inicio={
              diaTrabalho?.inicioEm ? formatarHora(diaTrabalho.inicioEm) : null
            }
            fim={diaTrabalho?.fimEm ? formatarHora(diaTrabalho.fimEm) : null}
            status={status}
            processando={processando}
            onIniciar={iniciarJornada}
            onFinalizar={finalizarJornada}
          />

          <DeliveryStats
            total={total}
            realizadas={realizadas}
            pendentes={pendentes}
          />

          {/* Próxima entrega escolhida
              pelo cálculo da rota otimizada */}
          {status === "aberto" && (
            <>
              {carregandoProxima ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 20,
                    gap: 10,
                  }}
                >
                  <ActivityIndicator size="small" color={colors.primary} />

                  <Text
                    style={{
                      color: colors.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    Calculando próxima entrega a partir do GPS...
                  </Text>
                </View>
              ) : proximaEntrega ? (
                <>
                  <NextDeliveryCard
                    empresa={proximaEntrega.empresa}
                    endereco={proximaEntrega.endereco}
                    latitude={proximaEntrega.latitude}
                    longitude={proximaEntrega.longitude}
                    status="Rota otimizada"
                  />

                  {tempoEstimado !== null && (
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 12,
                        marginTop: 6,
                        textAlign: "center",
                      }}
                    >
                      Tempo estimado para concluir todas as entregas:{" "}
                      {Math.ceil(tempoEstimado / 60)} min
                    </Text>
                  )}
                </>
              ) : (
                <View>
                  <Text
                    style={{
                      color: colors.textSecondary,
                    }}
                  >
                    {erroProxima ??
                      (total === 0
                        ? "Nenhuma entrega cadastrada nesta jornada."
                        : "Nenhuma entrega restante para realizar.")}
                  </Text>
                </View>
              )}
            </>
          )}

          <HomeActions
            turnoAberto={status === "aberto"}
            onRegistrarEntrega={() => router.push("/entregas/nova")}
            onVerEntregas={() => router.push("/(tab)/entregas")}
            onVerRota={() => router.push("/mapa")}
            onFinalizarTurno={processando ? undefined : finalizarJornada}
          />
        </View>
      </ScrollView>
    </View>
  );
}
