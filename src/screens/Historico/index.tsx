import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";

import { styles } from "./styles";

type AbaHistorico = "entregas" | "turnos";

type Turno = Awaited<ReturnType<typeof diaTrabalhoRepository.findAll>>[number];

type Entrega = Awaited<
  ReturnType<typeof entregaRepository.findAllWithDetails>
>[number];

function formatarData(data?: string | null): string {
  if (!data) return "Data não informada";

  const somenteData = data.slice(0, 10);
  const partes = somenteData.split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarHorario(data?: string | null): string {
  if (!data) return "--:--";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "--:--";
  }

  return dataConvertida.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarDuracao(inicio?: string | null, fim?: string | null): string {
  if (!inicio || !fim) return "Não informada";

  const inicioMs = new Date(inicio).getTime();
  const fimMs = new Date(fim).getTime();

  if (
    !Number.isFinite(inicioMs) ||
    !Number.isFinite(fimMs) ||
    fimMs < inicioMs
  ) {
    return "Não informada";
  }

  const minutos = Math.floor((fimMs - inicioMs) / 60000);
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  return `${horas}h ${String(minutosRestantes).padStart(2, "0")}min`;
}

function formatarStatus(status: string): string {
  switch (status) {
    case "realizada":
      return "Realizada";
    case "em_rota":
      return "Em rota";
    case "pendente":
      return "Pendente";
    case "finalizado":
      return "Finalizado";
    case "aberto":
      return "Em andamento";
    default:
      return status.replace(/_/g, " ");
  }
}

function formatarCnpj(cnpj?: string | null): string {
  if (!cnpj) return "Não informado";

  const numeros = cnpj.replace(/\D/g, "");

  if (numeros.length !== 14) return cnpj;

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

export default function HistoricoScreen() {
  const [abaAtiva, setAbaAtiva] = useState<AbaHistorico>("entregas");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [entregaExpandidaId, setEntregaExpandidaId] = useState<number | null>(
    null,
  );

  const [turnoExpandidoId, setTurnoExpandidoId] = useState<number | null>(null);

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
      setErro("Não foi possível carregar o histórico.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregarHistorico();
    }, [carregarHistorico]),
  );

  const estatisticas = useMemo(() => {
    const realizadas = entregas.filter(
      (entrega) => entrega.status === "realizada",
    ).length;

    return {
      realizadas,
      outras: entregas.length - realizadas,
      totalEntregas: entregas.length,
      totalTurnos: turnos.length,
    };
  }, [entregas, turnos]);

  const entregasPorTurno = useMemo(() => {
    const agrupadas = new Map<number, Entrega[]>();

    entregas.forEach((entrega) => {
      const lista = agrupadas.get(entrega.diaTrabalhoId) ?? [];
      lista.push(entrega);
      agrupadas.set(entrega.diaTrabalhoId, lista);
    });

    return agrupadas;
  }, [entregas]);

  function alternarEntrega(id: number) {
    setEntregaExpandidaId((atual) => (atual === id ? null : id));
  }

  function alternarTurno(id: number) {
    setTurnoExpandidoId((atual) => (atual === id ? null : id));
  }

  function renderizarEntregas() {
    if (entregas.length === 0) {
      return (
        <View style={styles.estadoVazio}>
          <Ionicons name="cube-outline" size={44} color="#94A3B8" />

          <Text style={styles.estadoVazioTitulo}>
            Nenhuma entrega no histórico
          </Text>

          <Text style={styles.estadoVazioDescricao}>
            As entregas dos turnos finalizados aparecerão aqui.
          </Text>
        </View>
      );
    }

    return entregas.map((entrega) => {
      const expandida = entregaExpandidaId === entrega.id;
      const realizada = entrega.status === "realizada";

      return (
        <View key={entrega.id} style={styles.card}>
          <TouchableOpacity
            style={styles.cardCabecalho}
            activeOpacity={0.75}
            onPress={() => alternarEntrega(entrega.id)}
          >
            <View
              style={[
                styles.iconeCard,
                realizada ? styles.iconeCardSucesso : styles.iconeCardPendente,
              ]}
            >
              <Ionicons
                name={realizada ? "checkmark-circle-outline" : "cube-outline"}
                size={23}
                color={realizada ? "#16A34A" : "#D97706"}
              />
            </View>

            <View style={styles.cardConteudo}>
              <Text style={styles.cardTitulo} numberOfLines={2}>
                {entrega.empresaNome || "Empresa não informada"}
              </Text>

              <Text style={styles.cardSubtitulo}>
                {formatarData(entrega.dataTrabalho)}
                {entrega.realizadaEm
                  ? ` • ${formatarHorario(entrega.realizadaEm)}`
                  : ""}
              </Text>
            </View>

            <Ionicons
              name={expandida ? "chevron-up" : "chevron-down"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>

          <View style={styles.cardRodape}>
            <View
              style={[
                styles.statusContainer,
                realizada ? styles.statusSucesso : styles.statusPendente,
              ]}
            >
              <Text
                style={[
                  styles.statusTexto,
                  realizada
                    ? styles.statusTextoSucesso
                    : styles.statusTextoPendente,
                ]}
              >
                {formatarStatus(entrega.status)}
              </Text>
            </View>
          </View>

          {expandida && (
            <View style={styles.detalhes}>
              <Text style={styles.detalhesTitulo}>Detalhes da entrega</Text>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheRotulo}>CNPJ</Text>
                <Text style={styles.detalheValor}>
                  {formatarCnpj(entrega.empresaCnpj)}
                </Text>
              </View>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheRotulo}>Endereço</Text>
                <Text style={styles.detalheValor}>
                  {entrega.endereco || "Não informado"}
                </Text>
              </View>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheRotulo}>Data</Text>
                <Text style={styles.detalheValor}>
                  {formatarData(entrega.dataTrabalho)}
                </Text>
              </View>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheRotulo}>Horário da conclusão</Text>
                <Text style={styles.detalheValor}>
                  {entrega.realizadaEm
                    ? formatarHorario(entrega.realizadaEm)
                    : "Não concluída"}
                </Text>
              </View>

              {entrega.descricao ? (
                <View style={styles.detalheLinha}>
                  <Text style={styles.detalheRotulo}>Observações</Text>
                  <Text style={styles.detalheValor}>{entrega.descricao}</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      );
    });
  }

  function renderizarTurnos() {
    if (turnos.length === 0) {
      return (
        <View style={styles.estadoVazio}>
          <Ionicons name="calendar-outline" size={44} color="#94A3B8" />

          <Text style={styles.estadoVazioTitulo}>Nenhum turno finalizado</Text>

          <Text style={styles.estadoVazioDescricao}>
            Quando você finalizar um turno, ele aparecerá aqui.
          </Text>
        </View>
      );
    }

    return turnos.map((turno) => {
      const expandido = turnoExpandidoId === turno.id;
      const entregasDoTurno = entregasPorTurno.get(turno.id) ?? [];

      const realizadas = entregasDoTurno.filter(
        (entrega) => entrega.status === "realizada",
      ).length;

      return (
        <View key={turno.id} style={styles.card}>
          <TouchableOpacity
            style={styles.cardCabecalho}
            activeOpacity={0.75}
            onPress={() => alternarTurno(turno.id)}
          >
            <View style={styles.iconeCard}>
              <Ionicons name="calendar-outline" size={23} color="#2563EB" />
            </View>

            <View style={styles.cardConteudo}>
              <Text style={styles.cardTitulo}>{formatarData(turno.data)}</Text>

              <Text style={styles.cardSubtitulo}>
                {formatarHorario(turno.inicioEm)}
                {" - "}
                {formatarHorario(turno.fimEm)}
              </Text>
            </View>

            <Ionicons
              name={expandido ? "chevron-up" : "chevron-down"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>

          <View style={styles.turnoResumo}>
            <View style={styles.turnoResumoItem}>
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text style={styles.turnoResumoTexto}>
                {formatarDuracao(turno.inicioEm, turno.fimEm)}
              </Text>
            </View>

            <View style={styles.turnoResumoItem}>
              <Ionicons name="cube-outline" size={16} color="#64748B" />
              <Text style={styles.turnoResumoTexto}>
                {realizadas}/{entregasDoTurno.length} realizadas
              </Text>
            </View>
          </View>

          {expandido && (
            <View style={styles.detalhes}>
              <Text style={styles.detalhesTitulo}>Entregas do turno</Text>

              {entregasDoTurno.length === 0 ? (
                <Text style={styles.textoSecundario}>
                  Nenhuma entrega registrada neste turno.
                </Text>
              ) : (
                entregasDoTurno.map((entrega) => {
                  const realizada = entrega.status === "realizada";

                  return (
                    <View key={entrega.id} style={styles.entregaDoTurno}>
                      <Ionicons
                        name={
                          realizada ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={19}
                        color={realizada ? "#16A34A" : "#D97706"}
                      />

                      <View style={styles.cardConteudo}>
                        <Text style={styles.entregaDoTurnoNome}>
                          {entrega.empresaNome || "Empresa não informada"}
                        </Text>

                        <Text style={styles.textoSecundario}>
                          {formatarStatus(entrega.status)}
                          {entrega.realizadaEm
                            ? ` • ${formatarHorario(entrega.realizadaEm)}`
                            : ""}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Histórico</Text>

        <Text style={styles.subtitulo}>
          Consulte suas entregas e turnos anteriores
        </Text>
      </View>

      <View style={styles.abasContainer}>
        <TouchableOpacity
          style={[styles.aba, abaAtiva === "entregas" && styles.abaAtiva]}
          onPress={() => setAbaAtiva("entregas")}
          activeOpacity={0.8}
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
          style={[styles.aba, abaAtiva === "turnos" && styles.abaAtiva]}
          onPress={() => setAbaAtiva("turnos")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="time-outline"
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
        <View style={styles.estadoVazio}>
          <Ionicons name="alert-circle-outline" size={44} color="#DC2626" />

          <Text style={styles.estadoVazioTitulo}>{erro}</Text>

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
          <View style={styles.estatisticas}>
            {abaAtiva === "entregas" ? (
              <>
                <View style={styles.estatisticaCard}>
                  <Text style={styles.estatisticaRotulo}>Realizadas</Text>

                  <Text style={styles.estatisticaNumero}>
                    {estatisticas.realizadas}
                  </Text>
                </View>

                <View style={styles.estatisticaCard}>
                  <Text style={styles.estatisticaRotulo}>Outras situações</Text>

                  <Text style={styles.estatisticaNumero}>
                    {estatisticas.outras}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.estatisticaCard}>
                  <Text style={styles.estatisticaRotulo}>
                    Turnos finalizados
                  </Text>

                  <Text style={styles.estatisticaNumero}>
                    {estatisticas.totalTurnos}
                  </Text>
                </View>

                <View style={styles.estatisticaCard}>
                  <Text style={styles.estatisticaRotulo}>
                    Entregas registradas
                  </Text>

                  <Text style={styles.estatisticaNumero}>
                    {estatisticas.totalEntregas}
                  </Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.secaoTitulo}>
            {abaAtiva === "entregas"
              ? "Histórico de entregas"
              : "Histórico de turnos"}
          </Text>

          {abaAtiva === "entregas" ? renderizarEntregas() : renderizarTurnos()}
        </ScrollView>
      )}
    </View>
  );
}
