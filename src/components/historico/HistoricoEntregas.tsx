import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { entregaRepository } from "@/database/repositories/entregaRepository";

type Entrega = Awaited<
  ReturnType<typeof entregaRepository.findAllWithDetails>
>[number];

interface HistoricoEntregasProps {
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

function formatarCnpj(cnpj?: string | null): string {
  if (!cnpj) return "Não informado";

  const numeros = cnpj.replace(/\D/g, "");
  if (numeros.length !== 14) return cnpj;

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
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

function Detalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.detalheLinha}>
      <Text style={styles.detalheRotulo}>{rotulo}</Text>
      <Text style={styles.detalheValor}>{valor}</Text>
    </View>
  );
}

export default function HistoricoEntregas({
  entregas,
}: HistoricoEntregasProps) {
  const [expandidaId, setExpandidaId] = useState<number | null>(null);

  const realizadas = entregas.filter(
    (entrega) => entrega.status === "realizada",
  ).length;

  const outras = entregas.length - realizadas;

  return (
    <View style={styles.container}>
      <View style={styles.estatisticas}>
        <View style={styles.estatisticaCard}>
          <Text style={styles.estatisticaRotulo}>Realizadas</Text>
          <Text style={styles.estatisticaNumero}>{realizadas}</Text>
        </View>

        <View style={styles.estatisticaCard}>
          <Text style={styles.estatisticaRotulo}>Outras situações</Text>
          <Text style={styles.estatisticaNumero}>{outras}</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Histórico de entregas</Text>

      {entregas.length === 0 ? (
        <View style={styles.estadoVazio}>
          <Ionicons name="cube-outline" size={42} color="#94A3B8" />
          <Text style={styles.estadoVazioTitulo}>
            Nenhuma entrega no histórico
          </Text>
          <Text style={styles.estadoVazioDescricao}>
            As entregas dos turnos finalizados aparecerão aqui.
          </Text>
        </View>
      ) : (
        entregas.map((entrega) => {
          const expandida = expandidaId === entrega.id;
          const realizada = entrega.status === "realizada";

          return (
            <View key={entrega.id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.cardCabecalho}
                onPress={() => setExpandidaId(expandida ? null : entrega.id)}
              >
                <View
                  style={[
                    styles.iconeCard,
                    realizada ? styles.iconeSucesso : styles.iconePendente,
                  ]}
                >
                  <Ionicons
                    name={
                      realizada ? "checkmark-circle-outline" : "cube-outline"
                    }
                    size={24}
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
                    styles.status,
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

                  <Detalhe
                    rotulo="CNPJ"
                    valor={formatarCnpj(entrega.empresaCnpj)}
                  />
                  <Detalhe
                    rotulo="Endereço"
                    valor={entrega.endereco || "Não informado"}
                  />
                  <Detalhe
                    rotulo="Data"
                    valor={formatarData(entrega.dataTrabalho)}
                  />
                  <Detalhe
                    rotulo="Horário da conclusão"
                    valor={
                      entrega.realizadaEm
                        ? formatarHorario(entrega.realizadaEm)
                        : "Não concluída"
                    }
                  />

                  {entrega.descricao ? (
                    <Detalhe rotulo="Observações" valor={entrega.descricao} />
                  ) : null}
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
    alignItems: "center",
    justifyContent: "center",
  },
  iconeSucesso: {
    backgroundColor: "#DCFCE7",
  },
  iconePendente: {
    backgroundColor: "#FEF3C7",
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
  cardRodape: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusSucesso: {
    backgroundColor: "#DCFCE7",
  },
  statusPendente: {
    backgroundColor: "#FEF3C7",
  },
  statusTexto: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextoSucesso: {
    color: "#15803D",
  },
  statusTextoPendente: {
    color: "#92400E",
  },
  detalhes: {
    padding: 16,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  detalhesTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  detalheLinha: {
    gap: 4,
  },
  detalheRotulo: {
    fontSize: 12,
    color: "#64748B",
  },
  detalheValor: {
    fontSize: 14,
    color: "#0F172A",
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
