import { useCallback, useMemo, useState } from "react";

import { useFocusEffect, useRouter } from "expo-router";
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

import { createStyles } from "./styles";

type ProximaEntrega = {
  id: number;
  empresa: string;
  endereco: string;
};

function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");

  if (!ano || !mes || !dia) return data;

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

  // Estatísticas das entregas
  const {
    total,
    realizadas,
    pendentes,
    erro: erroEntregas,
  } = useEntregasStats(diaTrabalho?.id);

  // Próxima entrega pendente
  const [proximaEntrega, setProximaEntrega] = useState<ProximaEntrega | null>(
    null,
  );

  const [carregandoProxima, setCarregandoProxima] = useState(false);

  const [erroProxima, setErroProxima] = useState<string | null>(null);

  const status: "nao_iniciada" | "aberto" | "finalizado" =
    diaTrabalho?.status === "aberto"
      ? "aberto"
      : diaTrabalho?.status === "finalizado"
        ? "finalizado"
        : "nao_iniciada";

  // Recarregar a jornada ao retornar para a Home
  useFocusEffect(
    useCallback(() => {
      void recarregarJornada();
    }, [recarregarJornada]),
  );

  // Buscar próxima entrega pendente no SQLite
  const carregarProximaEntrega = useCallback(async () => {
    if (!diaTrabalho?.id || diaTrabalho.status !== "aberto") {
      setProximaEntrega(null);
      setErroProxima(null);
      setCarregandoProxima(false);
      return;
    }

    try {
      setCarregandoProxima(true);
      setErroProxima(null);

      const entregas = await entregaRepository.findByDiaTrabalhoId(
        diaTrabalho.id,
      );

      // A consulta do repository está ordenada
      // pelo ID crescente.
      const entregaPendente = entregas.find(
        (entrega) => entrega.status === "pendente",
      );

      if (!entregaPendente) {
        setProximaEntrega(null);
        return;
      }

      const empresa = await empresaRepository.findById(
        entregaPendente.empresaId,
      );

      setProximaEntrega({
        id: entregaPendente.id,
        empresa: empresa?.nome ?? `Empresa #${entregaPendente.empresaId}`,
        endereco:
          entregaPendente.endereco ||
          empresa?.endereco ||
          "Endereço não informado",
      });
    } catch (error) {
      console.error("[HOME] Erro ao carregar próxima entrega:", error);

      setErroProxima("Não foi possível carregar a próxima entrega.");

      setProximaEntrega(null);
    } finally {
      setCarregandoProxima(false);
    }
  }, [diaTrabalho?.id, diaTrabalho?.status]);

  // Atualizar a próxima entrega ao voltar para a Home
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function atualizar() {
        if (ativo) {
          await carregarProximaEntrega();
        }
      }

      void atualizar();

      return () => {
        ativo = false;
      };
    }, [carregarProximaEntrega]),
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

          {erroProxima && <Text style={styles.errorText}>{erroProxima}</Text>}

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

          {/* Estatísticas das entregas */}
          <DeliveryStats
            total={total}
            realizadas={realizadas}
            pendentes={pendentes}
          />

          {/* Próxima entrega real */}
          {status === "aberto" && (
            <>
              {carregandoProxima ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : proximaEntrega ? (
                <NextDeliveryCard
                  empresa={proximaEntrega.empresa}
                  endereco={proximaEntrega.endereco}
                />
              ) : (
                <View>
                  <Text>
                    {total === 0
                      ? "Nenhuma entrega cadastrada nesta jornada."
                      : "Nenhuma entrega pendente."}
                  </Text>
                </View>
              )}
            </>
          )}

          <HomeActions
            turnoAberto={status === "aberto"}
            onRegistrarEntrega={() => router.push("/entregas/nova")}
            onVerEntregas={() => router.push("/(tab)/entregas")}
            onVerRota={() => router.push("/mapa/index")}
            onFinalizarTurno={finalizarJornada}
          />
        </View>
      </ScrollView>
    </View>
  );
}
