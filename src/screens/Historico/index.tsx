import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HistoricoEntregas from "@/components/historico/HistoricoEntregas";
import HistoricoTurnos from "@/components/historico/HistoricoTurnos";
import { useJornadaContext } from "@/contexts/JornadaContext";

import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";

import { styles } from "./styles";

type AbaHistorico = "entregas" | "turnos";

type Turno = Awaited<ReturnType<typeof diaTrabalhoRepository.findAll>>[number];

type Entrega = Awaited<
  ReturnType<typeof entregaRepository.findAllWithDetails>
>[number];

export default function HistoricoScreen() {
  const { diaTrabalho, carregando: carregandoJornada } = useJornadaContext();
  const [abaAtiva, setAbaAtiva] = useState<AbaHistorico>("entregas");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarHistorico = useCallback(async (mostrarCarregamento = true) => {
    try {
      if (mostrarCarregamento) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      setErro(null);

      const [todosTurnos, todasEntregas] = await Promise.all([
        diaTrabalhoRepository.findAll(),
        entregaRepository.findAllWithDetails(),
      ]);

      const turnosFinalizados = todosTurnos.filter(
        (turno) => turno.status === "finalizado",
      );

      const idsFinalizados = new Set(
        turnosFinalizados.map((turno) => turno.id),
      );

      const entregasHistoricas = todasEntregas.filter((entrega) =>
        idsFinalizados.has(entrega.diaTrabalhoId),
      );

      setTurnos(turnosFinalizados);
      setEntregas(entregasHistoricas);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);

      setErro("Não foi possível carregar o histórico.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!carregandoJornada) void carregarHistorico();
    }, [carregarHistorico, carregandoJornada, diaTrabalho?.id, diaTrabalho?.status]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoIcone}>
          <Ionicons name="time-outline" size={25} color="#FFFFFF" />
        </View>

        <View style={styles.cabecalhoConteudo}>
          <Text style={styles.titulo}>Histórico</Text>
          <Text style={styles.subtitulo}>Entregas e turnos anteriores</Text>
        </View>
      </View>

      <View style={styles.areaAbas}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAbaAtiva("entregas")}
          style={[styles.aba, abaAtiva === "entregas" && styles.abaAtiva]}
        >
          <Ionicons
            name="cube-outline"
            size={19}
            color={abaAtiva === "entregas" ? "#FFFFFF" : "#64748B"}
          />

          <Text
            style={[
              styles.abaTexto,
              abaAtiva === "entregas" && styles.abaTextoAtivo,
            ]}
          >
            Entregas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAbaAtiva("turnos")}
          style={[styles.aba, abaAtiva === "turnos" && styles.abaAtiva]}
        >
          <Ionicons
            name="calendar-outline"
            size={19}
            color={abaAtiva === "turnos" ? "#FFFFFF" : "#64748B"}
          />

          <Text
            style={[
              styles.abaTexto,
              abaAtiva === "turnos" && styles.abaTextoAtivo,
            ]}
          >
            Turnos
          </Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.carregamento}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.textoSecundario}>Carregando histórico...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoErro}>
          <Ionicons name="alert-circle-outline" size={44} color="#DC2626" />

          <Text style={styles.erroTitulo}>{erro}</Text>

          <TouchableOpacity
            style={styles.botaoTentarNovamente}
            onPress={() => void carregarHistorico()}
          >
            <Text style={styles.botaoTentarNovamenteTexto}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => void carregarHistorico(false)}
              tintColor="#2563EB"
              colors={["#2563EB"]}
            />
          }
        >
          {abaAtiva === "entregas" ? (
            <HistoricoEntregas entregas={entregas} />
          ) : (
            <HistoricoTurnos turnos={turnos} entregas={entregas} />
          )}
        </ScrollView>
      )}
    </View>
  );
}
