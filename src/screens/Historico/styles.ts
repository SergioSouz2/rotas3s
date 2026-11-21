import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitulo: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  abasContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },

  aba: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 9,
  },

  abaAtiva: {
    backgroundColor: "#2563EB",
  },

  abaTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  abaTextoAtivo: {
    color: "#FFFFFF",
  },

  lista: {
    flex: 1,
  },

  listaConteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  estatisticas: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  estatisticaCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  estatisticaRotulo: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
  },

  estatisticaNumero: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },

  secaoTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    overflow: "hidden",
  },

  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },

  iconeCard: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  iconeCardSucesso: {
    backgroundColor: "#DCFCE7",
  },

  iconeCardPendente: {
    backgroundColor: "#FEF3C7",
  },

  cardConteudo: {
    flex: 1,
  },

  cardTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  cardSubtitulo: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  cardRodape: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: "row",
  },

  statusContainer: {
    paddingHorizontal: 10,
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
    fontSize: 11,
    fontWeight: "600",
  },

  statusTextoSucesso: {
    color: "#15803D",
  },

  statusTextoPendente: {
    color: "#B45309",
  },

  detalhes: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },

  detalhesTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  detalheLinha: {
    marginBottom: 12,
  },

  detalheRotulo: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },

  detalheValor: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },

  turnoResumo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  turnoResumoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  turnoResumoTexto: {
    fontSize: 12,
    color: "#64748B",
  },

  entregaDoTurno: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD5E1",
  },

  entregaDoTurnoNome: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },

  textoSecundario: {
    fontSize: 12,
    color: "#64748B",
  },

  carregamento: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  estadoVazio: {
    paddingHorizontal: 30,
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  estadoVazioTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },

  estadoVazioDescricao: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },

  botaoTentarNovamente: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  botaoTentarNovamenteTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
