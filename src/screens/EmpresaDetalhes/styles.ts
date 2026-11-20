import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  conteudo: {
    padding: 16,
    paddingBottom: 36,
    gap: 14,
  },

  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "#f8fafc",
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },

  voltarTexto: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
  },

  titulo: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "700",
  },

  textoSecundario: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    gap: 7,
  },

  cardTitulo: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  label: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },

  valor: {
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 21,
  },

  acoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  botao: {
    flex: 1,
    minHeight: 44,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
