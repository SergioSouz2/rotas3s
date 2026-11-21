import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },

  textoSecundario: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
    minHeight: 0,
  },

  // Identificação da empresa
  identificacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 3,
  },

  iconeEmpresa: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },

  identificacaoTextos: {
    flex: 1,
    gap: 2,
  },

  nomeEmpresa: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },

  cnpj: {
    color: "#64748b",
    fontSize: 10,
  },

  // Cards de informações
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    gap: 5,
  },

  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },

  cardTitulo: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "700",
  },

  linha: {
    flexDirection: "row",
    gap: 10,
  },

  campo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  label: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "500",
  },

  valor: {
    color: "#0f172a",
    fontSize: 11,
    fontWeight: "600",
  },

  // Card de geolocalização
  cardMapa: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    gap: 6,
  },

  mapa: {
    flex: 1,
    width: "100%",
    minHeight: 0,
  },

  mapaContainer: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },

  semLocalizacao: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  // Botões de navegação
  acoes: {
    flexDirection: "row",
    gap: 8,
  },

  botao: {
    flex: 1,
    height: 36,
    backgroundColor: "#16a34a",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 6,
  },

  botaoDesabilitado: {
    opacity: 0.45,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },

  // Observações
  observacoes: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 10,
  },

  observacoesTexto: {
    flex: 1,
    color: "#475569",
    fontSize: 11,
  },

  // Modal para exibir campos completos
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 24,
  },

  modalFundo: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  modalConteudo: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    gap: 14,
    maxHeight: "75%",
  },

  modalCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  modalTitulo: {
    flex: 1,
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },

  modalTexto: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 22,
  },
});
