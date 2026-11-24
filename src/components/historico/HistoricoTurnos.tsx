import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";

type Turno = Awaited<ReturnType<typeof diaTrabalhoRepository.findAll>>[number];

type Entrega = Awaited<
  ReturnType<typeof entregaRepository.findAllWithDetails>
>[number];

interface HistoricoTurnosProps {
  turnos: Turno[];
  entregas: Entrega[];
}

function formatarData(data?: string | null): string {
  if (!data) return "Data não informada";

  const partes = data.slice(0, 10).split("-");
  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarHorario(data?: string | null): string {
  if (!data) return "--:--";

  const convertida = new Date(data);
  if (Number.isNaN(convertida.getTime())) return "--:--";

  return convertida.toLocaleTimeString("pt-BR", {
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
  const restantes = minutos % 60;

  return `${horas}h ${String(restantes).padStart(2, "0")}min`;
}

function formatarStatus(status: string): string {
  switch (status) {
    case "realizada":
      return "Realizada";
    case "em_rota":
      return "Em rota";
    case "pendente":
      return "Pendente";
    default:
      return status.replace(/_/g, " ");
  }
}

export default function HistoricoTurnos({
  turnos,
  entregas,
}: HistoricoTurnosProps) {
  const [expandidoId, setExpandidoId] = useState<number | null>(null);

  const entregasPorTurno = useMemo(() => {
    const agrupadas = new Map<number, Entrega[]>();

    entregas.forEach((entrega) => {
      const lista = agrupadas.get(entrega.diaTrabalhoId) ?? [];
      lista.push(entrega);
      agrupadas.set(entrega.diaTrabalhoId, lista);
    });

    return agrupadas;
  }, [entregas]);

  return (
    <View style={styles.container}>
      <View style={styles.estatisticas}>
        <View style={styles.estatisticaCard}>
          <Text style={styles.estatisticaRotulo}>Turnos finalizados</Text>
          <Text style={styles.estatisticaNumero}>{turnos.length}</Text>
        </View>

        <View style={styles.estatisticaCard}>
          <Text style={styles.estatisticaRotulo}>Entregas registradas</Text>
          <Text style={styles.estatisticaNumero}>{entregas.length}</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Histórico de turnos</Text>

      {turnos.length === 0 ? (
        <View style={styles.estadoVazio}>
          <Ionicons name="calendar-outline" size={42} color="#94A3B8" />
          <Text style={styles.estadoVazioTitulo}>Nenhum turno finalizado</Text>
          <Text style={styles.estadoVazioDescricao}>
            Quando você finalizar um turno, ele aparecerá aqui.
          </Text>
        </View>
      ) : (
        turnos.map((turno) => {
          const expandido = expandidoId === turno.id;
          const entregasDoTurno = entregasPorTurno.get(turno.id) ?? [];

          const realizadas = entregasDoTurno.filter(
            (entrega) => entrega.status === "realizada",
          ).length;

          return (
            <View key={turno.id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.cardCabecalho}
                onPress={() => setExpandidoId(expandido ? null : turno.id)}
              >
                <View style={styles.iconeCard}>
                  <Ionicons name="calendar-outline" size={23} color="#2563EB" />
                </View>

                <View style={styles.cardConteudo}>
                  <Text style={styles.cardTitulo}>
                    {formatarData(turno.data)}
                  </Text>
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
                  <Text style={styles.textoSecundario}>
                    {formatarDuracao(turno.inicioEm, turno.fimEm)}
                  </Text>
                </View>

                <View style={styles.turnoResumoItem}>
                  <Ionicons name="cube-outline" size={16} color="#64748B" />
                  <Text style={styles.textoSecundario}>
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
                        <View key={entrega.id} style={styles.entregaLinha}>
                          <Ionicons
                            name={
                              realizada ? "checkmark-circle" : "ellipse-outline"
                            }
                            size={19}
                            color={realizada ? "#16A34A" : "#D97706"}
                          />

                          <View style={styles.cardConteudo}>
                            <Text style={styles.entregaNome}>
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
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  estatisticas: {
    flexDirection: "row",
    gap: 12,
  },
  estatisticaCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  estatisticaRotulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "500",
  },
  estatisticaNumero: {
    color: "#0F172A",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 7,
  },
  secaoTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconeCard: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  cardConteudo: {
    flex: 1,
    minWidth: 0,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardSubtitulo: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  turnoResumo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  turnoResumoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  textoSecundario: {
    color: "#64748B",
    fontSize: 12,
  },
  detalhes: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  detalhesTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  entregaLinha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
  },
  entregaNome: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 3,
  },
  estadoVazio: {
    alignItems: "center",
    padding: 28,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  estadoVazioTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  estadoVazioDescricao: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 13,
  },
});
